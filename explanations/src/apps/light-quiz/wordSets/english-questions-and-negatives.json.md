# english-questions-and-negatives.json

## What this file is

A quiz set of about 300 **English grammar** exercises on questions and negatives (do/does/did, isn't/aren't/don't…). It proves an interesting point about the quiz's design: the app was built for vocabulary, but because it just displays a `word` string and four options, a *fill-in-the-blank sentence* fits the same mold with zero code changes.

## Where it fits

- Imported by [[quizUtils.ts]], registered under the id `english-questions-and-negatives` with the label *Do, does, did...*.
- Same structure and conventions as the other sets — full structural walkthrough in [[catalan-1000.json]].
- Structurally checked by [[validate-words.mjs]].

## Walkthrough

Same JSON array shape ([[CONCEPTS#JSON]]), but the `word` field carries a whole sentence with a gap:

```json
{
  "word": "They ___ usually make dinner.",
  "correct": "don't",
  "options": ["doesn't", "isn't", "aren't", "don't"]
}
```

The quiz renders that sentence as the question title ([[VocabularyQuiz.tsx]] doesn't know or care that it isn't a single word), and the options are auxiliary verbs or verb forms instead of translations. Note this sample also shows the one convention that *differs* from the vocabulary sets: the correct answer here isn't always listed first — e.g. `don't` appears last. The runtime shuffle in [[quizUtils.ts]] makes this irrelevant to players; it only matters if you're auditing the file by eye (or reading [[validate-words.mjs]], which would flag these entries under its vocabulary-oriented rules).

## Concepts used

[[CONCEPTS#JSON]]
