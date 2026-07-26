# courseVocabulary.json

## What this file is

A fourth word set — about 144 Finnish→English entries of noticeably more advanced, course-flavored vocabulary (*haaveilija*/dreamer, *päätellä*/to deduce) — that is **not plugged into the quiz**. The author considered using it, decided against it, and the file simply stayed in the folder — no code imports it.

## Where it fits

- Imported by nothing. To activate it, one line would be added to the `wordSets` catalog in [[quizUtils.ts]] (plus the import), and it would automatically appear in [[WordSetPicker.tsx]].
- Same entry shape as the other sets — structural walkthrough in [[catalan-1000.json]].

## Walkthrough

Same JSON array of `word`/`correct`/`options` objects ([[CONCEPTS#JSON]]), formatted one-entry-per-line rather than spread over five lines like the other sets:

```json
{ "word": "haaveilija", "correct": "dreamer", "options": ["dreamer", "wanderer", "schemer", "worrier"] }
```

It follows the correct-answer-first convention. Two things distinguish its content: the vocabulary is harder and more idiomatic than [[finnish-1000.json]] (a "course vocabulary" — words collected from a language course rather than a frequency list), and some answers carry a `to ` prefix to mark verbs (`"to pet"`, `"to lie"`) — a style the vocabulary validator [[validate-words.mjs]] explicitly flags as an error, which suggests this file hasn't been run through (or predates) that pipeline. Both points are consistent with its status: a leftover data file that was never adopted into the catalog.

## Concepts used

[[CONCEPTS#JSON]]
