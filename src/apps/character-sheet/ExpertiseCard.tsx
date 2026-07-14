import React, { useRef, useState } from "react";

type ExpertiseCardProps = {
  expertise: string[];
  onChange: (next: string[]) => void;
};

/* Chips edit in place (per user decision): click one to edit its text, and a
   chip whose text is cleared removes itself on blur. The dashed + swaps to the
   same inline input for adding. All commits go through onBlur — Enter just
   blurs the input — so a commit can never fire twice. */
type EditState = { target: number | "new"; value: string };

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  expertise,
  onChange,
}) => {
  const [edit, setEdit] = useState<EditState | null>(null);
  const cancelledRef = useRef(false);

  const commit = () => {
    if (!edit) return;
    const value = edit.value.trim();
    if (edit.target === "new") {
      if (value) onChange([...expertise, value]);
    } else if (value) {
      onChange(expertise.map((t, i) => (i === edit.target ? value : t)));
    } else {
      onChange(expertise.filter((_, i) => i !== edit.target));
    }
    setEdit(null);
  };

  const renderInput = (state: EditState) => (
    <input
      className="cs-expertise-input"
      value={state.value}
      autoFocus
      size={Math.max(state.value.length, 6)}
      placeholder="Topic"
      onChange={(e) => setEdit({ target: state.target, value: e.target.value })}
      onBlur={() => {
        if (cancelledRef.current) {
          cancelledRef.current = false;
          setEdit(null);
          return;
        }
        commit();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          cancelledRef.current = true;
          e.currentTarget.blur();
        }
      }}
    />
  );

  return (
    <div className="cs-card">
      <div className="cs-card-title">Expertise</div>
      <div className="cs-expertise-list">
        {expertise.map((topic, i) =>
          edit && edit.target === i ? (
            <React.Fragment key={i}>{renderInput(edit)}</React.Fragment>
          ) : (
            <button
              key={i}
              type="button"
              className="cs-expertise-chip"
              onClick={() => setEdit({ target: i, value: topic })}
            >
              {topic}
            </button>
          )
        )}
        {edit && edit.target === "new" ? (
          renderInput(edit)
        ) : (
          <button
            type="button"
            className="cs-expertise-add"
            onClick={() => setEdit({ target: "new", value: "" })}
            aria-label="Add expertise"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpertiseCard;
