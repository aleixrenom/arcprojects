# quiz.css

## What this file is

The quiz app's entire stylesheet: the centered card layout, the button system, the green/red answer feedback colors, the picker modal, and the results screen. It's a plain global CSS file — the quiz scopes its styles by *naming discipline* (every class starts with a quiz-ish prefix like `quiz-`, `word-set-`, `result-`) rather than by the CSS Modules mechanism the portfolio shell uses ([[CONCEPTS#CSS Modules]]).

## Where it fits

- Imported once by [[VocabularyQuiz.tsx]]; styles the markup of all five quiz components.
- Builds *on top of* the portfolio's theme: it reuses the global variables (`--bg`, `--text`, `--card-bg`, `--accent`, …) defined in [[index.css]], so the quiz automatically follows the site's light/dark theme.
- Its `quiz-option` state classes are the other half of the logic in [[QuestionCard.tsx]].

## Walkthrough

**Quiz-only color tokens.** The file opens by *extending* the theme locally:

```css
.quiz-root,
.result-root {
  --quiz-success-bg: #d1fae5;
  --quiz-danger-bg: #fee2e2;
  ...
}

html.dark .quiz-root, ... {
  --quiz-success-bg: rgba(16, 185, 129, 0.16);
  ...
}
```

Success-green and danger-red don't exist in the portfolio's palette, so the quiz defines them itself — but attaches them to `.quiz-root` instead of `:root`, so (as the file's comment says) they can't leak into the rest of the site. The same light/dark override pattern as [[index.css]] is repeated here in miniature: dark mode swaps the pastel fills for translucent tints.

**Layout.** `.quiz-root` centers a single `.quiz-card` (max width 28rem — this is the mobile-first design from [[light-quiz/README.md]]: one phone-width column, comfortable on any screen). The header rules arrange progress counter, word, and the two round icon buttons; `.confirm-box` styles the inline reset prompt from [[ResetConfirmation.tsx]].

**The button system.** A compositional family of classes:

```css
.btn { ... }             /* base: padding, radius, cursor */
.btn.primary { background: var(--accent); color: #fff; }
.btn.outline { border: 1px solid var(--hairline); }
.btn.small { ... }  .btn.block { width: 100%; }
```

Components mix and match: `btn primary small` (the Reset confirm), `btn block outline` (picker entries). One modern trick: hover on `primary` uses `color-mix(in srgb, var(--accent) 85%, black)` — "the accent color, darkened 15%" — computed by CSS at runtime, so it stays correct whatever the accent variable holds in either theme.

**Answer feedback.** The `.quiz-option` states map one-to-one to the class strings [[QuestionCard.tsx]] builds:

```css
.quiz-option.neutral:hover { border-color: var(--muted); }
.quiz-option.correct,
.quiz-option.selected.correct { background: var(--quiz-success-bg); ... }
.quiz-option.selected.incorrect { background: var(--quiz-danger-bg); ... }
```

Note only `neutral` has a hover effect — once answered, options stop reacting, reinforcing the `disabled` lock in the component. `correct` without `selected` is the "here's what you should have picked" highlight.

**Modal and results.** `.word-set-overlay` is a `position: fixed; inset: 0` full-screen dim layer (the click-to-close surface of [[WordSetPicker.tsx]]) with the panel flex-centered inside; `.result-*` rules give [[ResultScreen.tsx]] the same centered-card treatment as the quiz itself. Both repeat the project-wide dark-mode signature seen in [[index.css]]: shadows in light mode become inset hairline borders in dark.

## Concepts used

[[CONCEPTS#HTML, CSS, and JavaScript]], [[CONCEPTS#CSS Modules]], [[CONCEPTS#Modules and imports]]
