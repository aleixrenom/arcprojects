export type StatName = "Body" | "Mind" | "Soul";
export type AbilityKind = "Action" | "Reaction";

/* A "Level N:" milestone from the catalog; shown on the sheet only once the
   ability has reached that level. */
export interface AbilityLevelNote {
  level: number;
  text: string;
}

export interface Ability {
  id: string;
  name: string;
  kind: AbilityKind;
  stat: StatName;
  level: number;
  /* Legacy field: no longer editable in the UI, but kept in the data model so
     previously saved characters still show their Topics line. */
  topics: string;
  effect: string;
  description?: string;
  levels?: AbilityLevelNote[];
  /* Present only when the ability came from a pack entry; used to grey out
     non-repeatable catalog entries already on the sheet. */
  catalogKey?: string;
}

export interface Character {
  id: string;
  name: string;
  body: number;
  mind: number;
  soul: number;
  /* null means "at max" (max is derived from stats, not stored). */
  healthCurrent: number | null;
  resolveCurrent: number | null;
  insightTokens: number;
  totalPoints: number;
  abilities: Ability[];
  expertise: string[];
  notes: string;
}

export interface SheetState {
  characters: Character[];
  activeId: string;
}

export type StatMode =
  | { statMode: "fixed"; stat: StatName }
  | { statMode: "any" }
  | { statMode: "or"; statOptions: StatName[] };

export type CatalogEntry = {
  key: string;
  name: string;
  kind: AbilityKind;
  group: string;
  effect: string;
  levels?: AbilityLevelNote[];
  repeatable?: boolean;
  description?: string;
} & StatMode;

export interface AbilityPack {
  id: string;
  label: string;
  abilities: CatalogEntry[];
}
