# finnish-1000.json

## What this file is

The original quiz word set: about 1,025 questions of **Finnish→English vocabulary** — the prompt is a Finnish word, the answers are English. This is the set the quiz opens with by default (it's first in the catalog), and the reason the app's card id is `finnish-quiz` in [[cards.ts]].

## Where it fits

- Imported by [[quizUtils.ts]], registered under the id `finnish-1000` with the label *Finnish vocabulary*.
- Same structure and conventions as every word set — see [[catalan-1000.json]] for the full structural walkthrough.
- Structurally checked by [[validate-words.mjs]].

## Walkthrough

One JSON array ([[CONCEPTS#JSON]]); each entry is prompt + correct answer + four options:

```json
{
  "word": "minä",
  "correct": "I",
  "options": ["I", "you", "we", "they"]
}
```

The standing conventions apply: four options per entry, correct answer first in the raw file (shuffled at runtime by [[quizUtils.ts]]). A characteristic touch of this set: distractors are chosen to be *plausibly confusable* — pronouns are offered against other pronouns, `hänen` ("his") against "he"/"their" — which is what makes the quiz a real test rather than a giveaway.

## Concepts used

[[CONCEPTS#JSON]]
