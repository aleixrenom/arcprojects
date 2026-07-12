import { wordSets } from "./quizUtils";

type WordSetPickerProps = {
  show: boolean;
  activeSetId: string;
  onSelect: (setId: string) => void;
  onClose: () => void;
};

export default function WordSetPicker({
  show,
  activeSetId,
  onSelect,
  onClose,
}: WordSetPickerProps) {
  if (!show) return null;

  return (
    <div className="word-set-overlay" onClick={onClose}>
      <div
        className="word-set-modal"
        role="dialog"
        aria-label="Choose word set"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="word-set-title">Choose a word set</span>
        {wordSets.map((set) => (
          <button
            key={set.id}
            onClick={() => onSelect(set.id)}
            className={`btn block ${set.id === activeSetId ? "primary" : "outline"}`}
          >
            {set.label}
          </button>
        ))}
      </div>
    </div>
  );
}
