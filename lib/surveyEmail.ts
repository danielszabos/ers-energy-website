// The emails sent when someone requests a survey on the contact page: the
// request itself to ERS, and a confirmation to the customer. Sent through
// Resend (resend.com) with nothing but fetch, so the same code runs on Vercel,
// in local development and in a Cloudflare Worker.
import { company } from "@/lib/site";
import { contactPromise, type SurveyValues } from "@/lib/survey";

export type SurveyEmailSettings = {
  apiKey: string;
  /** Who both emails come from, e.g. "ERS Energy <info@ersenergy.co.uk>". */
  from: string;
  /** Who gets each request. */
  to: string[];
  /** Where a customer's reply to their confirmation goes. */
  replyTo: string;
  /** The website the emails link to and load their logo from, e.g. "https://ersenergy.co.uk". */
  site: string;
};

type Env = Record<string, string | undefined>;

const ERS_WEBSITE = "https://ersenergy.co.uk";

/**
 * The settings from environment variables (see .env.example), or null when
 * there's no Resend key. Only the key is required: by default both emails
 * come from, and requests go to, the address shown on the site.
 */
export function surveyEmailSettings(env: Env): SurveyEmailSettings | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  const to = (env.SURVEY_EMAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  return {
    apiKey,
    from: env.SURVEY_EMAIL_FROM?.trim() || `${company.shortName} <${company.email.display}>`,
    to: to.length > 0 ? to : [company.email.display],
    replyTo: env.SURVEY_EMAIL_REPLY_TO?.trim() || company.email.display,
    site: emailSite(env),
  };
}

// An email is opened far from this server, so the address its logo loads from
// has to be public: SURVEY_EMAIL_SITE_URL if it's set (localhost can't be
// reached from an inbox, so set it when testing locally), else the site's
// address on Vercel while it's hosted there, else ERS's own domain.
function emailSite(env: Env) {
  const configured = env.SURVEY_EMAIL_SITE_URL?.trim();
  if (configured && URL.canParse(configured)) return new URL(configured).origin;
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return vercel ? `https://${vercel}` : ERS_WEBSITE;
}

/**
 * Sends the request to ERS, then the customer's confirmation. Throws if the
 * request doesn't go: that's the one that matters, and the visitor is then
 * asked to call instead. A failed confirmation is only logged. `place` is
 * where the postcode is ("Wigan"), shown to ERS with it, if it's known.
 */
export async function sendSurveyEmails(
  request: SurveyValues,
  settings: SurveyEmailSettings,
  place?: string,
) {
  const received = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date());

  await send(settings, {
    to: settings.to,
    // Pressing Reply answers the customer directly.
    replyTo: request.email,
    ...requestEmail(request, received, settings.site, place),
  });

  try {
    await send(settings, {
      to: [request.email],
      replyTo: settings.replyTo,
      ...confirmationEmail(request, settings.site),
    });
  } catch (error) {
    console.error("Survey confirmation email wasn't sent", error);
  }
}

type Email = { to: string[]; replyTo: string; subject: string; text: string; html: string };

