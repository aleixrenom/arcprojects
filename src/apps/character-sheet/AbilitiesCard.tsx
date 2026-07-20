import React, { useState } from "react";
import { Ability } from "./types";
import Stepper from "./Stepper";
import EffectText from "./EffectText";

type AbilitiesCardProps = {
  abilities: Ability[];
  onOpenAdd: () => void;
  onChangeLevel: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
};

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <span className={"cs-ability-chevron" + (open ? " open" : "")} aria-hidden>
    ▸
  </span>
);

const AbilityRow: React.FC<{
  ability: Ability;
  onChangeLevel: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
}> = ({ ability, onChangeLevel, onDelete }) => {
  /* Deleting an ability is low-stakes (it's one tap to re-add from the
     catalog), so the confirm is inline in the row rather than a modal. */
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);
  const [foldedLevels, setFoldedLevels] = useState<number[]>([]);

  const description = ability.description?.trim() ?? "";
  const levels = ability.levels ?? [];
  const unlocked = levels.filter((l) => l.level <= ability.level);
  const nextLocked = levels.find((l) => l.level > ability.level);
  /* The card shows only the description (nothing if the catalog hasn't got one
     yet); the effect always lives behind the chevron. */
  const hasDetails = !!ability.effect || levels.length > 0;

  const toggleLevel = (level: number) =>
    setFoldedLevels((folded) =>
      folded.includes(level)
        ? folded.filter((l) => l !== level)
        : [...folded, level]
    );

  const headerContent = (
    <>
      <div className="cs-ability-nameline">
        {hasDetails && <Chevron open={open} />}
        <div className="cs-ability-name">
          {ability.name || "Unnamed ability"}
        </div>
        <div className="cs-ability-tag">{ability.stat}</div>
      </div>
      {description && <div className="cs-ability-desc">{description}</div>}
    </>
  );

  return (
    <div className="cs-ability-row">
      <div className="cs-ability-top">
        <div className="cs-ability-left">
          {hasDetails ? (
            <button
              type="button"
              className="cs-ability-header"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              {headerContent}
            </button>
          ) : (
            headerContent
          )}
          {ability.topics.trim() ? (
            <div className="cs-ability-topics">Topics: {ability.topics}</div>
          ) : null}
        </div>
        <div className="cs-ability-right">
          {confirming ? (
            <div className="cs-ability-confirm">
              <span>Delete?</span>
              <button
                type="button"
                className="cs-ability-confirm-yes"
                onClick={() => onDelete(ability.id)}
              >
                yes
              </button>
              <button
                type="button"
                className="cs-ability-confirm-no"
                onClick={() => setConfirming(false)}
              >
                no
              </button>
            </div>
          ) : (
            <>
              <Stepper
                small
                value={ability.level}
                onDec={() => onChangeLevel(ability.id, -1)}
                onInc={() => onChangeLevel(ability.id, 1)}
              />
              <div className="cs-ability-pool">{ability.level}d6</div>
              <button
                type="button"
                className="cs-ability-delete"
                onClick={() => setConfirming(true)}
                aria-label="Delete ability"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>
      {open && hasDetails && (
        <div className="cs-ability-details">
          {ability.effect ? (
            <div className="cs-ability-effect">
              <EffectText text={ability.effect} />
            </div>
          ) : null}
          {unlocked.map((milestone) => {
            const expanded = !foldedLevels.includes(milestone.level);
            return (
              <div key={milestone.level} className="cs-ability-level">
                <button
                  type="button"
                  className="cs-ability-level-head"
                  onClick={() => toggleLevel(milestone.level)}
                  aria-expanded={expanded}
                >
                  <Chevron open={expanded} />
                  Level {milestone.level}
                </button>
                {expanded && (
                  <div className="cs-ability-level-text">
                    <EffectText text={milestone.text} />
                  </div>
                )}
              </div>
            );
          })}
          {nextLocked && (
            <div className="cs-ability-next">
              Next milestone at ability level {nextLocked.level}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AbilitiesCard: React.FC<AbilitiesCardProps> = ({
  abilities,
  onOpenAdd,
  onChangeLevel,
  onDelete,
}) => {
  const actions = abilities.filter((a) => a.kind === "Action");
  const reactions = abilities.filter((a) => a.kind === "Reaction");

  const renderGroup = (label: string, list: Ability[], emptyText: string) => (
    <>
      <div className="cs-ability-group-header">{label}</div>
      {list.map((a) => (
        <AbilityRow
          key={a.id}
          ability={a}
          onChangeLevel={onChangeLevel}
          onDelete={onDelete}
        />
      ))}
      {list.length === 0 && <div className="cs-empty">{emptyText}</div>}
    </>
  );

  return (
    <div className="cs-card">
      <div className="cs-abilities-head">
        <div className="cs-card-title cs-card-title-tight">Abilities</div>
        <button type="button" className="cs-add-btn" onClick={onOpenAdd}>
          + Add ability
        </button>
      </div>
      {renderGroup("Actions", actions, "No Action abilities yet.")}
      {renderGroup("Reactions", reactions, "No Reaction abilities yet.")}
    </div>
  );
};

export default AbilitiesCard;
