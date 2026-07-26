# ResetConfirmation.tsx

## What this file is

The "are you sure?" step for the reset button: a small inline box asking *"Reset quiz and lose current progress?"* with Cancel and Reset buttons. It protects the one destructive action in the quiz — resetting throws away saved progress for the current word set.

## Where it fits

- Rendered by [[VocabularyQuiz.tsx]], inside the question card (between the header and the answer options).
- Pure props, no state ([[CONCEPTS#Props]]): `show` (whether to appear), `onCancel`, and `onReset` — the latter being the parent's `resetQuiz` function, the same one [[ResultScreen.tsx]]'s Try Again button calls.
- Styled by the `confirm-box` classes in [[quiz.css]].

## Walkthrough

The component follows the exact show/hide pattern of [[WordSetPicker.tsx]]:

```tsx
if (!show) return null;
```

Parent always renders it; this line makes it invisible until the reset icon is clicked ([[CONCEPTS#Conditional rendering]]). The flow across the two files reads: reset icon sets `showResetConfirm` to true → this box appears → **Cancel** calls `onCancel` (parent sets the flag back to false, nothing lost) or **Reset** calls `onReset` (parent wipes storage and reshuffles).

The visible part is deliberately plain — a question and two buttons:

```tsx
<div className="confirm-box">
  <div className="confirm-inner">
    <span>Reset quiz and lose current progress?</span>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button onClick={onCancel} className="btn outline small">Cancel</button>
      <button onClick={onReset} className="btn primary small">Reset</button>
    </div>
  </div>
</div>
```

Two design choices worth noticing. Unlike [[WordSetPicker.tsx]], there's no full-screen overlay — the box appears *within* the card, so there's no click-outside-to-close machinery; you must pick one of the two buttons. And the button styling states the safe path quietly: Cancel is the outlined (subdued) style, Reset the filled `primary` one — the shared `btn` classes from [[quiz.css]] doing the talking.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#Conditional rendering]], [[CONCEPTS#JSX]]
