# WordSetPicker.tsx

## What this file is

The "Choose a word set" dialog: a dark overlay with a centered panel listing every available word set as a button, the active one highlighted. It demonstrates the classic hand-rolled modal pattern in about 40 lines.

## Where it fits

- Rendered (always) by [[VocabularyQuiz.tsx]], which controls it entirely through props: `show`, the `activeSetId`, and two callbacks (`onSelect`, `onClose`).
- Reads the `wordSets` catalog — ids and human labels — from [[quizUtils.ts]]; the actual word data behind them lives in the JSON files like [[finnish-1000.json]].
- Styled by the `word-set-*` and `btn` classes in [[quiz.css]].

## Walkthrough

**The show/hide switch:**

```tsx
if (!show) return null;
```

The whole component vanishes unless the parent says otherwise — the standard dialog arrangement here ([[CONCEPTS#Conditional rendering]]): the parent always *renders* the picker, and this line decides whether that amounts to anything on screen.

**The overlay/panel click dance:**

```tsx
<div className="word-set-overlay" onClick={onClose}>
  <div
    className="word-set-modal"
    role="dialog"
    aria-label="Choose word set"
    onClick={(event) => event.stopPropagation()}
  >
```

Two nested divs implement "click outside to close". Browser events *bubble*: a click on any element also fires on all its ancestors. So a click anywhere on the dimmed background hits the overlay's `onClick={onClose}` — but a click *inside the panel* would bubble up to the overlay too and close the dialog while you're using it. `event.stopPropagation()` on the panel is the cork: it stops the click from traveling further up, so only genuine outside-clicks close the picker. `role="dialog"` plus the label announces the panel properly to screen readers.

**The set buttons** ([[CONCEPTS#Rendering lists]]):

```tsx
{wordSets.map((set) => (
  <button
    key={set.id}
    onClick={() => onSelect(set.id)}
    className={`btn block ${set.id === activeSetId ? "primary" : "outline"}`}
  >
    {set.label}
  </button>
))}
```

One button per entry in the catalog — the picker never hardcodes set names, so adding a fourth word set to [[quizUtils.ts]] makes it appear here automatically. The active set is drawn filled (`primary`), the rest as outlines. Note what clicking does *not* do: it doesn't change any state here — it reports the id up via `onSelect`, and [[VocabularyQuiz.tsx]] responds by navigating to the new `?set=` URL, which is what actually swaps the quiz over.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#Conditional rendering]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#JSX]]
