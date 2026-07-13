import React, { useEffect, useState } from "react";
import {
  Ability,
  CatalogEntry,
  Character,
  SheetState,
  StatName,
} from "./types";
import {
  clamp,
  defaultCharacter,
  loadSheetState,
  persistSheetState,
  tri,
  uid,
} from "./sheetUtils";
import Stepper from "./Stepper";
import AbilitiesCard from "./AbilitiesCard";
import AddAbilityModal, { CustomDraft } from "./AddAbilityModal";
import "./sheet.css";

const STATS: { key: "body" | "mind" | "soul"; name: StatName; sub: string }[] =
  [
    { key: "body", name: "Body", sub: "Physical" },
    { key: "mind", name: "Mind", sub: "Logic & learning" },
    { key: "soul", name: "Soul", sub: "Intuition" },
  ];

const PoolBlock: React.FC<{
  name: string;
  max: number;
  current: number;
  fillClass: string;
  last?: boolean;
  onStep: (delta: number) => void;
  onReset: () => void;
}> = ({ name, max, current, fillClass, last, onStep, onReset }) => (
  <div className={"cs-pool-block" + (last ? " cs-pool-block-last" : "")}>
    <div className="cs-pool-head">
      <div className="cs-pool-name">{name}</div>
      <div className="cs-pool-max">max {max}</div>
    </div>
    <div className="cs-pool-stepper-row">
      <Stepper
        value={current}
        valueClassName="cs-pool-val"
        onDec={() => onStep(-1)}
        onInc={() => onStep(1)}
      />
      <button type="button" className="cs-reset-btn" onClick={onReset}>
        reset
      </button>
    </div>
    <div className="cs-bar-track">
      <div
        className={`cs-bar-fill ${fillClass}`}
        style={{
          width: `${max > 0 ? clamp((current / max) * 100, 0, 100) : 0}%`,
        }}
      />
    </div>
    <div className="cs-recovery">Recovery on Rest: {Math.ceil(max / 3)}</div>
  </div>
);

