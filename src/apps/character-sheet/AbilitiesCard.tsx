import React from "react";
import { Ability } from "./types";
import Stepper from "./Stepper";

type AbilitiesCardProps = {
  abilities: Ability[];
  onOpenAdd: () => void;
  onChangeLevel: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
};

const AbilityRow: React.FC<{
  ability: Ability;
  onChangeLevel: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
}> = ({ ability, onChangeLevel, onDelete }) => (
  <div className="cs-ability-row">
    <div className="cs-ability-left">
      <div className="cs-ability-nameline">
        <div className="cs-ability-name">
          {ability.name || "Unnamed ability"}
        </div>
        <div className="cs-ability-tag">{ability.stat}</div>
      </div>
      <div className="cs-ability-effect">{ability.effect}</div>
      {ability.topics.trim() ? (
        <div className="cs-ability-topics">Topics: {ability.topics}</div>
      ) : null}
    </div>
    <div className="cs-ability-right">
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
        onClick={() => onDelete(ability.id)}
        aria-label="Delete ability"
      >
        ×
      </button>
    </div>
  </div>
);

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
