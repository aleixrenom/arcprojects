# Stepper.tsx

## What this file is

The − / value / + control used all over the character sheet — stats, Health, Resolve, both counters, and (in a smaller size) every ability's level. One component, defined once, reused seven-plus times. The purest example of the component-as-LEGO-brick idea in the project ([[CONCEPTS#Components]]).

## Where it fits

- Used by [[CharacterSheet.tsx]] (stats, pools, counters) and [[AbilitiesCard.tsx]] (ability levels, with `small`).
- Styled by the `cs-stepper*` / `cs-mini-stepper*` classes in [[sheet.css]].

## Walkthrough

The whole component is its props contract plus fifteen lines of JSX:

```tsx
type StepperProps = {
  value: number;
  onDec: () => void;
  onInc: () => void;
  small?: boolean;
  valueClassName?: string;
};
```

Note what's *missing*: the stepper has no idea what it's counting, what the limits are, or what stepping means. It displays `value` and reports button presses via `onDec`/`onInc` ([[CONCEPTS#Props]]) — all rules (clamping stats to 0–10, Health to ±max, tokens to 0–99) live with the owners of the data, chiefly the `clamp` calls in [[CharacterSheet.tsx]]. That's precisely what makes it reusable everywhere: a control this "dumb" can't embed assumptions that fit one place and break another.

The two optional props are its only styling flexibility ([[CONCEPTS#TypeScript]] — `?` marks them optional): `small` switches the whole control between two class families defined in [[sheet.css]] (40px buttons for cards, 22px for ability rows), and `valueClassName` lets a caller enlarge or recolor just the number (pool values are big and bold; counter values are accent-colored).

The JSX is two real `<button>`s around the value div. Each button carries an `aria-label` ("Decrease" / "Increase") because the visible `−`/`+` glyphs alone are poor descriptions for a screen reader; and they're `type="button"` — a habit worth copying, since a bare `<button>` inside any form would default to submitting it.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#JSX]], [[CONCEPTS#TypeScript]]
