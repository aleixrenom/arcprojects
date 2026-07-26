# quizUtils.ts

## What this file is

The quiz's data layer: the catalog of available word sets, and every function that touches **localStorage** — saving/loading progress, remembering the chosen set, building fresh shuffled question queues. No React in here at all; it's plain logic that [[VocabularyQuiz.tsx]] calls. Keeping it separate keeps the component about *behavior* and this file about *data*.

## Where it fits

- Imports the three active word-set JSON files: [[finnish-1000.json]], [[catalan-1000.json]], [[english-questions-and-negatives.json]] (notably *not* [[courseVocabulary.json]] — that file is currently unplugged).
- The `Question` type comes from [[light-quiz/types.ts]].
- Used by [[VocabularyQuiz.tsx]] (nearly everything) and [[WordSetPicker.tsx]] (the `wordSets` catalog).

## Walkthrough

**The catalog.** Importing a JSON file gives you its parsed contents as a value ([[CONCEPTS#JSON]] — a build-tool convenience, [[CONCEPTS#Vite]]):

```ts
export const wordSets: WordSet[] = [
  { id: "finnish-1000", label: "Finnish vocabulary", data: finnishData },
  { id: "catalan-1000", label: "Vocabulari Anglès", data: catalanData },
  ...
];
```

Each entry pairs a stable `id` (used in URLs and storage keys) with a display `label` and the raw question data. The `WordSet` type says `data: Omit<Question, "id">[]` — a small TypeScript gem ([[CONCEPTS#TypeScript]]): "a `Question` minus its `id` field". The JSON files don't contain ids; ids get stamped on later, in code.

**Storage keys.** Progress is stored per set under `quizProgress:<setId>`, and the chosen set under its own key. `loadActiveWordSetId` also deletes a `quizProgress` key without a set suffix — leftover from an older version of the app that had only one word set; a tiny example of code being kind to returning visitors' stale data ([[CONCEPTS#localStorage]]). Loading validates what it finds and falls back to the first set if the stored id is unknown.

**Shuffling.** Both helpers use the same idiom:

```ts
export const shuffleArray = (array: string[]): string[] => {
  return [...array].sort(() => Math.random() - 0.5);
};
```

Sorting with a coin-flip comparator is the quick-and-dirty shuffle: not statistically perfect (a Fisher–Yates shuffle would be), but plenty random for a quiz. Note `[...array]` — shuffle a *copy*, never the caller's array. `randomizeQuestions` applies this twice over: shuffles the options *inside* each question (the JSON files always list the correct answer first, so this matters!) and then shuffles the order of the questions themselves.

**Building and restoring queues.** `createNewQuestionQueue` takes a set's raw data, stamps each question with a unique-enough id (word + position + four random characters), and randomizes. `loadQuestionsForSet` is the resume path:

```ts
const stored = localStorage.getItem(progressKey(setId));
if (stored) {
  try {
    const normalized = addIdsToStoredQuestions(JSON.parse(stored));
    if (normalized.length > 0) return normalized;
  } catch {
    // Corrupt progress falls through to a fresh queue.
  }
}
return createNewQuestionQueue(setId);
```

Defensive from top to bottom: parse inside a `try` (storage could contain garbage), normalize what came out (`addIdsToStoredQuestions` fills in any missing fields with safe defaults — older saves might predate the `id` field), and if *anything* is off, quietly start fresh rather than crash. Note the restored queue is **not** re-shuffled — the saved order *is* your progress, including re-queued wrong answers.

**Saving.** `persistQuestions` stringifies the remaining queue into the set's key — and when the queue is empty it *removes* the key instead, so a finished quiz means a clean slate next visit rather than a stored `[]` that would read as "no progress".

## Concepts used

[[CONCEPTS#Modules and imports]], [[CONCEPTS#TypeScript]], [[CONCEPTS#localStorage]], [[CONCEPTS#JSON]], [[CONCEPTS#Vite]]
