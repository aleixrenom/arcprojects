// Structural checks for a quiz word file (works on the merged file or a single chunk).
// Usage: node scripts/validate-words.mjs [file]
//   default: src/apps/light-quiz/wordSets/catalanWords.json
import fs from "node:fs";

const file = process.argv[2] ?? "src/apps/light-quiz/wordSets/catalanWords.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

let errors = 0;
const fail = (i, entry, msg) => {
  errors++;
  console.log(`ERROR entry ${i} (${entry.word ?? "?"}): ${msg}`);
};

data.forEach((e, i) => {
  if (typeof e.word !== "string" || e.word.length === 0) fail(i, e, `missing "word"`);
  if (typeof e.correct !== "string" || e.correct.length === 0) fail(i, e, `missing "correct"`);
  if (!Array.isArray(e.options)) return fail(i, e, `"options" is not an array`);
  if (e.options.length !== 4) fail(i, e, `has ${e.options.length} options, expected 4`);
  if (!e.options.includes(e.correct)) fail(i, e, `"correct" (${e.correct}) not in options`);
  else if (e.options[0] !== e.correct) fail(i, e, `"correct" (${e.correct}) is not the first option`);
  if (new Set(e.options).size !== e.options.length) fail(i, e, `duplicate words in options: ${e.options.join(", ")}`);
  for (const o of e.options) {
    if (/^to /.test(o)) fail(i, e, `option "${o}" has a "to " prefix`);
    if (o !== "I" && o !== o.toLowerCase()) fail(i, e, `option "${o}" is not lowercase (check if proper noun)`);
  }
});

// Duplicates across entries: worth reviewing, not necessarily wrong.
const report = (label, keyFn) => {
  const seen = new Map();
  data.forEach((e) => {
    const k = keyFn(e);
    seen.set(k, (seen.get(k) ?? []).concat(e));
  });
  const dupes = [...seen.entries()].filter(([, v]) => v.length > 1);
  if (dupes.length) {
    console.log(`\nREVIEW: ${dupes.length} duplicate ${label}:`);
    dupes.forEach(([k, v]) => console.log(`  ${k}: ${v.map((e) => e.correct).join(" / ")}`));
    // A duplicate quiz word is broken if one entry's distractor is another entry's answer.
    dupes.forEach(([, v]) => {
      const corrects = v.map((e) => e.correct);
      v.forEach((e) => {
        const clash = e.options.filter((o) => o !== e.correct && corrects.includes(o));
        if (clash.length) {
          errors++;
          console.log(`  ERROR "${e.word}" (correct: ${e.correct}) has valid answer(s) as distractors: ${clash.join(", ")}`);
        }
      });
    });
  }
};
report(`quiz words ("word")`, (e) => e.word);

console.log(`\n${file}: ${data.length} entries, ${errors} error(s)`);
process.exit(errors ? 1 : 0);
