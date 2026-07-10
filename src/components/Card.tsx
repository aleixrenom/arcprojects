import React from "react";
import type { CardInfo } from "../store/ui.js";
import { getCardPattern } from "../lib/cardPattern.js";

type CardProps = {
  card: CardInfo;
  onOpen: (id: string) => void;
};

export default function Card({ card, onOpen }: CardProps) {
  return (
    <div
      className="card"
      style={{
        viewTransitionName: `card-${card.kind}-${card.id}`,
        ...getCardPattern(card.id),
      }}
      onClick={() => onOpen(card.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onOpen(card.id);
        }
      }}
    >
      {card.title}
    </div>
  );
}
