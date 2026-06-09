import { motion } from "framer-motion";

type ResultScreenProps = {
  onTryAgain: () => void;
};

export default function ResultScreen({ onTryAgain }: ResultScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="result-root"
    >
      <div className="result-card">
        <h2 className="result-title">Quiz Complete!</h2>
        <p className="result-text">
          You completed the quiz — great work! Ready to go again?
        </p>
        <button onClick={onTryAgain} className="btn primary">
          Try Again
        </button>
      </div>
    </motion.div>
  );
}
