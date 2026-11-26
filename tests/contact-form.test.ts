// The survey form's checks: email addresses, phone numbers, postcodes and the
// confirmation email's greeting. What must get through, and what must be
// turned away. Run `npm test` (a second or two, no internet needed) whenever
// the rules change. To protect an address or number, or to make sure one stays
// blocked, add it to the right list below.
//
// Whether email domains and postcodes exist is looked up online, so that's
// tested separately: `npm run test:online` (tests/lookups.online-test.ts).
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { emailProblem, suggestEmail } from "@/lib/emailAddress";
import { emptySurvey, normaliseSurvey, validateField, type SurveyValues } from "@/lib/survey";
import { sendSurveyEmails, surveyEmailSettings } from "@/lib/surveyEmail";

// Addresses real customers could have. Every one must be accepted, with no
// "Did you mean …?" either. (The online tests check real domains exist.)
const genuineEmails = [
  // The big providers
  "jo@gmail.com", "jo@googlemail.com", "jo@hotmail.co.uk", "jo@hotmail.com", "jo@outlook.com",
  "jo@live.co.uk", "jo@live.com", "jo@msn.com", "jo@yahoo.co.uk", "jo@yahoo.com", "jo@ymail.com",
  "jo@rocketmail.com", "jo@icloud.com", "jo@me.com", "jo@mac.com", "jo@aol.co.uk", "jo@aol.com",
  // UK internet providers, old and new
  "jo@btinternet.com", "jo@btopenworld.com", "jo@btconnect.com", "jo@talk21.com", "jo@sky.com",
  "jo@virginmedia.com", "jo@virgin.net", "jo@blueyonder.co.uk", "jo@ntlworld.com", "jo@talktalk.net",
  "jo@tiscali.co.uk", "jo@zen.co.uk", "jo@username.plus.com",
  // Other email services
  "jo@mail.com", "jo@email.com", "jo@inbox.com", "jo@gmx.co.uk", "jo@protonmail.com", "jo@proton.me",
  "jo@fastmail.com", "jo@hushmail.com", "jo@mailbox.org",
  // Businesses and organisations
  "info@ersenergy.co.uk", "jane.hourigan@ersenergy.co.uk", "jo@kendalworks.co.uk", "jo@company.uk",
  "jo@charity.org.uk", "jo@firm.ltd.uk", "jo@bigco.plc.uk", "jo@uni.ac.uk", "jo@cs.ox.ac.uk",
  "jo@council.gov.uk", "jo@trust.nhs.uk", "jo@nhs.net", "jo@school.sch.uk", "jo@met.police.uk",
  "jo@army.mod.uk", "jo@parliament.uk", "jo@mail.company.co.uk", "jo@mail.company.uk",
  "jo@company.scot", "jo@company.wales", "jo@company.london", "jo@company.io", "jo@company.ie",
  // "mail" in the name, but genuine
  "jo@royalmail.com", "jo@dailymail.co.uk", "jo@mailchimp.com", "jo@ismail.co.uk",
  "jo@ismail-builders.co.uk", "jo@esmail-roofing.com", "jo@mailroom.co.uk",
  // How people write their own part of the address
  "jo.bloggs@company.co.uk", "jo+quotes@gmail.com", "o'neil@company.co.uk", "first_last@company.co.uk",
  "j-o@x-y.io", "JO.BLOGGS@COMPANY.CO.UK", "Jo@Gmail.com", "sandwich@gmail.com",
];

