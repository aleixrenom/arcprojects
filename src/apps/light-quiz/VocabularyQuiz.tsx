import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { Question } from "./types";
import {
  addIdsToStoredQuestions,
  createNewQuestionQueue,
  persistQuestions,
  totalQuestions,
} from "./quizUtils";
import QuestionCard from "./QuestionCard";
import ResetConfirmation from "./ResetConfirmation";
import ResultScreen from "./ResultScreen";
import "./quiz.css";

const VocabularyQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right">("left");

  const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });
  const incorrectSound = new Howl({ src: ["/sounds/incorrect.mp3"] });

  useEffect(() => {
    const storedProgress = localStorage.getItem("quizProgress");
    if (storedProgress) {
      try {
        const parsed = JSON.parse(storedProgress);
        const normalized = addIdsToStoredQuestions(parsed);
        setQuestions(normalized);
      } catch {
        setQuestions(createNewQuestionQueue());
      }
    } else {
      setQuestions(createNewQuestionQueue());
    }
  }, []);

  const handleQuestionAdvance = (updatedQuestions: Question[]) => {
    if (updatedQuestions.length === 0) {
      setQuestions([]);
      setShowResults(true);
      persistQuestions([]);
    } else {
      setQuestions(updatedQuestions);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setQuestionKey((prev) => prev + 1);
      persistQuestions(updatedQuestions);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || questions.length === 0) return;

    const currentQuestion = questions[0];
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const isCorrect = answer === currentQuestion.correct;

    if (isCorrect) {
      setExitDirection("left");
      correctSound.play();
      const nextQuestions = questions.slice(1);
      setTimeout(() => {
        handleQuestionAdvance(nextQuestions);
      }, 500);
    } else {
      setExitDirection("right");
      incorrectSound.play();
      const remaining = questions.slice(1);
      const insertionIndex = remaining.length <= 10 ? remaining.length : 10;
      const nextQuestions = [
        ...remaining.slice(0, insertionIndex),
        currentQuestion,
        ...remaining.slice(insertionIndex),
      ];

      setTimeout(() => {
        handleQuestionAdvance(nextQuestions);
      }, 1500);
    }
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const resetQuiz = () => {
    localStorage.removeItem("quizProgress");
    setQuestions(createNewQuestionQueue());
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResults(false);
    setShowResetConfirm(false);
    setQuestionKey((prev) => prev + 1);
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  if (questions.length === 0 && !showResults) return <div>Loading...</div>;

  if (showResults) {
    return <ResultScreen onTryAgain={resetQuiz} />;
  }

  const currentQuestion = questions[0];
  const completedCount = totalQuestions - questions.length;
  const currentQuestionNumber = completedCount + 1;

  return (
    <div className="quiz-root">
      <AnimatePresence mode="wait">
        <motion.div
          key={questionKey}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: exitDirection === "right" ? 300 : -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="quiz-card"
        >
          <div className="quiz-header">
            <p className="quiz-progress">
              {currentQuestionNumber} / {totalQuestions}
            </p>
            <h2 className="quiz-title">{currentQuestion.word}</h2>
            <motion.button
              onClick={handleResetClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="reset-button"
              aria-label="Reset quiz"
            >
              <svg
                style={{ height: 20, width: 20 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10" />
                <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14" />
              </svg>
            </motion.button>
          </div>
          <ResetConfirmation
            show={showResetConfirm}
            onCancel={cancelReset}
            onReset={resetQuiz}
          />
          <div className="options">
            <QuestionCard
              currentQuestion={currentQuestion}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              onSelectAnswer={handleAnswerSelect}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VocabularyQuiz;
