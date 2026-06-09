type ResetConfirmationProps = {
  show: boolean;
  onCancel: () => void;
  onReset: () => void;
};

export default function ResetConfirmation({
  show,
  onCancel,
  onReset,
}: ResetConfirmationProps) {
  if (!show) return null;

  return (
    <div className="confirm-box">
      <div className="confirm-inner">
        <span>Reset quiz and lose current progress?</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={onCancel} className="btn outline small">
            Cancel
          </button>
          <button onClick={onReset} className="btn primary small">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
