import { motion } from "framer-motion";
import type { Question } from "./types";

type QuestionCardProps = {
  currentQuestion: Question;
  selectedAnswer: string | null;
  isAnswered: boolean;
  onSelectAnswer: (answer: string) => void;
};

export default function QuestionCard({
  currentQuestion,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <div>
      {currentQuestion.options.map((option, index) => {
        let cls = "quiz-option";
        if (selectedAnswer === option) {
          cls +=
            option === currentQuestion.correct
              ? " selected correct"
              : " selected incorrect";
        } else if (
          isAnswered &&
          option === currentQuestion.correct &&
          selectedAnswer !== currentQuestion.correct
        ) {
          cls += " correct";
        } else {
          cls += " neutral";
        }

        return (
          <motion.button
            key={index}
            onClick={() => onSelectAnswer(option)}
            disabled={isAnswered}
            className={cls}
            whileHover={!isAnswered ? { scale: 1.02 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}
