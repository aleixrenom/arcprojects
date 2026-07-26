# sheet.css

## What this file is

The character sheet's stylesheet — at ~1,180 lines, the largest CSS file in the project. It defines the sheet's own design system (color tokens, cards, chips, modals) independent of the portfolio's look: where the quiz borrows the site's `--card-bg` and friends, the sheet brings its entire palette and even its own font. Like [[quiz.css]], scoping is by prefix discipline: every class starts with `cs-`.

## Where it fits

- Imported once by [[CharacterSheet.tsx]]; styles every component in the app ([[AbilitiesCard.tsx]], [[AddAbilityModal.tsx]], [[ExpertiseCard.tsx]], [[EffectText.tsx]], [[Stepper.tsx]]).
- Uses the *Manrope* font loaded by [[index.html]] (the comment there points here).
- Only connection to the portfolio theme: reacting to the global `html.dark` class set by [[router.tsx]].

## Walkthrough

**A self-contained token system.** The opening block defines ~18 CSS variables on `.cs-root` — not `:root`, so (as the comment says) they can't leak into the portfolio. The header comment records the provenance: light values are the locked-in "Minimal" theme from the design handoff (`Design/` folder, outside this vault); the dark block is a derived variant added so the sheet follows the site's dark toggle, which the handoff didn't cover. Colors are written in `oklch(...)` — a modern color notation whose three numbers are lightness, chroma (colorfulness), and hue angle; its advantage over hex codes is that changing one axis predictably changes one perceptual quality, which is exactly how the dark palette was derived (same hues, lightness flipped). Notable tokens: per-stat colors (`--cs-body`/`--cs-mind`/`--cs-soul` — blue/purple/teal, used by the stat dots and pool bars), a danger red, and the green pill pair for [[EffectText.tsx]].

**Base resets, locally.** `.cs-root` applies its font and background, then `box-sizing: border-box` for everything inside — the app carries its own mini-reset instead of relying on global styles ([[index.css]] doesn't set these), consistent with being a self-contained embedded app.

**Section by section** (the file is organized by `/* ---- section ---- */` comments mirroring the component structure):

- **Tabs**: pill-shaped, the active one gaining an accent border; the "+ New" button dashed — this project's visual code for "creates something", repeated by the expertise `+` and the custom-ability button.
- **Header**: the name input styled to look like a page title rather than a form field (no border, huge `clamp(28px, 5vw, 40px)` font — meaning "5% of viewport width, but between 28 and 40px"); the SP badge, which just turns red via `.over` when [[CharacterSheet.tsx]] flags overspending.
- **Layout**: `.cs-grid` uses `repeat(auto-fit, minmax(340px, 1fr))` — two columns when there's room, one on phones, no media query needed.
- **Steppers**: the two size families (`cs-stepper` 40px, `cs-mini-stepper` 22px) that [[Stepper.tsx]]'s `small` prop switches between.
- **Pools**: the bar track/fill whose width [[CharacterSheet.tsx]] sets inline; fills reuse the Body color for Health and the Soul color for Resolve.
- **Abilities**: the accordion styling, including two commented decisions — the header chevron gets a prominent chip look *because it's the main way into the rules text* (while milestone chevrons stay plain), and the inline delete confirm uses pill buttons sized as comfortable mobile tap targets. `white-space: pre-line` on text blocks preserves the line breaks that survive in catalog strings.
- **Expertise / Notes / Footer**: chips (`cursor: text` on chips — a hint they're editable in place), the notes textarea, and the footer's quiet pill buttons.
- **Modal**: the fixed full-screen `.cs-modal-backdrop` at `z-index: 100`, the panel capped at `85vh` with only the list scrolling (`flex` + `overflow-y: auto`) so the header and pack selector stay put. One comment preserves a lesson learned: the pack select's width comes from margins plus flex stretch, *never* `width: 100%` on top of margins — a past overflow bug.
- **Confirm / pick-stat / custom form**: straightforward styling for the remaining modal views, the delete button filled with danger red while Cancel stays neutral — same visual hierarchy language as the quiz's [[ResetConfirmation.tsx]].

## Concepts used

[[CONCEPTS#HTML, CSS, and JavaScript]], [[CONCEPTS#CSS Modules]] (for contrast — this file deliberately isn't one), [[CONCEPTS#Modules and imports]]
