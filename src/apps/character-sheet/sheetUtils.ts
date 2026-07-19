import {
  Ability,
  AbilityLevelNote,
  AbilityPack,
  CatalogEntry,
  Character,
  SheetState,
} from "./types";
import packsJson from "./data/abilityPacks.json";

/* Generated from "Ability packs - catalog.md" — run `npm run sync:abilities`
   after editing the markdown, never edit the JSON by hand. */
export const abilityPacks = packsJson.packs as AbilityPack[];

const catalogByKey = new Map<string, CatalogEntry>();
for (const pack of abilityPacks) {
  for (const entry of pack.abilities) catalogByKey.set(entry.key, entry);
}

/* The catalog is the source of truth for pack abilities: saved characters
   (localStorage or imports) get their text refreshed on load so rule rewrites,
   descriptions, and level milestones propagate. Abilities whose key no longer
   exists (renamed/removed in the catalog) keep their saved text. */
function refreshFromCatalog(ability: Ability): Ability {
  const entry = ability.catalogKey
    ? catalogByKey.get(ability.catalogKey)
    : undefined;
  if (!entry) return ability;
  return {
    ...ability,
    effect: entry.effect,
    description: entry.description,
    levels: entry.levels,
  };
}

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
    expertise: [],
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
        /* Saves from before the Expertise card lack the field; backfill it so
           the rest of the app can rely on it being an array. */
        const characters: Character[] = parsed.characters.map(
          (c: Character) => ({
            ...c,
            expertise: Array.isArray(c.expertise) ? c.expertise : [],
            abilities: (Array.isArray(c.abilities) ? c.abilities : []).map(
              refreshFromCatalog
            ),
          })
        );
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

/* ---- export / import ----
   Files are a versioned envelope: { app, version, characters: [...] }.
   The same shape covers single- and multi-character exports, so one import
   path handles both. */

const FILE_APP = "ttrpg-character-sheet";
const FILE_VERSION = 1;

export function downloadCharactersFile(
  characters: Character[],
  baseName: string
): void {
  const payload = { app: FILE_APP, version: FILE_VERSION, characters };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug =
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "character";
  link.href = url;
  link.download = `${slug}-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function sanitizeAbility(raw: unknown): Ability | null {
  const a = raw as Record<string, unknown>;
  if (!a || typeof a !== "object" || typeof a.name !== "string") return null;
  return refreshFromCatalog({
    id: uid(),
    name: a.name,
    kind: a.kind === "Reaction" ? "Reaction" : "Action",
    stat: a.stat === "Mind" || a.stat === "Soul" ? a.stat : "Body",
    level: clamp(asNumber(a.level, 1), 0, 10),
    topics: typeof a.topics === "string" ? a.topics : "",
    effect: typeof a.effect === "string" ? a.effect : "",
    ...(typeof a.description === "string"
      ? { description: a.description }
      : {}),
    ...(Array.isArray(a.levels)
      ? {
          levels: a.levels.filter(
            (l): l is AbilityLevelNote =>
              !!l &&
              typeof (l as AbilityLevelNote).level === "number" &&
              typeof (l as AbilityLevelNote).text === "string"
          ),
        }
      : {}),
    ...(typeof a.catalogKey === "string" ? { catalogKey: a.catalogKey } : {}),
  });
}

function sanitizeCharacter(raw: unknown): Character {
  /* Fresh id always — the file's ids can collide with existing characters
     (e.g. re-importing your own export). Missing fields fall back to the
     defaults so older export versions keep loading. */
  const base = defaultCharacter();
  const c = raw as Record<string, unknown>;
  if (!c || typeof c !== "object") return base;
  return {
    ...base,
    name: typeof c.name === "string" && c.name.trim() ? c.name : base.name,
    body: clamp(asNumber(c.body, base.body), 0, 10),
    mind: clamp(asNumber(c.mind, base.mind), 0, 10),
    soul: clamp(asNumber(c.soul, base.soul), 0, 10),
    healthCurrent: typeof c.healthCurrent === "number" ? c.healthCurrent : null,
    resolveCurrent:
      typeof c.resolveCurrent === "number" ? c.resolveCurrent : null,
    insightTokens: clamp(asNumber(c.insightTokens, 0), 0, 99),
    totalPoints: clamp(asNumber(c.totalPoints, base.totalPoints), 0, 999),
    abilities: Array.isArray(c.abilities)
      ? c.abilities.map(sanitizeAbility).filter((a): a is Ability => a !== null)
      : [],
    expertise: Array.isArray(c.expertise)
      ? c.expertise.filter(
          (t): t is string => typeof t === "string" && t.trim() !== ""
        )
      : [],
    notes: typeof c.notes === "string" ? c.notes : "",
  };
}

/* Throws on anything that isn't a character export; the caller turns that
   into the user-facing error message. */
export function parseImportedCharacters(text: string): Character[] {
  const parsed = JSON.parse(text);
  if (
    !parsed ||
    parsed.app !== FILE_APP ||
    !Array.isArray(parsed.characters) ||
    parsed.characters.length === 0
  ) {
    throw new Error("not a character export");
  }
  return parsed.characters.map(sanitizeCharacter);
}
