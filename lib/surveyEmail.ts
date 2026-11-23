// The emails sent when someone requests a survey on the contact page: the
// request itself to ERS, and a confirmation to the customer. Sent through
// Resend (resend.com) with nothing but fetch, so the same code runs on Vercel,
// in local development and in a Cloudflare Worker.
import { company } from "@/lib/site";
import type { SurveyValues } from "@/lib/survey";

export type SurveyEmailSettings = {
  apiKey: string;
  /** Who both emails come from, e.g. "ERS Energy <info@ersenergy.co.uk>". */
  from: string;
  /** Who gets each request. */
  to: string[];
  /** Where a customer's reply to their confirmation goes. */
  replyTo: string;
};

type Env = Record<string, string | undefined>;

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
  };
}

/**
 * Sends the request to ERS, then the customer's confirmation. Throws if the
 * request doesn't go: that's the one that matters, and the visitor is then
 * asked to call instead. A failed confirmation is only logged.
 */
export async function sendSurveyEmails(request: SurveyValues, settings: SurveyEmailSettings) {
  const received = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date());

  await send(settings, {
    to: settings.to,
    // Pressing Reply answers the customer directly.
    replyTo: request.email,
    ...requestEmail(request, received),
  });

  try {
    await send(settings, {
      to: [request.email],
      replyTo: settings.replyTo,
      ...confirmationEmail(request),
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
function requestEmail(r: SurveyValues, received: string) {
  const rows: [label: string, value: string, href?: string][] = [
    ["Name", r.name],
    ["Business", r.business],
    ["Email", r.email, `mailto:${r.email}`],
    ["Phone", r.phone, `tel:${r.phone.replace(/[^\d+]/g, "")}`],
    ["Site postcode", r.postcode],
    ["Service", r.service],
    ["Property type", r.property],
  ];

  const text = [
    "New survey request from the website",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Received: ${received}`,
    "",
    `Reply to this email to answer ${r.name} directly.`,
  ].join("\n");

  const tableRows = rows
    .map(([label, value, href]) => {
      const shown = href
        ? `<a href="${escapeHtml(href)}" style="color:#3f7a1f;">${escapeHtml(value)}</a>`
        : escapeHtml(value);
      return `<tr><td style="padding:8px 16px 8px 0;color:#5f6661;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 0;color:#1e2420;font-weight:600;">${shown}</td></tr>`;
    })
    .join("");

  const html = layout(
    "New survey request",
    `<p style="margin:0 0 16px;">A survey request has come in through the website.</p>
     <table role="presentation" style="border-collapse:collapse;font-size:15px;">${tableRows}</table>
     <p style="margin:20px 0 0;color:#5f6661;font-size:13px;">Received ${escapeHtml(received)}</p>
     <p style="margin:16px 0 0;">Reply to this email to answer ${escapeHtml(r.name)} directly.</p>`,
  );

  return { subject: `Survey request: ${r.business} (${r.postcode})`, text, html };
}

// The customer's confirmation. It only repeats answers picked from a list or
// checked against a strict format (service, property type, postcode), never
// free text, so nobody can use the form to send their own words from ERS's
// address to someone else.
function confirmationEmail(r: SurveyValues) {
  const summary: [string, string][] = [
    ["Service", r.service],
    ["Property type", r.property],
    ["Site postcode", r.postcode],
  ];

  const text = [
    "Hello,",
    "",
    `Thanks for getting in touch with ${company.shortName}. We've received your request for a survey, and someone from the team will be in touch soon to arrange it.`,
    "",
    "Your request",
    ...summary.map(([label, value]) => `${label}: ${value}`),
    "",
    `If it's urgent, call us on ${company.phone.display}, or reply to this email.`,
    "",
    company.shortName,
    "",
    "You're getting this email because this address was used to request a survey on our website. If that wasn't you, you can ignore it.",
  ].join("\n");

  const html = layout(
    "We've received your survey request",
    `<p style="margin:0 0 16px;">Hello,</p>
     <p style="margin:0 0 16px;">Thanks for getting in touch with ${company.shortName}. We've received your request for a survey, and someone from the team will be in touch soon to arrange it.</p>
     <table role="presentation" style="border-collapse:collapse;font-size:15px;margin:0 0 16px;">${summary
       .map(
         ([label, value]) =>
           `<tr><td style="padding:6px 16px 6px 0;color:#5f6661;">${label}</td><td style="padding:6px 0;color:#1e2420;font-weight:600;">${escapeHtml(value)}</td></tr>`,
       )
       .join("")}</table>
     <p style="margin:0 0 16px;">If it's urgent, call us on <a href="${company.phone.href}" style="color:#3f7a1f;font-weight:600;">${company.phone.display}</a>, or reply to this email.</p>
     <p style="margin:0;">${company.shortName}</p>
     <p style="margin:24px 0 0;color:#5f6661;font-size:13px;">You're getting this email because this address was used to request a survey on our website. If that wasn't you, you can ignore it.</p>`,
  );

  return { subject: "We've received your survey request", text, html };
}

/** A plain, widely supported email layout, with the company details UK law asks business emails to carry. */
function layout(heading: string, body: string) {
  const details = `${company.name}. Registered in ${company.registeredIn}, company number ${company.companyNumber}. Registered office: ${company.registeredOffice.join(", ")}.`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f5f3;">
<table role="presentation" width="100%" style="border-collapse:collapse;background:#f4f5f3;"><tr><td style="padding:24px 12px;">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;border-collapse:collapse;background:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1e2420;">
<tr><td style="background:#1e2420;padding:18px 28px;color:#ffffff;font-weight:700;font-size:17px;">ERS <span style="color:#8cc63e;">Energy</span></td></tr>
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
