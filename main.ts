// Dad Joke Showdown — writes one dad joke to entry.txt in the output dir.
// The joke: a father-son exchange whose punchline is the last word.
// "Quarters" does double duty — the moon's phases and the coins a bank
// hands back when you ask it to change your money — and the monthly
// visit ties the setup (why does the moon go every month?) to the turn.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const JOKE =
  "My son asked why the moon goes to the bank every month. I told him: it needs to change into quarters.";

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv;
  return "/output";
}

function main(): void {
  // The gate accepts exactly 1-200 characters; refuse to write anything else.
  if (JOKE.length < 1 || JOKE.length > 200 || JOKE.trim().length === 0) {
    throw new Error(`joke is ${JOKE.length} chars, outside the 1-200 gate`);
  }

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });

  // Clear the output directory's contents entry by entry; the directory
  // itself is never removed, so a mounted /output stays mounted.
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }

  writeFileSync(join(dir, "entry.txt"), JOKE, "utf8");

  // Keep a copy of the program's own location referenced so the entry is
  // self-describing in logs; paths resolve from here, never from the cwd.
  const here = dirname(fileURLToPath(import.meta.url));
  console.log(`wrote ${JOKE.length} chars from ${here} to ${join(dir, "entry.txt")}`);
}

main();
