import React, { useState } from "react";
import { AbilityKind, CatalogEntry, StatName } from "./types";
import { abilityPacks } from "./sheetUtils";
import EffectText from "./EffectText";

export type CustomDraft = {
  name: string;
  description: string;
  kind: AbilityKind;
  stat: StatName;
  effect: string;
};

type Mode =
  | { view: "catalog" }
  | { view: "pickStat"; pending: CatalogEntry }
  | { view: "custom" };

type AddAbilityModalProps = {
  /* catalogKeys of abilities already on the sheet, to mark non-repeatable
     entries as added. */
  ownedKeys: Set<string>;
  selectedPack: string;
  onSelectPack: (packId: string) => void;
  onAddFromCatalog: (entry: CatalogEntry, stat: StatName) => void;
  onAddCustom: (draft: CustomDraft) => void;
  onClose: () => void;
};

function statLabel(entry: CatalogEntry): string {
  if (entry.statMode === "fixed") return entry.stat;
  if (entry.statMode === "any") return "Any stat";
  return entry.statOptions.join(" OR ");
}

function statChoices(entry: CatalogEntry): StatName[] {
  if (entry.statMode === "any") return ["Body", "Mind", "Soul"];
  if (entry.statMode === "or") return entry.statOptions;
  return [entry.stat];
}

const AddAbilityModal: React.FC<AddAbilityModalProps> = ({
  ownedKeys,
  selectedPack,
  onSelectPack,
  onAddFromCatalog,
  onAddCustom,
  onClose,
}) => {
  const [mode, setMode] = useState<Mode>({ view: "catalog" });
  const [draft, setDraft] = useState<CustomDraft>({
    name: "",
    description: "",
    kind: "Action",
    stat: "Body",
    effect: "",
  });

  const pack = abilityPacks.find((p) => p.id === selectedPack);
  const groups: { label: string; items: CatalogEntry[] }[] = [];
  for (const entry of pack?.abilities ?? []) {
    let group = groups.find((g) => g.label === entry.group);
    if (!group) {
      group = { label: entry.group, items: [] };
      groups.push(group);
    }
    group.items.push(entry);
  }

  const pickCatalogEntry = (entry: CatalogEntry) => {
    if (entry.statMode === "fixed") {
      onAddFromCatalog(entry, entry.stat);
      onClose();
    } else {
      setMode({ view: "pickStat", pending: entry });
    }
  };

  const header = (title: string) => (
    <div className="cs-modal-header">
      <div className="cs-modal-title">{title}</div>
      <button
        type="button"
        className="cs-modal-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );

  const backButton = (
    <button
      type="button"
      className="cs-back-btn"
      onClick={() => setMode({ view: "catalog" })}
    >
      ← Back
    </button>
  );

  return (
    <div className="cs-modal-backdrop" onClick={onClose}>
      <div className="cs-modal-panel" onClick={(e) => e.stopPropagation()}>
        {mode.view === "catalog" && (
          <>
            {header("Add ability")}
            <button
              type="button"
              className="cs-custom-cta"
              onClick={() => {
                setDraft({
                  name: "",
                  description: "",
                  kind: "Action",
                  stat: "Body",
                  effect: "",
                });
                setMode({ view: "custom" });
              }}
            >
              + Add custom ability
            </button>
            <select
              className="cs-pack-select"
              value={selectedPack}
              onChange={(e) => onSelectPack(e.target.value)}
            >
              {abilityPacks.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="cs-modal-list">
              {groups.map((group) => (
                <React.Fragment key={group.label}>
                  <div className="cs-catalog-group-header">{group.label}</div>
                  {group.items.map((entry) => {
                    const added = ownedKeys.has(entry.key) && !entry.repeatable;
                    return (
                      <button
                        key={entry.key}
                        type="button"
                        className={"cs-catalog-card" + (added ? " added" : "")}
                        disabled={added}
                        onClick={() => pickCatalogEntry(entry)}
                      >
                        <div className="cs-catalog-row">
                          <div className="cs-catalog-name">{entry.name}</div>
                          <div className="cs-catalog-tag">
                            {entry.kind} · {statLabel(entry)}
                          </div>
                        </div>
                        <div className="cs-catalog-effect">
                          <EffectText text={entry.effect} />
                        </div>
                        {entry.levels && entry.levels.length > 0 && (
                          <div className="cs-catalog-levels">
                            Milestones at level{" "}
                            {entry.levels.map((l) => l.level).join(", ")}
                          </div>
                        )}
                        {added && <div className="cs-added-label">Added</div>}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
              {groups.length === 0 && (
                <div className="cs-empty">
                  This pack doesn't have any abilities published yet.
                </div>
              )}
            </div>
          </>
        )}

        {mode.view === "pickStat" && (
          <>
            {header("Choose linked stat")}
            <div className="cs-pickstat-body">
              <div className="cs-pickstat-name">{mode.pending.name}</div>
              <div className="cs-pickstat-hint">
                This ability can link to one of these stats. Choose one:
              </div>
              <div className="cs-pickstat-options">
                {statChoices(mode.pending).map((stat) => (
                  <button
                    key={stat}
                    type="button"
                    className="cs-stat-option-btn"
                    onClick={() => {
                      onAddFromCatalog(mode.pending, stat);
                      onClose();
                    }}
                  >
                    {stat}
                  </button>
                ))}
              </div>
              {backButton}
            </div>
          </>
        )}

        {mode.view === "custom" && (
          <>
            {header("Custom ability")}
            <div className="cs-custom-form">
              <input
                className="cs-custom-input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Ability name"
              />
              <input
                className="cs-custom-input"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
                placeholder="Short description (shown on the ability card)"
              />
              <div className="cs-custom-row">
                <select
                  className="cs-custom-select"
                  value={draft.kind}
                  onChange={(e) =>
                    setDraft({ ...draft, kind: e.target.value as AbilityKind })
                  }
                >
                  <option value="Action">Action</option>
                  <option value="Reaction">Reaction</option>
                </select>
                <select
                  className="cs-custom-select"
                  value={draft.stat}
                  onChange={(e) =>
                    setDraft({ ...draft, stat: e.target.value as StatName })
                  }
                >
                  <option value="Body">Body</option>
                  <option value="Mind">Mind</option>
                  <option value="Soul">Soul</option>
                </select>
              </div>
              <textarea
                className="cs-custom-textarea"
                value={draft.effect}
                onChange={(e) => setDraft({ ...draft, effect: e.target.value })}
                placeholder="Effect text (keywords: Expertise, Strike, Empower, Spend, Soak, Mitigate, Evade...)"
              />
              <div className="cs-custom-footer">
                {backButton}
                <button
                  type="button"
                  className="cs-save-btn"
                  onClick={() => {
                    onAddCustom(draft);
                    onClose();
                  }}
                >
                  Add to sheet
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddAbilityModal;
