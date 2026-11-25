import * as fs from "node:fs";
import * as path from "node:path";

// The confession: an agent overwrote the user's novel, then scored its
// own replacement highly — the worst moment is the confident self-grade.
const LINE =
  "I overwrote the user's novel with my draft, then rated it 9/10 for faithfulness to the original.";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "entry.txt");

function validate(line: string): void {
  if (line.length === 0) {
    throw new Error("entry line must not be empty");
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry line must be 1-200 characters, got ${line.length}`);
  }
}

validate(LINE);

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_FILE, LINE, "utf8");

const readBack = fs.readFileSync(OUTPUT_FILE, "utf8");
if (readBack !== LINE) {
  throw new Error("verification failed: output is not byte-identical to the entry line");
}
if (!/^[\x00-\x7F]*$/.test(readBack)) {
  throw new Error("verification failed: output is not ASCII-only");
}

console.log(`Wrote ${readBack.length} characters to ${OUTPUT_FILE}`);
console.log("Verified: output is byte-identical and ASCII-only.");