async function send(settings: SurveyEmailSettings, email: Email) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "ers-energy-website",
    },
    body: JSON.stringify({
      from: settings.from,
      to: email.to,
      reply_to: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend refused the email (${response.status}): ${detail.slice(0, 300)}`);
  }
}

// The request, for ERS. Everything the visitor typed is escaped before it goes
// into the HTML.
//
// It ends with buttons to email or call the customer, the way they'd prefer
// filled in green (both, if they didn't say). The email one starts a new email
// rather than a reply, so the customer doesn't get this request quoted back to
// them. Replying still reaches the customer too (Reply-To).
function requestEmail(r: SurveyValues, received: string, site: string, place?: string) {
  const postcode = place ? `${r.postcode} (${place})` : r.postcode;
  // The characters that start a subject, a copy to someone else or any other
  // extra in a mailto link are encoded, so an odd address can't add any.
  const address = r.email.replace(/[%?#&]/g, (character) => encodeURIComponent(character));
  const emailHref = `mailto:${address}?subject=${encodeURIComponent(`Your survey request with ${company.shortName}`)}`;
  const phoneHref = `tel:${r.phone.replace(/[^\d+]/g, "")}`;

  const rows: [label: string, value: string, href?: string][] = [
    ["Name", r.name],
    ["Business", r.business],
    ["Email", r.email, emailHref],
    ["Phone", r.phone, phoneHref],
    ["Preferred contact", r.preferredContact || "No preference given"],
    ["Site postcode", postcode],
    ["Service", r.service],
    ["Property type", r.property],
  ];

  const text = [
    "New survey request from the website",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Received: ${received}`,
  ].join("\n");

  const tableRows = rows
    .map(([label, value, href]) => {
      const shown = href
        ? `<a href="${escapeHtml(href)}" style="color:#3f7a1f;">${escapeHtml(value)}</a>`
        : escapeHtml(value);
      // Long values (an email address, mostly) may break onto a second line,
      // so the table never pushes the email wider than a phone screen.
      return `<tr><td style="padding:8px 16px 8px 0;color:#5f6661;vertical-align:top;">${label}</td><td style="padding:8px 0;color:#1e2420;font-weight:600;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${shown}</td></tr>`;
    })
    .join("");

  // What it's about at a glance, for the inbox's preview line.
  const preview = [
    r.name,
    r.preferredContact && `prefers ${r.preferredContact.toLowerCase()}`,
    r.service,
    r.property,
  ]
    .filter(Boolean)
    .join(" · ");

  const html = layout(
    "New survey request",
    preview,
    `<p style="margin:0 0 16px;">A survey request has come in through the website.</p>
     <table role="presentation" style="border-collapse:collapse;font-size:15px;">${tableRows}</table>
     <p style="margin:20px 0 0;color:#5f6661;font-size:13px;">Received ${escapeHtml(received)}</p>
     <table role="presentation" width="100%" style="border-collapse:collapse;margin:24px 0 0;"><tr>
       <td width="50%" style="width:50%;padding:0 5px 0 0;vertical-align:top;">${button(emailHref, "Email", r.preferredContact !== "Phone")}</td>
       <td width="50%" style="width:50%;padding:0 0 0 5px;vertical-align:top;">${button(phoneHref, "Call", r.preferredContact !== "Email")}</td>
     </tr></table>`,
    site,
  );

  const where = place ? `${r.postcode}, ${place}` : r.postcode;
  return { subject: `Survey request: ${r.business} (${where})`, text, html };
}

/**
 * A button that fills its half of the row, filled green or outlined, and works
 * across email apps: the colour and outline are on a table cell, which every
 * app draws, with the padding on the link for most apps and on the cell for
 * Outlook on a PC (mso-padding-alt), which ignores padding on links. Outlook
 * on a PC also shows it square rather than rounded.
 */
function button(href: string, label: string, filled: boolean) {
  const colour = filled ? "#8cc63e" : "#ffffff";
  const border = filled ? "#8cc63e" : "#1e2420";
  return `<table role="presentation" width="100%" style="border-collapse:separate;"><tr><td align="center" bgcolor="${colour}" style="background:${colour};border:2px solid ${border};border-radius:999px;mso-padding-alt:11px 12px;"><a href="${escapeHtml(href)}" style="display:block;padding:11px 12px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;line-height:20px;color:#1e2420;text-align:center;text-decoration:none;">${escapeHtml(label)}</a></td></tr></table>`;
}

// The customer's confirmation. It goes to whatever address was typed into the
// form, so it only repeats answers that can't carry a message of their own:
// ones picked from a list or checked against a strict format (service,
// property type, postcode, contact method), and the first name only when
// firstName below accepts it. Otherwise anyone could use the form to send their
// own words from ERS's address to someone else.
function confirmationEmail(r: SurveyValues, site: string) {
  const summary: [string, string][] = [
    ["Service", r.service],
    ["Property type", r.property],
    ["Site postcode", r.postcode],
  ];
  const first = firstName(r.name);
  const greeting = first ? `Hello ${first},` : "Hello,";
  const thanks = `Thanks for getting in touch with ${company.shortName}. We've received your request for a survey, and someone from the team will ${contactPromise(r.preferredContact)} soon to arrange it.`;

  const text = [
    greeting,
    "",
    thanks,
    "",
    "Your request",
    ...summary.map(([label, value]) => `${label}: ${value}`),
    "",
    `If it's urgent, call us on ${company.phone.display}.`,
    "",
    company.shortName,
    "",
    "You're getting this email because this address was used to request a survey on our website. If that wasn't you, you can ignore it.",
  ].join("\n");

  const html = layout(
    "We've received your survey request",
    `Thanks${first ? ` ${first}` : ""}, we'll ${contactPromise(r.preferredContact)} soon to arrange your survey.`,
    `<p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
     <p style="margin:0 0 16px;">${escapeHtml(thanks)}</p>
     <table role="presentation" style="border-collapse:collapse;font-size:15px;margin:0 0 16px;">${summary
       .map(
         ([label, value]) =>
           `<tr><td style="padding:6px 16px 6px 0;color:#5f6661;">${label}</td><td style="padding:6px 0;color:#1e2420;font-weight:600;">${escapeHtml(value)}</td></tr>`,
       )
       .join("")}</table>
     <p style="margin:0 0 16px;">If it's urgent, call us on <a href="${company.phone.href}" style="color:#3f7a1f;font-weight:600;">${company.phone.display}</a>.</p>
     <p style="margin:0;">${company.shortName}</p>
     <p style="margin:24px 0 0;color:#5f6661;font-size:13px;">You're getting this email because this address was used to request a survey on our website. If that wasn't you, you can ignore it.</p>`,
    site,
  );

  return { subject: "We've received your survey request", text, html };
}

