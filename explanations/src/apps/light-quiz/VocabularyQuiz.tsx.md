# VocabularyQuiz.tsx

## What this file is

The brain of the quiz app. It owns all the quiz's state — which word set is active, the queue of remaining questions, what the user just answered — and all the rules: correct answers leave the queue, wrong ones come back ten questions later, progress is saved so you can close the tab and resume. The other quiz components are limbs; this is the head.

## Where it fits

- Re-exported by [[light-quiz/index.tsx]], mounted by [[DetailPage.tsx]].
- Renders [[QuestionCard.tsx]] (the answer buttons), [[ResetConfirmation.tsx]], [[ResultScreen.tsx]] and [[WordSetPicker.tsx]], passing each its data and callbacks as props ([[CONCEPTS#Props]]).
- All storage and word-set logic is delegated to [[quizUtils.ts]]; the `Question` type comes from [[light-quiz/types.ts]]; styles from [[quiz.css]].
- Uses the router's `useSearch`/`useNavigate` (the `?set=` URL parameter declared in [[router.tsx]]), the Framer Motion animation library, and Howler (sound playback) with sound files from [[public]].

## Walkthrough

**Which word set is active? Ask the URL.** The component treats the address bar as the master record of the chosen set:

```tsx
const { set: searchSet } = useSearch({ strict: false }) as { set?: string };

const activeSetId = useMemo(
  () =>
    searchSet && isValidWordSetId(searchSet)
      ? searchSet
      : loadActiveWordSetId(),
  [searchSet],
);
```

`useSearch` reads the `?set=...` part of the URL ([[CONCEPTS#Router]]). If it names a real word set, that wins; otherwise fall back to the last-used set remembered in localStorage (via [[quizUtils.ts]]). `useMemo` is a hook ([[CONCEPTS#State and hooks]]) that caches a computed value — "only redo this when `searchSet` changes". A `useEffect` right below *canonicalizes* the URL: if the address bar doesn't match the resolved set (bare link, typo'd set name), it rewrites the URL with `replace: true` so the link you'd copy-paste is always complete and shareable.

**The state.** Eight `useState` pieces: the `questions` queue (first element = current question), `selectedAnswer` + `isAnswered` (the answer-feedback moment), three booleans for which overlay/screen is showing, `questionKey` (a counter bumped every time a new question arrives — its role appears below), and `exitDirection` (which way the old card flies off). One subtler line:

```tsx
const activeSetIdRef = useRef(activeSetId);
activeSetIdRef.current = activeSetId;
```

A `useRef` box kept perpetually up to date. It exists because of the `setTimeout` below: a delayed function "remembers" the variables from when it was created, so after the delay it might hold an *outdated* `activeSetId`. The ref is a peephole to the current value — that's how `handleQuestionAdvance` detects "the user switched word sets while the animation was playing" and saves the old set's progress without touching the screen.

**Loading and switching sets.** A second `useEffect` runs whenever `activeSetId` changes: persist the choice, load that set's question queue (saved progress if any, else a fresh shuffled queue — both via [[quizUtils.ts]]), and reset all the per-question state.

**Answering — the core rules.** `handleAnswerSelect` ignores clicks once answered, then:

```tsx
if (isCorrect) {
  setExitDirection("left");
  correctSound.play();
  const nextQuestions = questions.slice(1);
  setTimeout(() => handleQuestionAdvance(nextQuestions, setId), 500);
} else {
  // wrong: put the question back, 10 places deep
  const insertionIndex = remaining.length <= 10 ? remaining.length : 10;
  ...
  setTimeout(() => handleQuestionAdvance(nextQuestions, setId), 1500);
}
```

Correct: play a chime (the `Howl` objects wrap the mp3 files in `public/sounds/`, [[public]]), drop the question, move on after 0.5s. Wrong: play the buzz, and *reinsert the same question 10 positions later* (or at the end of a short queue) — spaced repetition in miniature; you'll see the word again soon but not immediately. The 1.5s delay gives you time to see the correct answer highlighted by [[QuestionCard.tsx]]. Either way `handleQuestionAdvance` saves the new queue to localStorage and, when the queue empties, flips to the results screen.

**Reset and set-switching.** Resetting (after the [[ResetConfirmation.tsx]] dialog) wipes stored progress and builds a fresh shuffled queue. Choosing a new set in [[WordSetPicker.tsx]] doesn't set any state directly — it just `navigate`s to the new `?set=` URL, and the effects above react to it. One-way data flow taken seriously: the URL changes, everything else follows.

**Rendering.** Three early returns pick the screen ([[CONCEPTS#Conditional rendering]]): a loading stub, the [[ResultScreen.tsx]], or the main card. The card slide is the flashiest bit:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={questionKey}
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: exitDirection === "right" ? 300 : -300, opacity: 0 }}
```

This is Framer Motion ([[CONCEPTS#Framer Motion]]) plus a React trick: bumping `questionKey` gives the card a new `key`, which tells React "this is a *different* element" — so the old card unmounts (playing its `exit` slide, left if you were right, right if you were wrong) while the new one slides in. Inside the card: the progress counter (computed from total minus remaining — see [[quizUtils.ts]]), the word being asked, two icon buttons (reset, choose set), the inline confirm box, and the [[QuestionCard.tsx]] options. The picker overlay sits outside the animated card so it doesn't slide with it.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Conditional rendering]], [[CONCEPTS#JSX]], [[CONCEPTS#Router]], [[CONCEPTS#Framer Motion]], [[CONCEPTS#localStorage]], [[CONCEPTS#Modules and imports]], [[CONCEPTS#TypeScript]]
