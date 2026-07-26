# catalan-1000.json

## What this file is

A quiz word set: 1,000 questions teaching **English vocabulary to Catalan speakers** — the prompt is an English word, the answers are Catalan. (The filename says "catalan" because of the answer language; in the app it's labeled *Vocabulari Anglès*, "English Vocabulary".) A pure data file ([[CONCEPTS#JSON]]) — no code.

## Where it fits

- Imported by [[quizUtils.ts]] and registered in its `wordSets` catalog under the id `catalan-1000`.
- Each entry becomes a `Question` at runtime (the shape defined in [[light-quiz/types.ts]], minus the generated `id`).
- Structurally checked by [[validate-words.mjs]].

## Walkthrough

The file is one big JSON array of identical-shaped objects:

```json
{
  "word": "able",
  "correct": "capaç",
  "options": ["capaç", "lent", "ric", "net"]
}
```

- `word` — the prompt shown as the question title.
- `correct` — the right answer.
- `options` — the four multiple-choice buttons, wrong ones ("distractors") included.

Two conventions govern every entry, enforced by [[validate-words.mjs]]: exactly **four options**, and **the correct answer is always listed first** in `options`. That first-position rule makes the raw file easy to audit by eye — and is harmless in the app because [[quizUtils.ts]] shuffles each question's options when building a queue, so players never see the pattern. The validator also checks for duplicate options, and — since duplicate `word` entries are allowed — that one entry's correct answer never appears as another entry's distractor for the same word (which would make a question unfairly ambiguous).

Per the vault's convention, the 1,000 entries themselves aren't documented — open the file if you're curious; every line looks like the sample above.

## Concepts used

[[CONCEPTS#JSON]]
