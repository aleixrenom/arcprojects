# ExpertiseCard.tsx

## What this file is

The Expertise card: the character's areas of knowledge shown as a row of pill-shaped **chips**, edited entirely in place — click a chip to edit its text, click the dashed `+` to add one, clear a chip's text to delete it. No modal, no separate form; the list *is* the editor.

## Where it fits

- Rendered by [[CharacterSheet.tsx]]; receives the `expertise` string array and a single `onChange(next)` callback that replaces the whole list ([[CONCEPTS#Props]]).
- Styled by the `cs-expertise-*` classes in [[sheet.css]].

## Walkthrough

**One edit at a time.** The card's state is a single nullable value:

```tsx
type EditState = { target: number | "new"; value: string };
const [edit, setEdit] = useState<EditState | null>(null);
```

`null` = browsing; otherwise `target` says *what* is being edited — the index of an existing chip, or the literal string `"new"` for the add slot ([[CONCEPTS#TypeScript]] union at work). One state means you can't have two chips in edit mode; opening one implicitly abandons another.

**Commit on blur — and only on blur.** The file's opening comment spells out the policy: all changes are committed when the input *loses focus*; pressing Enter just forces a blur. Why so roundabout? Because if Enter committed directly *and* blur committed too, pressing Enter would commit twice (once for the key, once for the focus loss it causes). Routing everything through blur makes double-commits impossible. `commit()` handles all three cases based on the same `EditState`:

```tsx
if (edit.target === "new") {
  if (value) onChange([...expertise, value]);       // add
} else if (value) {
  onChange(expertise.map((t, i) => ...));           // rename
} else {
  onChange(expertise.filter((_, i) => ...));        // cleared text = delete
}
```

**Escape = cancel, via a ref.** Escape should discard, not commit — but Escape *also* triggers a blur, which would commit. The workaround:

```tsx
const cancelledRef = useRef(false);
// onKeyDown: Escape → cancelledRef.current = true; blur()
// onBlur:    if cancelled, just close; else commit()
```

A `useRef` box ([[CONCEPTS#State and hooks]]) carries the "this blur is a cancellation" flag from the keydown handler to the blur handler that fires immediately after — a message between two events, with no re-render needed.

**The rendered list.** Chips map over `expertise` ([[CONCEPTS#Rendering lists]]); the one being edited renders as the input instead ([[CONCEPTS#Conditional rendering]]), as does the `+` slot. The input is controlled ([[CONCEPTS#Controlled inputs]]) with two nice touches: `autoFocus` puts the cursor in it the moment it appears, and `size={Math.max(state.value.length, 6)}` grows the field with the text so the pill hugs its content like the chips do.

## Concepts used

[[CONCEPTS#Components]], [[CONCEPTS#Props]], [[CONCEPTS#State and hooks]], [[CONCEPTS#Controlled inputs]], [[CONCEPTS#Conditional rendering]], [[CONCEPTS#Rendering lists]], [[CONCEPTS#TypeScript]]
