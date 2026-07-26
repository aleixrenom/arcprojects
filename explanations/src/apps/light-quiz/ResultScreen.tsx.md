# ResultScreen.tsx

## What this file is

The "Quiz Complete!" screen shown when the question queue is empty: a congratulations card that fades in, with a **Try Again** button. The simplest component in the quiz — a good file to read first if the others feel dense.

## Where it fits

- Rendered by [[VocabularyQuiz.tsx]] *instead of* the question card once every question has been answered correctly (it replaces the whole quiz view, unlike the overlay-style [[WordSetPicker.tsx]]).
- Its single prop, `onTryAgain`, is the parent's `resetQuiz` function — the same one the [[ResetConfirmation.tsx]] dialog triggers.
- Styled by the `result-*` and `btn` classes in [[quiz.css]].

## Walkthrough

The whole component is one prop and one piece of JSX:

```tsx
export default function ResultScreen({ onTryAgain }: ResultScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="result-root"
    >
```

The outer wrapper is a Framer Motion div ([[CONCEPTS#Framer Motion]]) declaring just two keyframes: start fully transparent, end fully opaque — a gentle fade-in for the moment of triumph. No `exit` animation is needed since the quiz only ever swaps this screen out for a fresh quiz.

Inside sit a heading, one sentence of praise, and:

```tsx
<button onClick={onTryAgain} className="btn primary">
  Try Again
</button>
```

The familiar division of labor ([[CONCEPTS#Props]]): this component decides the button's look and label, the parent decides what "trying again" *means* (wipe saved progress, reshuffle, restart — see `resetQuiz` in [[VocabularyQuiz.tsx]]). Note the screen doesn't receive or display any score — the quiz's design makes that meaningless: wrong answers re-queue until you get them right, so *reaching* this screen already means 100%.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#JSX]], [[CONCEPTS#Framer Motion]]