// Addresses that can't work, and the start of the message each one gets.
const blockedEmails: [email: string, message: string][] = [
  // Not an email address at all
  ["jo@company", "Enter an email address"],
  ["jo@company.c", "Enter an email address"],
  ["jo@.com", "Enter an email address"],
  ["jo@company..com", "Enter an email address"],
  ["jo@-company.com", "Enter an email address"],
  [".jo@company.com", "Enter an email address"],
  ["jo.@company.com", "Enter an email address"],
  ["jo..bloggs@company.com", "Enter an email address"],
  ["jo bloggs@company.com", "Enter an email address"],
  ["@company.com", "Enter an email address"],
  ["jo@@company.com", "Enter an email address"],
  // Characters that could slip extras into an email link
  ["jo@company.com?bcc=evil%40x.com", "Enter an email address"],
  ["jo%40x@company.com", "Enter an email address"],
  // Endings that don't exist
  ["jo@gmail.con", '".con" isn\'t a real email ending'],
  ["jo@company.comm", '".comm" isn\'t a real email ending'],
  ["jo@hotmail.co.uj", '".uj" isn\'t a real email ending'],
  ["jo@ersenergy.com.uk", '".com.uk" isn\'t a real email ending'],
  ["jo@ersenergy.cum.uk", '".cum.uk" isn\'t a real email ending'],
  ["jo@company.orh.uk", '".orh.uk" isn\'t a real email ending'],
  ["jo@company.cp.uk", '".cp.uk" isn\'t a real email ending'],
  // Misspellings of the big providers
  ["jo@gmial.com", "Check the spelling"],
  ["jo@gamil.com", "Check the spelling"],
  ["jo@gmail.co", "Check the spelling"],
  ["jo@hotmial.co.uk", "Check the spelling"],
  ["jo@hotmails.com", "Check the spelling"],
  ["jo@hotmail.co", "Check the spelling"],
  ["jo@outlok.com", "Check the spelling"],
  ["jo@yaho.co.uk", "Check the spelling"],
  ["jo@iclod.com", "Check the spelling"],
  ["jo@btinternt.com", "Check the spelling"],
  // Made-up providers
  ["jo@poopmail.com", "\"poopmail.com\" isn't an email provider we know"],
  ["jo@goonmail.com", "\"goonmail.com\" isn't an email provider we know"],
  ["daniel@fuckyoumail.com", "\"fuckyoumail.com\" isn't an email provider we know"],
  ["jo@fuck-you-mail.com", "\"fuck-you-mail.com\" isn't an email provider we know"],
  ["jo@coolmail.co.uk", "\"coolmail.co.uk\" isn't an email provider we know"],
  ["jo@freemails.com", "\"freemails.com\" isn't an email provider we know"],
  ["jo@superinbox.co.uk", "\"superinbox.co.uk\" isn't an email provider we know"],
  ["jo@gmail.co.uk", "\"gmail.co.uk\" isn't an email provider we know"],
  ["jo@googlemail.co.uk", "\"googlemail.co.uk\" isn't an email provider we know"],
];

// Typos and the address the "Did you mean …?" offers.
const emailSuggestions: [typed: string, suggested: string][] = [
  ["jo@gmial.com", "jo@gmail.com"],
  ["jo@gmail.con", "jo@gmail.com"],
  ["jo@gmial.con", "jo@gmail.com"],
  ["jo@hotmial.co.uk", "jo@hotmail.co.uk"],
  ["jo@hotmail.co.uj", "jo@hotmail.co.uk"],
  ["jo@outlok.com", "jo@outlook.com"],
  ["jo@btinternt.com", "jo@btinternet.com"],
  ["jo@ersenergy.com.uk", "jo@ersenergy.co.uk"],
  ["jo@ersenergy.cum.uk", "jo@ersenergy.co.uk"],
  ["jo@company.orh.uk", "jo@company.org.uk"],
  ["jo@company.con", "jo@company.com"],
];

// Phone numbers as people type them, and how the enquiry shows them.
const genuinePhones: [typed: string, shown: string][] = [
  ["07523 817995", "07523 817995"],
  ["07523817995", "07523 817995"],
  ["+447523817995", "07523 817995"],
  ["+44 7523 817995", "07523 817995"],
  ["+44 (0)7523 817995", "07523 817995"],
  ["0044 7523 817995", "07523 817995"],
  ["+44 07523 817995", "07523 817995"],
  ["(0161) 496 0000", "0161 496 0000"],
  ["0161-496-0000", "0161 496 0000"],
  ["0161.496.0000", "0161 496 0000"],
  ["01942 368021", "01942 368021"],
  ["020 7946 0000", "020 7946 0000"],
  ["+44 20 7946 0000", "020 7946 0000"],
  ["029 2018 0000", "029 2018 0000"],
  ["0113 496 0000", "0113 496 0000"],
  ["01697 72345", "01697 72345"],
  ["0300 123 4567", "0300 123 4567"],
  ["0800 123 456", "0800 123 456"],
  ["0800 123 4567", "0800 123 4567"],
  ["0845 600 1234", "0845 600 1234"],
  ["+353 87 123 4567", "+353871234567"],
  ["00353 87 123 4567", "+353871234567"],
  ["+1 (212) 555-0123", "+12125550123"],
  ["+33 6 12 34 56 78", "+33612345678"],
];

