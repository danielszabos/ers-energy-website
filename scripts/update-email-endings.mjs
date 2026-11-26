// Rewrites lib/emailEndings.ts from IANA's list of the internet's top-level
// domains (the last part of an address, like "com" or "uk"). New ones appear
// now and then, so run this once in a while: node scripts/update-email-endings.mjs
import { writeFileSync } from "node:fs";

const source = "https://data.iana.org/TLD/tlds-alpha-by-domain.txt";
const response = await fetch(source);
if (!response.ok) throw new Error(`Couldn't download the list (${response.status})`);
const lines = (await response.text()).split("\n").map((line) => line.trim()).filter(Boolean);
const version = lines[0].replace(/^#\s*/, "");
// Endings in other alphabets (xn--…) are left out: the form only takes plain letters.
const endings = lines.slice(1).filter((line) => /^[A-Z]+$/.test(line)).map((line) => line.toLowerCase());
if (!endings.includes("com") || !endings.includes("uk")) throw new Error("The list doesn't look right");

// About 100 characters to a line.
const rows = [];
for (const ending of endings) {
  if (!rows.length || rows.at(-1).length + ending.length > 96) rows.push(ending);
  else rows[rows.length - 1] += ` ${ending}`;
}

writeFileSync(
  new URL("../lib/emailEndings.ts", import.meta.url),
  `// The internet's top-level domains, the last part of an address (com, uk,
// london…), from ${source}
// ${version}. ${endings.length} endings.
// Written by scripts/update-email-endings.mjs: run it once in a while to pick
// up new ones.
export const emailEndings: ReadonlySet<string> = new Set(
  \`
${rows.join("\n")}
\`
    .trim()
    .split(/\\s+/),
);
`,
);
console.log(`lib/emailEndings.ts: ${endings.length} endings (${version})`);
