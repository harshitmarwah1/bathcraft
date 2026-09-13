/**
 * Lists every string passed to t()/tr() that has no Hindi translation.
 *
 *   npm run check:i18n
 *
 * A missing entry is not a crash — useT falls back to the English — which is
 * exactly why it needs a report: a silent fallback is invisible until someone
 * switches language and finds half a page still in English.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const QUOTE = String.fromCharCode(34);
const ESC = String.fromCharCode(92);

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d)) {
    if (e === "node_modules" || e === ".next" || e.startsWith(".")) continue;
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) files.push(p);
  }
};
["app", "components", "lib"].forEach(walk);

const IDENT = /[A-Za-z0-9_$.]/;

/** Reads a double-quoted literal starting at `j`; returns [value, nextIndex]. */
function readString(src, j) {
  let s = "";
  j++;
  while (j < src.length && src[j] !== QUOTE) {
    if (src[j] === ESC) { s += src[j + 1]; j += 2; continue; }
    s += src[j++];
  }
  return [s, j + 1];
}

function literalsIn(src) {
  const out = [];
  for (const call of ["t(", "tr("]) {
    let i = 0;
    while ((i = src.indexOf(call, i)) !== -1) {
      const before = src[i - 1] || " ";
      const start = i;
      i += call.length;
      if (IDENT.test(before)) continue;
      let j = i;
      while (j < src.length && (src[j] === " " || src[j] === "\n" || src[j] === "\r")) j++;
      if (src[j] !== QUOTE) continue;
      const [value] = readString(src, j);
      if (value) out.push(value);
      void start;
    }
  }
  return out;
}

const used = new Map();
for (const f of files) {
  if (f.includes(join("lib", "i18n"))) continue;
  for (const k of literalsIn(readFileSync(f, "utf8"))) if (!used.has(k)) used.set(k, f);
}

const have = new Set();
for (const line of readFileSync(join("lib", "i18n", "dictionary.ts"), "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed.startsWith(QUOTE)) continue;
  const [value] = readString(trimmed, 0);
  if (value) have.add(value);
}

const missing = [...used.entries()].filter(([k]) => !have.has(k));
console.log("");
console.log("t() call sites with a literal : " + used.size);
console.log("dictionary entries           : " + have.size);
console.log("MISSING translations         : " + missing.length);
console.log("");
for (const [k, f] of missing) console.log("  " + f + "\n    " + QUOTE + k.slice(0, 88) + QUOTE);
if (missing.length) process.exitCode = 1;
else console.log("  every translated string has a Hindi entry.\n");
