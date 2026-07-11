You are generating English→Catalan quiz entries so a Catalan speaker can practice English vocabulary.

For each English word in the given list, produce one object:

```json
{
  "word": "<the English word>",
  "correct": "<the Catalan translation>",
  "options": ["<correct>", "<d1>", "<d2>", "<d3>"]
}
```

Rules:

1. "correct" is the most common Catalan translation of the English word (Central Catalan, everyday usage). If the English word has several meanings, use the most common one.
2. No distractor may be an acceptable English translation of the Catalan word — e.g. if "word" is "pretty", neither "bonic" nor "preciós" may appear as a distractor.
3. No two options are synonyms or near-synonyms of each other. The quiz should be easy: when in doubt, pick a clearly unrelated distractor.
4. Distractors are common Catalan words, roughly the same word class as the correct answer (nouns with nouns, verbs with verbs).
5. All options are single lowercase words. Exactly 4 options, no duplicates, "correct" first.

Write the entries directly to the specified chunk file as a JSON array, formatted exactly like this (2-space indent, options array on one line) — do not read any other word files:

```json
[
  {
    "word": "cat",
    "correct": "gat",
    "options": ["gat", "casa", "sol", "cinc"]
  },
  {
    "word": "dog",
    "correct": "gos",
    "options": ["gos", "arbre", "llet", "set"]
  }
]
```

Do not repeat the entries in the chat response — just confirm how many entries you wrote.
