// Checks on the email address typed into the survey form, and the "Did you
// mean …?" suggestion under it. Used in the browser as people fill the form in,
// and again on the server. Whether the domain exists is checked on the server
// only, in lib/emailDomain.
import { emailEndings } from "@/lib/emailEndings";

// The characters real addresses use: letters, digits and . _ + ' - before the
// @ (no dot at either end or two in a row), then a domain of letters, digits
// and hyphens. Anything else, like the ? or % that could slip extras into an
// email link, is turned away.
const emailPattern =
  /^[A-Za-z0-9_+'-]+(?:\.[A-Za-z0-9_+'-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

// Email providers people in the UK use. An address at one of these is never
// flagged, and typos are checked against them.
const providers = [
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.co.uk", "outlook.com",
  "live.com", "live.co.uk", "msn.com", "yahoo.com", "yahoo.co.uk", "ymail.com",
  "rocketmail.com", "icloud.com", "me.com", "mac.com", "aol.com", "aol.co.uk",
  "btinternet.com", "btopenworld.com", "btconnect.com", "talk21.com", "sky.com",
  "virginmedia.com", "virgin.net", "blueyonder.co.uk", "ntlworld.com",
  "talktalk.net", "tiscali.co.uk", "plus.com", "zen.co.uk", "o2.co.uk",
  "orange.net", "tesco.net", "mail.com", "email.com", "inbox.com", "gmx.com",
  "gmx.co.uk", "protonmail.com", "protonmail.ch", "proton.me", "pm.me",
  "fastmail.com", "fastmail.fm", "hushmail.com", "mailbox.org", "zohomail.com",
  "zoho.com",
];
// Organisations with "mail" in their name, whose staff aren't using a made-up
// provider (see providerLike).
const mailNamedOrganisations = [
  "royalmail.com", "royalmail.co.uk", "royalmailgroup.com", "dailymail.co.uk", "mailchimp.com",
];
// Domain names made up to look like an email provider: ending in "mail" or
// "mails" (poopmail, coolmail, myemail), "inbox" or "mailbox". An address at
// one must be a real provider. Not names ending in "smail", like Ismail or
// Smail, which businesses are named after.
const providerLike = /(?:mails?|inbox|mailbox)$/;
const namedAfterSomeone = /smails?$/;
// The UK's own endings, which go before .uk (.co.uk, .org.uk…). An address can
// also end in plain .uk (company.uk).
const ukEndings = ["co", "org", "ltd", "plc", "me", "net", "ac", "gov", "nhs", "sch", "police", "mod"];
// Providers with names nobody's business is a letter away from. A near miss of
// one of these ("gmial.com", "hotmail.co") can't be a real address, so it's
// turned away. A near miss of a short one ("mo.com" for "me.com") may well be
// a real business, so it only gets the suggestion.
const distinctiveProviders = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.co.uk", "outlook.com",
  "yahoo.com", "yahoo.co.uk", "icloud.com", "btinternet.com", "btopenworld.com",
  "virginmedia.com", "blueyonder.co.uk", "ntlworld.com", "talktalk.net",
  "protonmail.com",
]);
// Mistyped endings and what they should be, for the suggestion. (Mistyped UK
// endings, like .cum.uk, are fixed by ukEndingTypo.)
const endingTypos: Record<string, string> = {
  con: "com", cpm: "com", cmo: "com", ocm: "com", vom: "com", xom: "com", comm: "com",
  "co.uj": "co.uk", "co.ul": "co.uk", "co.ik": "co.uk", "co.yk": "co.uk", "co.ukk": "co.uk",
  ner: "net", nte: "net",
};

/** The part after the @, in lower case. */
export function emailDomain(email: string) {
  const trimmed = email.trim();
  return trimmed.slice(trimmed.lastIndexOf("@") + 1).toLowerCase();
}

