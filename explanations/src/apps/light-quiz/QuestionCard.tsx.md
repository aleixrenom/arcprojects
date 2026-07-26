# QuestionCard.tsx

## What this file is

The answer buttons of the quiz — one button per multiple-choice option, with the color logic that turns them green or red after you answer. It holds no state at all: everything it shows is dictated by its props, everything the user does is reported back up. A textbook "presentational" component.

## Where it fits

- Rendered by [[VocabularyQuiz.tsx]], which passes in the current question and the answer state, and receives clicks via the `onSelectAnswer` callback.
- The `Question` type comes from [[light-quiz/types.ts]]; the `quiz-option` styles from [[quiz.css]].
- Buttons are Framer Motion buttons for the hover/press feedback ([[CONCEPTS#Framer Motion]]).

## Walkthrough

**The props contract** ([[CONCEPTS#Props]]): `currentQuestion` (the word and its options), `selectedAnswer` (what the user picked, or `null`), `isAnswered` (has a pick been made), and `onSelectAnswer` (the callback to report a pick). Keeping the state in the parent means this component can't disagree with the quiz brain about what's happening — it just draws the current situation.

**One button per option** ([[CONCEPTS#Rendering lists]]):

```tsx
{currentQuestion.options.map((option, index) => {
  let cls = "quiz-option";
  if (selectedAnswer === option) {
    cls += option === currentQuestion.correct
      ? " selected correct"
      : " selected incorrect";
  } else if (isAnswered && option === currentQuestion.correct && ...) {
    cls += " correct";
  } else {
    cls += " neutral";
  }
```

The class-building `if`-chain is the whole feedback design, worth reading as prose:

- *The option you clicked*: green (`selected correct`) if right, red (`selected incorrect`) if wrong.
- *The correct answer, when you picked something else*: highlighted green too — that's the second branch, and it's why a wrong guess still teaches you the right answer during the 1.5-second pause that [[VocabularyQuiz.tsx]] leaves before advancing.
- *Everything else*: `neutral`.

Before any answer, every button is simply `neutral`. The actual colors for these class combinations live in [[quiz.css]].

**The button itself:**

```tsx
<motion.button
  key={index}
  onClick={() => onSelectAnswer(option)}
  disabled={isAnswered}
  whileHover={!isAnswered ? { scale: 1.02 } : {}}
  whileTap={!isAnswered ? { scale: 0.98 } : {}}
>
```

`disabled={isAnswered}` locks all buttons the instant one is clicked — no double answers, no changing your pick during the feedback pause — and the hover/tap growth effects are switched off at the same time so the locked buttons also *feel* inert. Two small notes: using the array `index` as the `key` is acceptable here because the option list never reorders while mounted (a new question gets a whole new card — see the `questionKey` trick in [[VocabularyQuiz.tsx]]); and since real `<button>` elements are used, keyboard and screen-reader support come free — no `role="button"` gymnastics like in [[Card.tsx]].

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#JSX]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#Framer Motion]], [[CONCEPTS#TypeScript]]
