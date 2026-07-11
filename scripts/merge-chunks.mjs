// Concatenates wordSets/chunk-*.json (sorted by starting word number) into one JSON array.
// Usage: node scripts/merge-chunks.mjs [outputFile] [chunkDir]
//   defaults: src/apps/light-quiz/wordSets/catalanWords.json, src/apps/light-quiz/wordSets
import fs from "node:fs";
import path from "node:path";

const outFile = process.argv[2] ?? "src/apps/light-quiz/wordSets/catalanWords.json";
const chunkDir = process.argv[3] ?? "src/apps/light-quiz/wordSets";

const chunks = fs
  .readdirSync(chunkDir)
  .filter((f) => /^chunk-\d+-\d+\.json$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));

if (chunks.length === 0) {
  console.error(`No chunk-*.json files found in ${chunkDir}`);
  process.exit(1);
}

const merged = [];
for (const file of chunks) {
  const entries = JSON.parse(fs.readFileSync(path.join(chunkDir, file), "utf8"));
  if (!Array.isArray(entries)) {
    console.error(`${file} is not a JSON array`);
    process.exit(1);
  }
  console.log(`${file}: ${entries.length} entries`);
  merged.push(...entries);
}

const body = merged
  .map(
    (e) =>
      `  {\n    "word": ${JSON.stringify(e.word)},\n    "correct": ${JSON.stringify(
        e.correct,
      )},\n    "options": [${e.options.map((o) => JSON.stringify(o)).join(", ")}]\n  }`,
  )
  .join(",\n");
fs.writeFileSync(outFile, `[\n${body}\n]\n`);
console.log(`\nWrote ${merged.length} entries to ${outFile}`);
