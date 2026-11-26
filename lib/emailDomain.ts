// Whether an email address's domain exists and takes email, asked of the
// internet's public address book (DNS) through Cloudflare's DNS service. Only
// the part after the @ is sent. Run on the server, with nothing but fetch, so
// it works on Vercel, in local development and in a Cloudflare Worker.
import { emailDomain } from "@/lib/emailAddress";

const DNS_SERVICE = "https://cloudflare-dns.com/dns-query";
// DNS answers: 0 is "here you go", 3 is "no such domain".
const FOUND = 0;
const NO_SUCH_DOMAIN = 3;

type DnsReply = { Status: number; Answer?: { type: number; data: string }[] };

async function lookUp(name: string, type: "MX", signal: AbortSignal) {
  const response = await fetch(`${DNS_SERVICE}?name=${encodeURIComponent(name)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
    signal,
  });
  if (!response.ok) throw new Error(`DNS lookup failed (${response.status})`);
  return (await response.json()) as DnsReply;
}

/**
 * The problem with an email address's domain, phrased for the visitor, or
 * undefined if it takes email. Also undefined when the lookup can't tell (the
 * DNS service is slow or down): better to let an address through than to turn
 * a customer away because of a hiccup.
 *
 * A domain takes email when it names its mail servers (MX records), as every
 * email service does. One without them, even with a website ("goonmail.com"),
 * is almost always a parked or typo domain, so it's turned away too.
 */
export async function emailDomainProblem(email: string): Promise<string | undefined> {
  const domain = emailDomain(email);
  try {
    const mail = await lookUp(domain, "MX", AbortSignal.timeout(3000));
    if (mail.Status === NO_SUCH_DOMAIN) {
      return `We couldn't find "${domain}". Check the email address`;
    }
    if (mail.Status !== FOUND) return undefined;
    const servers = (mail.Answer ?? []).filter((answer) => answer.type === 15);
    // None named, or a single "0 .": a domain saying it takes no email at all.
    if (servers.every((server) => /^0\s+\.$/.test(server.data.trim()))) {
      return `"${domain}" doesn't take email. Check the email address`;
    }
    return undefined;
  } catch {
    return undefined;
  }
}
