# validate-words.mjs

## What this file is

A quality-control script for quiz word files: it checks that every entry is structurally sound (right fields, four options, correct answer present) and flags content problems like duplicate words or misleading distractors. It's the author's safety net when hand-editing or generating thousand-entry JSON files. Run manually: `node scripts/validate-words.mjs [file]`.

## Where it fits

- Runs under Node.js ([[CONCEPTS#Node.js]]); reads whichever word file it's pointed at — e.g. [[finnish-1000.json]] or [[catalan-1000.json]].
- Enforces the entry shape described in [[catalan-1000.json]] (and defined as the `Question` type in [[light-quiz/types.ts]], minus `id`).
- Unlike [[build-ability-packs.mjs]] it's not in [[package.json]]'s scripts — and its default file path (`catalanWords.json`) points at a filename that no longer exists, a leftover from before the word sets were renamed. In practice you always pass a file explicitly.

## Walkthrough

**Per-entry structural checks.** The script loads the JSON and walks every entry, collecting errors rather than stopping at the first (so one run reports everything):

- `word` and `correct` must be non-empty strings; `options` must be an array of exactly **4**;
- `correct` must be *in* the options — and must be the **first** option (the audit-by-eye convention explained in [[catalan-1000.json]]; harmless at runtime since [[quizUtils.ts]] shuffles);
- no duplicate options; no option starting with `"to "` (verbs are stored bare); options must be lowercase unless they're `"I"` — style rules that keep answer buttons visually uniform.

These are vocabulary-set rules specifically: [[english-questions-and-negatives.json]] (sentences, mixed-case, answer not first) and [[courseVocabulary.json]] (`"to pet"`-style verbs) would both fail several checks — the script is a tool for the vocabulary files, not a gate every set must pass.

**The cross-entry duplicate analysis.** The subtler second half: it groups entries by `word` and reports duplicates as "worth reviewing". Most duplicates are legitimate (a word with two valid translations, each its own entry) — but one case is genuinely broken, and the script promotes it to an error:

```js
// A duplicate quiz word is broken if one entry's distractor is another entry's answer.
const clash = e.options.filter((o) => o !== e.correct && corrects.includes(o));
```

If *kuin* appears twice with answers "as" and "than", then an entry offering "than" as a *wrong* option for *kuin* is unfair — the player picks a true translation and gets buzzed. This check encodes real experience with how multiple-choice quizzes go wrong.

**Exit code.** The script ends with `process.exit(errors ? 1 : 0)` — the Unix convention (0 = success) that would let it slot into an automated pipeline someday, even though today it's run by hand.

## Concepts used

[[CONCEPTS#Node.js]], [[CONCEPTS#JSON]], [[CONCEPTS#Modules and imports]]
