// The survey form's live lookups, so they need the internet: `npm run
// test:online`. Whether email domains exist and take email (lib/emailDomain),
// and whether postcodes exist and where they are (lib/postcodeLookup). The
// rest of the form's checks are in contact-form.test.ts.
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { emailDomainProblem } from "@/lib/emailDomain";
import { lookUpPostcode } from "@/lib/postcodeLookup";

// Real UK email providers and organisations: every one must be found.
const realDomains = [
  "gmail.com", "googlemail.com", "hotmail.co.uk", "hotmail.com", "outlook.com", "live.co.uk", "live.com",
  "msn.com", "yahoo.co.uk", "yahoo.com", "ymail.com", "rocketmail.com", "icloud.com", "me.com", "mac.com",
  "aol.co.uk", "aol.com", "btinternet.com", "btopenworld.com", "btconnect.com", "talk21.com", "sky.com",
  "virginmedia.com", "virgin.net", "blueyonder.co.uk", "ntlworld.com", "talktalk.net", "tiscali.co.uk",
  "zen.co.uk", "email.com", "mail.com", "gmx.co.uk", "protonmail.com", "proton.me", "ersenergy.co.uk",
  "kendalworks.co.uk", "nhs.net", "manchester.gov.uk", "wigan.gov.uk", "ox.ac.uk", "manchester.ac.uk",
  "bbc.co.uk", "tesco.com", "parliament.uk", "royalmail.com",
];

// Domains that can't take email, and part of the message each gets.
const noEmail: [domain: string, message: string][] = [
  ["ersenegy.co.uk", "We couldn't find"],
  ["this-company-does-not-exist-4821.co.uk", "We couldn't find"],
  ["goonmail.com", "doesn't take email"],
  ["example.com", "doesn't take email"],
];

// Real postcodes, and where the enquiry says they are.
const realPostcodes: [postcode: string, place: string][] = [
  ["WN7 1AP", "Wigan"],
  ["OL11 2YW", "Rochdale"],
  ["WA14 2DT", "Trafford"],
  ["M1 1AE", "Manchester"],
  ["SW1A 1AA", "Westminster"],
  ["TR1 1UH", "Truro, Cornwall"],
  ["PE29 6XU", "Huntingdon, Huntingdonshire"],
  ["BT1 1AA", "Belfast"],
  ["EH1 1YZ", "City of Edinburgh"],
];

describe("real email domains are found", () => {
  for (const domain of realDomains) {
    test(domain, async () => assert.equal(await emailDomainProblem(`jo@${domain}`), undefined));
  }
});

describe("domains that can't take email are turned away", () => {
  for (const [domain, message] of noEmail) {
    test(domain, async () => {
      const problem = await emailDomainProblem(`jo@${domain}`);
      assert.ok(problem?.includes(message), `expected "${message}", got ${JSON.stringify(problem)}`);
    });
  }
});

describe("real postcodes are found, with where they are", () => {
  for (const [postcode, place] of realPostcodes) {
    test(`${postcode} (${place})`, async () => {
      assert.deepEqual(await lookUpPostcode(postcode), { found: true, place });
    });
  }
});

describe("postcodes that aren't listed", () => {
  test("in a real district, can be sent anyway (a new building's may not be listed yet)", async () => {
    const result = await lookUpPostcode("WN7 9ZZ");
    assert.equal(result?.found, false);
    assert.equal(result.found === false && result.canConfirm, true);
  });
  test("in a district that doesn't exist, are turned away", async () => {
    const result = await lookUpPostcode("WN99 9ZZ");
    assert.equal(result?.found, false);
    assert.equal(result.found === false && result.canConfirm, false);
    assert.match(result.found === false ? result.problem : "", /There are no UK postcodes starting "WN99"/);
  });
});
