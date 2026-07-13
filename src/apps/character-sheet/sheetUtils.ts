import { AbilityPack, Character, SheetState } from "./types";
import packsJson from "./data/abilityPacks.json";

/* Generated from "Ability packs - catalog.md" — run `npm run sync:abilities`
   after editing the markdown, never edit the JSON by hand. */
export const abilityPacks = packsJson.packs as AbilityPack[];

const STORAGE_KEY = "ttrpg-character-sheet-v1";

/* Triangular-number cost: level L costs 1+2+...+L skill points in total. */
export function tri(n: number): number {
  const level = Math.max(0, Math.floor(n));
  return (level * (level + 1)) / 2;
}

export function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function defaultCharacter(): Character {
  return {
    id: uid(),
    name: "New Character",
    body: 0,
    mind: 0,
    soul: 0,
    healthCurrent: null,
    resolveCurrent: null,
    insightTokens: 0,
    totalPoints: 16,
    abilities: [],
    notes: "",
  };
}

export function loadSheetState(): SheetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.characters) &&
        parsed.characters.length
      ) {
        const characters: Character[] = parsed.characters;
        const activeId = characters.some((c) => c.id === parsed.activeId)
          ? (parsed.activeId as string)
          : characters[0].id;
        return { characters, activeId };
      }
    }
  } catch {
    /* corrupt storage — fall through to a fresh sheet */
  }
  const character = defaultCharacter();
  return { characters: [character], activeId: character.id };
}

export function persistSheetState(state: SheetState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode, quota) — sheet still works in memory */
  }
}