const CharacterSheet: React.FC = () => {
  const [sheet, setSheet] = useState<SheetState>(loadSheetState);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState("Basic");

  useEffect(() => {
    persistSheetState(sheet);
  }, [sheet]);

  const active =
    sheet.characters.find((c) => c.id === sheet.activeId) ??
    sheet.characters[0];

  const healthMax = 3 + active.body;
  const resolveMax = 3 + Math.max(active.mind, active.soul);
  const healthCurrent = active.healthCurrent ?? healthMax;
  const resolveCurrent = active.resolveCurrent ?? resolveMax;

  const spent =
    tri(active.body) +
    tri(active.mind) +
    tri(active.soul) +
    active.abilities.reduce((sum, a) => sum + tri(a.level), 0);
  const spOver = spent > active.totalPoints;

  const updateActive = (patch: (c: Character) => Partial<Character>) => {
    setSheet((s) => ({
      ...s,
      characters: s.characters.map((c) =>
        c.id === s.activeId ? { ...c, ...patch(c) } : c
      ),
    }));
  };

  const addCharacter = () => {
    const character = defaultCharacter();
    setSheet((s) => ({
      characters: [...s.characters, character],
      activeId: character.id,
    }));
  };

  const deleteCharacter = (id: string) => {
    setSheet((s) => {
      if (s.characters.length <= 1) return s;
      const characters = s.characters.filter((c) => c.id !== id);
      return {
        characters,
        activeId: s.activeId === id ? characters[0].id : s.activeId,
      };
    });
  };

  const stepStat = (key: "body" | "mind" | "soul", delta: number) =>
    updateActive((c) => ({ [key]: clamp(c[key] + delta, 0, 10) }));

  const stepHealth = (delta: number) =>
    updateActive((c) => {
      const max = 3 + c.body;
      return {
        healthCurrent: clamp((c.healthCurrent ?? max) + delta, -max, max),
      };
    });

  const stepResolve = (delta: number) =>
    updateActive((c) => {
      const max = 3 + Math.max(c.mind, c.soul);
      return {
        resolveCurrent: clamp((c.resolveCurrent ?? max) + delta, -max, max),
      };
    });

  const addAbility = (ability: Omit<Ability, "id">) =>
    updateActive((c) => ({
      abilities: [...c.abilities, { ...ability, id: uid() }],
    }));

  const addFromCatalog = (entry: CatalogEntry, stat: StatName) =>
    addAbility({
      name: entry.name,
      kind: entry.kind,
      stat,
      level: 1,
      topics: "",
      effect: entry.effect,
      catalogKey: entry.key,
    });

  const addCustom = (draft: CustomDraft) =>
    addAbility({
      name: draft.name.trim() || "Custom ability",
      kind: draft.kind,
      stat: draft.stat,
      level: 1,
      topics: "",
      effect: draft.effect,
    });

  const changeAbilityLevel = (id: string, delta: number) =>
    updateActive((c) => ({
      abilities: c.abilities.map((a) =>
        a.id === id ? { ...a, level: clamp(a.level + delta, 0, 10) } : a
      ),
    }));

  const deleteAbility = (id: string) =>
    updateActive((c) => ({
      abilities: c.abilities.filter((a) => a.id !== id),
    }));

  return (
    <div className="cs-root">
      <div className="cs-container">
        <div className="cs-tabs">
          {sheet.characters.map((c) => {
            const isActive = c.id === active.id;
            const showDelete = isActive && sheet.characters.length > 1;
            return (
              <div
                key={c.id}
                className={
                  "cs-tab" +
                  (isActive ? " active" : "") +
                  (showDelete ? " has-delete" : "")
                }
              >
                <button
                  type="button"
                  className="cs-tab-btn"
                  onClick={() => setSheet((s) => ({ ...s, activeId: c.id }))}
                >
                  {c.name || "Unnamed"}
                </button>
                {showDelete && (
                  <button
                    type="button"
                    className="cs-tab-delete"
                    onClick={() => deleteCharacter(c.id)}
                    aria-label="Delete character"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
          <button type="button" className="cs-new-char" onClick={addCharacter}>
            + New
          </button>
        </div>

        <div className="cs-header">
          <div className="cs-name-col">
            <input
              className="cs-name-input"
              value={active.name}
              onChange={(e) => updateActive(() => ({ name: e.target.value }))}
              placeholder="Character name"
            />
            <div className="cs-subtitle">Character sheet</div>
          </div>
          <div className={"cs-sp-badge" + (spOver ? " over" : "")}>
            SP {spent}/{active.totalPoints}
          </div>
        </div>

        <div className="cs-grid">
          <div className="cs-col">
            <div className="cs-card">
              <div className="cs-card-title">Stats</div>
              {STATS.map(({ key, name, sub }) => (
                <div key={key} className="cs-stat-row">
                  <div className="cs-stat-label">
                    <div className={`cs-dot ${key}`} />
                    <div>
                      <div className="cs-stat-name">{name}</div>
                      <div className="cs-stat-sub">{sub}</div>
                    </div>
                  </div>
                  <Stepper
                    value={active[key]}
                    onDec={() => stepStat(key, -1)}
                    onInc={() => stepStat(key, 1)}
                  />
                  <div className="cs-pool-pill">{active[key]} d6</div>
                </div>
              ))}
            </div>

            <div className="cs-card">
              <div className="cs-card-title">Health &amp; Resolve</div>
              <PoolBlock
                name="Health"
                max={healthMax}
                current={healthCurrent}
                fillClass="health"
                onStep={stepHealth}
                onReset={() =>
                  updateActive(() => ({ healthCurrent: healthMax }))
                }
              />
              <PoolBlock
                name="Resolve"
                max={resolveMax}
                current={resolveCurrent}
                fillClass="resolve"
                last
                onStep={stepResolve}
                onReset={() =>
                  updateActive(() => ({ resolveCurrent: resolveMax }))
                }
              />
            </div>

            <div className="cs-card">
              <div className="cs-card-title">Counters</div>
              <div className="cs-counter-row">
                <div>
                  <div className="cs-counter-label">Insight tokens</div>
                  <div className="cs-counter-hint">
                    Spend to force a die to a 1 or 6. Expires at end of session.
                  </div>
                </div>
                <Stepper
                  value={active.insightTokens}
                  valueClassName="cs-counter-val"
                  onDec={() =>
                    updateActive((c) => ({
                      insightTokens: clamp(c.insightTokens - 1, 0, 99),
                    }))
                  }
                  onInc={() =>
                    updateActive((c) => ({
                      insightTokens: clamp(c.insightTokens + 1, 0, 99),
                    }))
                  }
                />
              </div>
              <div className="cs-counter-row cs-counter-row-last">
                <div>
                  <div className="cs-counter-label">Max skill points</div>
                  <div className="cs-counter-hint">
                    Total earned so far, spend as you level up.
                  </div>
                </div>
                <Stepper
                  value={active.totalPoints}
                  valueClassName="cs-counter-val"
                  onDec={() =>
                    updateActive((c) => ({
                      totalPoints: clamp(c.totalPoints - 1, 0, 999),
                    }))
                  }
                  onInc={() =>
                    updateActive((c) => ({
                      totalPoints: clamp(c.totalPoints + 1, 0, 999),
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="cs-col">
            <AbilitiesCard
              abilities={active.abilities}
              onOpenAdd={() => setModalOpen(true)}
              onChangeLevel={changeAbilityLevel}
              onDelete={deleteAbility}
            />

            <div className="cs-card">
              <div className="cs-card-title">Notes</div>
              <textarea
                className="cs-notes-textarea"
                value={active.notes}
                onChange={(e) =>
                  updateActive(() => ({ notes: e.target.value }))
                }
                placeholder="Background, inventory, contacts, downtime projects..."
              />
            </div>
          </div>
        </div>

        <div className="cs-footer">
          Autosaves in this browser · {sheet.characters.length} character
          {sheet.characters.length === 1 ? "" : "s"} saved
        </div>
      </div>

      {modalOpen && (
        <AddAbilityModal
          ownedKeys={
            new Set(
              active.abilities
                .map((a) => a.catalogKey)
                .filter((k): k is string => !!k)
            )
          }
          selectedPack={selectedPack}
          onSelectPack={setSelectedPack}
          onAddFromCatalog={addFromCatalog}
          onAddCustom={addCustom}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CharacterSheet;
