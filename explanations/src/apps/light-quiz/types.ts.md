# types.ts (light-quiz)

## What this file is

The quiz's shared vocabulary, in the TypeScript sense: the definition of what a `Question` is. Six lines, imported by half the quiz.

## Where it fits

- Imported by [[VocabularyQuiz.tsx]], [[QuestionCard.tsx]] and [[quizUtils.ts]].
- Describes the shape of the data in the word-set JSON files (minus `id` — see below).
- The character sheet app has its own, much larger counterpart: [[character-sheet/types.ts]].

## Walkthrough

The entire file:

```ts
export interface Question {
  id: string;
  word: string;
  correct: string;
  options: string[];
}
```

`interface` is TypeScript's other way of declaring an object shape — for describing plain objects it's interchangeable with the `type X = {...}` form used in [[ui.ts]]; this project simply uses both spellings ([[CONCEPTS#TypeScript]]).

The four fields tell you the whole quiz data model: the prompt shown as the title (`word` — despite the name, it can be a full fill-in-the-blank sentence, as in [[english-questions-and-negatives.json]]), the `correct` answer, and the multiple-choice `options` (which include the correct one). `id` is the odd one out: it's *not* in the JSON files — [[quizUtils.ts]] generates it when building a queue (that's why its `WordSet` type says `Omit<Question, "id">`). It exists so every question in a live queue has a unique identity, even after wrong answers are duplicated back into the queue.

A file this small earns its keep by being the *single* definition: when [[VocabularyQuiz.tsx]] hands a question to [[QuestionCard.tsx]], both sides reference this one shape, so they can't silently disagree about what a question contains.

## Concepts used

[[CONCEPTS#TypeScript]], [[CONCEPTS#Modules and imports]]