// English and European letters: A to Z plus accented ones like é, ł and ș.
// No digits, dots, slashes, spaces or symbols, so a name can't spell out a
// link or a sentence.
const nameLetters = "A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF\\u0100-\\u017F\\u0218-\\u021B";
// Runs of letters, which may be joined by one hyphen or apostrophe
// (Anne-Marie, O'Neil, D’Arcy).
const firstNamePattern = new RegExp(`^[${nameLetters}]+(?:['’-][${nameLetters}]+)*$`);
// Words people type before their name. "Mr Smith" shouldn't become "Hello Mr,".
const notFirstNames = new Set([
  "mr", "mrs", "ms", "miss", "mx", "dr", "prof", "sir", "dame", "lord", "lady",
  "rev", "revd", "fr", "cllr", "capt", "the",
]);

/**
 * The first name to greet the customer by, or null to just say "Hello". Only
 * the first word of the name is used, and only when it's clearly a name: 2 to
 * 20 letters, not a title. "daniel" and "DANIEL" become "Daniel"; a name typed
 * in mixed case, like McDonald, is kept as typed.
 */
function firstName(name: string): string | null {
  const word = name.normalize("NFC").trim().split(/\s+/)[0];
  if (word.length < 2 || word.length > 20) return null;
  if (!firstNamePattern.test(word) || notFirstNames.has(word.toLowerCase())) return null;
  if (word !== word.toLowerCase() && word !== word.toUpperCase()) return word;
  return word
    .toLowerCase()
    .replace(/(^|['’-])(.)/g, (_, joiner: string, letter: string) => joiner + letter.toUpperCase());
}

/**
 * A plain, widely supported email layout, with the company details UK law asks
 * business emails to carry.
 *
 * The logo in the dark band at the top is a picture loaded from the website,
 * and some email apps (Outlook on a PC, mainly) don't load pictures until the
 * reader allows it. The email reads fine without it: the band is coloured in
 * the email itself, the picture's fixed size keeps the layout from shifting,
 * and in its place those apps show "ERS Energy" in white, styled to match. The
 * picture has the band's colour behind the logo, so the white lettering stays
 * readable in apps that recolour emails in dark mode (they never recolour
 * pictures).
 *
 * `preview` is the line inbox lists show under the subject. It's hidden in the
 * email itself, and followed by a run of invisible characters so inbox apps
 * don't fill the rest of the line with the start of the email.
 */
function layout(heading: string, preview: string, body: string, site: string) {
  const details = `${company.name}. Registered in ${company.registeredIn}, company number ${company.companyNumber}. Registered office: ${company.registeredOffice.join(", ")}.`;
  const logo = new URL("/email/ers-logo.png", site).href;
  const filler = "&#847;&zwnj;&nbsp;&#8199;&shy;".repeat(60);
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f5f3;">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f5f3;opacity:0;">${escapeHtml(preview)}${filler}</div>
<table role="presentation" width="100%" style="border-collapse:collapse;background:#f4f5f3;"><tr><td style="padding:24px 12px;">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;border-collapse:collapse;background:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1e2420;">
<tr><td bgcolor="#1e2420" style="background:#1e2420;padding:10px 20px;"><a href="${escapeHtml(site)}" style="text-decoration:none;"><img src="${escapeHtml(logo)}" width="156" height="79" alt="ERS Energy" style="display:block;width:156px;height:79px;border:0;outline:none;text-decoration:none;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;line-height:79px;"></a></td></tr>
<tr><td style="padding:28px;"><h1 style="margin:0 0 16px;font-size:21px;line-height:1.3;">${heading}</h1>${body}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #e4e6e3;color:#5f6661;font-size:12px;line-height:1.5;">${escapeHtml(details)}</td></tr>
</table></td></tr></table></body></html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
