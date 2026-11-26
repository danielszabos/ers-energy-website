// Lets the tests import the site's code as the site does: "@/lib/survey" means
// lib/survey.ts at the project's root (tsconfig's "paths"). Node reads the
// TypeScript itself, so the tests need nothing installed. Loaded by the test
// scripts in package.json with --import.
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      for (const ending of [".ts", ".tsx", "/index.ts"]) {
        const file = new URL(specifier.slice(2) + ending, root);
        if (existsSync(fileURLToPath(file))) return nextResolve(file.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