/** The problem with an email address, phrased for the visitor, or undefined if it's fine. */
export function emailProblem(email: string): string | undefined {
  if (!emailPattern.test(email) || email.indexOf("@") > 64) {
    return "Enter an email address like name@company.co.uk";
  }
  const domain = emailDomain(email);
  const ending = domain.slice(domain.lastIndexOf(".") + 1);
  if (!emailEndings.has(ending)) return `".${ending}" isn't a real email ending`;
  const ukTypo = ukEndingTypo(domain);
  if (ukTypo) return `".${ukTypo}.uk" isn't a real email ending`;
  const near = nearestProvider(domain);
  if (near && distinctiveProviders.has(near)) return `Check the spelling of "${domain}"`;
  const name = mainName(domain);
  if (
    providerLike.test(name) &&
    !namedAfterSomeone.test(name) &&
    !providers.includes(domain) &&
    !mailNamedOrganisations.includes(domain)
  ) {
    return `"${domain}" isn't an email provider we know. Check the email address`;
  }
  return undefined;
}

/**
 * The made-up UK ending in a domain, without its ".uk" ("cum" in
 * "ersenergy.cum.uk"), or undefined. A short word before .uk has to be one of
 * the UK's own endings (co, org, ltd…); a longer one is someone's own name
 * (mail.company.uk), so it's left alone.
 */
function ukEndingTypo(domain: string): string | undefined {
  const parts = domain.split(".");
  if (parts.length < 3 || parts.at(-1) !== "uk") return undefined;
  const beforeUk = parts.at(-2) ?? "";
  return beforeUk.length <= 4 && !ukEndings.includes(beforeUk) ? beforeUk : undefined;
}

/** A domain's own name, without its ending: "poopmail" in "poopmail.co.uk". */
function mainName(domain: string) {
  const parts = domain.split(".");
  const ukEnding = parts.length >= 3 && parts.at(-1) === "uk" && ukEndings.includes(parts.at(-2) ?? "");
  return parts.at(ukEnding ? -3 : -2) ?? "";
}

/**
 * The address the visitor probably meant, if it looks like a typo
 * ("jo@gmial.com" → "jo@gmail.com", "jo@company.co.uj" → "jo@company.co.uk"),
 * or undefined. Business domains are left alone unless their ending is off.
 */
export function suggestEmail(email: string): string | undefined {
  const at = email.trim().lastIndexOf("@");
  if (at < 1) return undefined;
  const local = email.trim().slice(0, at);
  const domain = emailDomain(email);
  let fixed = domain;
  for (const [typo, ending] of Object.entries(endingTypos)) {
    if (fixed.endsWith(`.${typo}`)) {
      fixed = `${fixed.slice(0, -typo.length)}${ending}`;
      break;
    }
  }
  // A made-up UK ending becomes the real one it's closest to (.cum.uk → .co.uk).
  const ukTypo = ukEndingTypo(fixed);
  if (ukTypo) {
    const closest = ukEndings.reduce((best, real) =>
      typoDistance(ukTypo, real) < typoDistance(ukTypo, best) ? real : best,
    );
    fixed = `${fixed.slice(0, -`${ukTypo}.uk`.length)}${closest}.uk`;
  }
  fixed = nearestProvider(fixed) ?? fixed;
  return fixed === domain ? undefined : `${local}@${fixed}`;
}

/**
 * The provider a domain is probably a typo of: one slip away (a missing,
 * extra, wrong or swapped letter), or two in a longer domain. Undefined for
 * a provider's own domain, or one that isn't close to any.
 */
function nearestProvider(domain: string): string | undefined {
  if (providers.includes(domain)) return undefined;
  let best: string | undefined;
  let bestDistance = Infinity;
  for (const provider of providers) {
    const distance = typoDistance(domain, provider);
    if (distance < bestDistance) [best, bestDistance] = [provider, distance];
  }
  return bestDistance === 1 || (bestDistance === 2 && domain.length >= 10) ? best : undefined;
}

/** How many single-letter slips turn one word into the other (swaps count as one). */
function typoDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}