// Phone numbers that can't be right, and the start of the message each gets.
const blockedPhones: [phone: string, message: string][] = [
  ["+4475238179", "Mobile numbers have 11 digits"],
  ["0752381799", "Mobile numbers have 11 digits"],
  ["07523 8179950", "Mobile numbers have 11 digits"],
  ["1234567890", "Start with 0 for a UK number"],
  ["7523817995", "Start with 0 for a UK number"],
  ["0000000000", "Enter the full number"],
  ["0123", "Enter the full number"],
  ["0412345678", "Enter the full number"],
  ["0900 123 4567", "Please give a number that isn't premium rate"],
  ["+0 123 456 789", "Enter the full number, including the country code"],
  ["+353 87", "Enter the full number, including the country code"],
  ["123-ABC-4567", "Enter a phone number using only digits"],
  ["07523 817995 ext 2", "Enter a phone number using only digits"],
  ["", "Enter your phone number"],
];

// Postcodes as people type them, and how they're shown. (Whether the whole
// postcode exists is looked up online: tests/lookups.online-test.ts.)
const genuinePostcodes: [typed: string, shown: string][] = [
  ["WN7 1AP", "WN7 1AP"],
  ["wn71ap", "WN7 1AP"],
  ["  wn7   1ap ", "WN7 1AP"],
  ["M1 1AE", "M1 1AE"],
  ["SW1A 1AA", "SW1A 1AA"],
  ["EC1A 1BB", "EC1A 1BB"],
  ["B33 8TH", "B33 8TH"],
  ["ol11 2yw", "OL11 2YW"],
  ["BT1 1AA", "BT1 1AA"],
  ["EH1 1YZ", "EH1 1YZ"],
  ["CF10 1AA", "CF10 1AA"],
  ["TR1 1UH", "TR1 1UH"],
  ["ZE1 0LL", "ZE1 0LL"],
];
// Postcodes that can't be right, and the start of the message each gets.
const blockedPostcodes: [postcode: string, message: string][] = [
  ["AA1 1AA", 'There are no UK postcodes starting "AA"'],
  ["ZZ9 9ZZ", 'There are no UK postcodes starting "ZZ"'],
  ["XY1 2AB", 'There are no UK postcodes starting "XY"'],
  ["QA1 1AA", 'There are no UK postcodes starting "QA"'],
  ["WN7", "Enter a full UK postcode"],
  ["12345", "Enter a full UK postcode"],
  ["WN7 1A", "Enter a full UK postcode"],
  ["WN7 1APP", "Enter a full UK postcode"],
  ["1WN 7AP", "Enter a full UK postcode"],
  ["", "Enter the postcode of the building"],
];

// The name typed in the form, and how the confirmation email greets them. Only
// a plain first name is used, so the form can't carry anyone's message.
const greetings: [name: string, greeting: string][] = [
  ["Daniel Szabo", "Hello Daniel,"],
  ["daniel szabo", "Hello Daniel,"],
  ["DANIEL SZABO", "Hello Daniel,"],
  ["Anne-Marie Jones", "Hello Anne-Marie,"],
  ["o'neil smith", "Hello O'Neil,"],
  ["McDonald", "Hello McDonald,"],
  ["José García", "Hello José,"],
  ["Łukasz Nowak", "Hello Łukasz,"],
  ["Mr Smith", "Hello,"],
  ["Dr. Jones", "Hello,"],
  ["J Smith", "Hello,"],
  ["Claim your £500 refund at dodgy-link.com", "Hello Claim,"],
  ["www.evil.com", "Hello,"],
  ["<script>alert(1)</script>", "Hello,"],
  ["Free£500", "Hello,"],
  ["Рау", "Hello,"],
];

