// Converts the TTRPG ability-pack catalog markdown (the living design doc)
// into the JSON consumed by the character sheet app.
//
// Usage: npm run sync:abilities
//
// Source:  Design/design_handoff_character_sheet/Ability packs - catalog.md
// Output:  src/apps/character-sheet/data/abilityPacks.json
//
// Expected markdown shape:
//   # Basic abilities            → pack (id "Basic")
//   # Ability pack - Intrigue    → pack (id "Intrigue")
//   ## Actions - aggression      → group ("Actions — Aggression", kind Action)
//   ## Reactions                 → group ("Reactions", kind Reaction)
//   ### Ability name             → ability entry, followed by
//   **Description:** / **Stat:** / **Effect:** (multi-line) / **Level N:** lines
// The "# Keywords" section (and anything before the first pack header) is ignored.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(
  root,
  "Design/design_handoff_character_sheet/Ability packs - catalog.md"
);
const OUTPUT = join(root, "src/apps/character-sheet/data/abilityPacks.json");

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleCase = (text) => text.trim().replace(/^./, (ch) => ch.toUpperCase());

function parsePackHeader(line) {
  const basic = line.match(/^# (Basic abilities)\s*$/);
  if (basic) return { id: "Basic", label: "Basic abilities" };
  const pack = line.match(/^# Ability pack\s*-\s*(.+?)\s*$/);
  if (pack) return { id: pack[1], label: `Ability pack — ${pack[1]}` };
  return null;
}

function parseStat(text) {
  if (/^any stat$/i.test(text)) return { statMode: "any" };
  const or = text.split(/\s+OR\s+/);
  if (or.length === 2) return { statMode: "or", statOptions: or };
  return { statMode: "fixed", stat: text };
}

function parse(md) {
  const lines = md.split(/\r?\n/);
  const packs = [];
  let pack = null; // null while inside "# Keywords" / preamble
  let group = null;
  let ability = null;
  let field = null; // which multi-line field is being accumulated

  const flushAbility = () => {
    if (!ability) return;
    const effectLines = ability.effectLines
      .join("\n")
      .replace(/[ \t]+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .split("\n");
    for (const lvl of ability.levelNotes) effectLines.push(lvl);
    const effect = effectLines.join("\n").trim();

    const entry = {
      key:
        ability.pack.id === "Basic"
          ? slug(ability.name)
          : `${slug(ability.pack.id)}-${slug(ability.name)}`,
      name: ability.name,
      kind: ability.group.kind,
      group: ability.group.label,
      ...parseStat(ability.stat || "Body"),
      effect,
    };
    if (/take this ability (more than once|multiple times)/i.test(effect)) {
      entry.repeatable = true;
    }
    if (ability.description) entry.description = ability.description;
    ability.pack.abilities.push(entry);
    ability = null;
    field = null;
  };

  for (const line of lines) {
    const packHeader = line.startsWith("# ") ? parsePackHeader(line) : null;
    if (packHeader) {
      flushAbility();
      pack = { ...packHeader, abilities: [] };
      packs.push(pack);
      group = null;
      continue;
    }
    if (line.startsWith("# ")) {
      // Non-pack top-level section (e.g. "# Keywords") — ignore until next pack.
      flushAbility();
      pack = null;
      group = null;
      continue;
    }
    if (!pack) continue;

    if (line.startsWith("## ")) {
      flushAbility();
      const label = line
        .slice(3)
        .split(/\s*-\s*/)
        .map(titleCase)
        .join(" — ");
      group = {
        label,
        kind: /^reaction/i.test(label) ? "Reaction" : "Action",
      };
      continue;
    }
    if (line.startsWith("### ")) {
      flushAbility();
      if (!group) {
        throw new Error(`Ability "${line.slice(4)}" appears outside a group`);
      }
      ability = {
        pack,
        group,
        name: line.slice(4).trim(),
        description: "",
        stat: "",
        effectLines: [],
        levelNotes: [],
      };
      continue;
    }
    if (!ability) continue;

    const fieldMatch = line.match(
      /^\*\*(Description|Stat|Effect|Level \d+):\*\*\s*(.*)$/
    );
    if (fieldMatch) {
      const [, name, value] = fieldMatch;
      if (name === "Description") {
        ability.description = value.trim();
        field = null;
      } else if (name === "Stat") {
        ability.stat = value.trim();
        field = null;
      } else if (name === "Effect") {
        ability.effectLines.push(value);
        field = "effect";
      } else {
        // Level note; skip ones with no text (placeholders in the doc).
        if (value.trim()) ability.levelNotes.push(`${name}: ${value.trim()}`);
        field = null;
      }
      continue;
    }
    if (field === "effect") ability.effectLines.push(line);
  }
  flushAbility();
  return packs;
}

const packs = parse(readFileSync(SOURCE, "utf8"));
mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify({ packs }, null, 2) + "\n");

for (const p of packs) {
  console.log(`${p.id}: ${p.abilities.length} abilities`);
}
console.log(`Wrote ${OUTPUT}`);