describe("email addresses real customers could have are accepted", () => {
  for (const email of genuineEmails) {
    test(email, () => {
      assert.equal(validateField("email", email), undefined);
      assert.equal(suggestEmail(email), undefined, "and no 'Did you mean' for it");
    });
  }
});

describe("email addresses that can't work are turned away", () => {
  for (const [email, message] of blockedEmails) {
    test(email, () => {
      const problem = emailProblem(email);
      assert.ok(problem?.startsWith(message), `expected "${message}…", got ${JSON.stringify(problem)}`);
    });
  }
});

describe("typos get the right 'Did you mean …?'", () => {
  for (const [typed, suggested] of emailSuggestions) {
    test(`${typed} → ${suggested}`, () => assert.equal(suggestEmail(typed), suggested));
  }
});

describe("phone numbers are accepted however they're written", () => {
  for (const [typed, shown] of genuinePhones) {
    test(`${typed} → ${shown}`, () => {
      assert.equal(validateField("phone", typed), undefined);
      assert.equal(normaliseSurvey({ ...emptySurvey, postcode: "WN71AP", phone: typed }).phone, shown);
    });
  }
});

describe("phone numbers that can't be right are turned away", () => {
  for (const [phone, message] of blockedPhones) {
    test(phone || "(empty)", () => {
      const problem = validateField("phone", phone);
      assert.ok(problem?.startsWith(message), `expected "${message}…", got ${JSON.stringify(problem)}`);
    });
  }
});

describe("postcodes", () => {
  for (const [typed, shown] of genuinePostcodes) {
    test(`${typed} → ${shown}`, () => {
      assert.equal(validateField("postcode", typed), undefined);
      assert.equal(normaliseSurvey({ ...emptySurvey, postcode: typed }).postcode, shown);
    });
  }
  for (const [postcode, message] of blockedPostcodes) {
    test(`${postcode || "(empty)"} is turned away`, () => {
      const problem = validateField("postcode", postcode);
      assert.ok(problem?.startsWith(message), `expected "${message}…", got ${JSON.stringify(problem)}`);
    });
  }
});

describe("the enquiry shows where the postcode is", () => {
  test("with the town it was looked up as", async () => {
    const [enquiry] = await emailsFor("Daniel Szabo", "Wigan");
    assert.match(enquiry.subject, /\(WN7 1AP, Wigan\)$/);
    assert.match(enquiry.text, /^Site postcode: WN7 1AP \(Wigan\)$/m);
  });
  test("with just the postcode if the town isn't known", async () => {
    const [enquiry] = await emailsFor("Daniel Szabo");
    assert.match(enquiry.subject, /\(WN7 1AP\)$/);
    assert.match(enquiry.text, /^Site postcode: WN7 1AP$/m);
  });
});

describe("the confirmation email greets people safely", () => {
  for (const [name, greeting] of greetings) {
    test(`${name} → ${greeting}`, async () => {
      const [, confirmation] = await emailsFor(name);
      assert.equal(confirmation.text.split("\n")[0], greeting);
      // Whatever was typed only ever appears as the plain greeting.
      assert.ok(!confirmation.html.includes(name) || greeting.includes(name), "the name isn't repeated as typed");
    });
  }
});

/**
 * The enquiry and confirmation emails for a request from `name` at WN7 1AP
 * (in `place`, if given), with sending replaced so nothing goes out.
 */
async function emailsFor(name: string, place?: string) {
  const sent: { subject: string; text: string; html: string }[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    sent.push(JSON.parse(String(init?.body)));
    return new Response("{}", { status: 200 });
  };
  try {
    const request: SurveyValues = {
      ...emptySurvey,
      name,
      business: "Test Ltd",
      email: "customer@example.com",
      phone: "07123 456789",
      postcode: "WN7 1AP",
      service: "Not sure yet",
      property: "Office",
    };
    const settings = surveyEmailSettings({ RESEND_API_KEY: "test" });
    assert.ok(settings);
    await sendSurveyEmails(request, settings, place);
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.equal(sent.length, 2, "an enquiry and a confirmation");
  return sent;
}
