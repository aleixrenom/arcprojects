import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Question } from "./types";
import {
  createNewQuestionQueue,
  getTotalQuestions,
  isValidWordSetId,
  loadActiveWordSetId,
  loadQuestionsForSet,
  persistActiveWordSetId,
  persistQuestions,
} from "./quizUtils";
import QuestionCard from "./QuestionCard";
import ResetConfirmation from "./ResetConfirmation";
import ResultScreen from "./ResultScreen";
import WordSetPicker from "./WordSetPicker";
import "./quiz.css";

const VocabularyQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { set: searchSet } = useSearch({ strict: false }) as { set?: string };

  // The URL is the source of truth for the active set; localStorage only
  // fills in when the URL has no (valid) set param.
  const activeSetId = useMemo(
    () =>
      searchSet && isValidWordSetId(searchSet)
        ? searchSet
        : loadActiveWordSetId(),
    [searchSet],
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showWordSetPicker, setShowWordSetPicker] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right">("left");

  const activeSetIdRef = useRef(activeSetId);
  activeSetIdRef.current = activeSetId;

  const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });
  const incorrectSound = new Howl({ src: ["/sounds/incorrect.mp3"] });

  // Canonicalize the URL so it always points at the active set and stays
  // shareable (covers bare links and invalid set params).
  useEffect(() => {
    if (searchSet !== activeSetId) {
      navigate({
        to: ".",
        search: { set: activeSetId },
        replace: true,
        viewTransition: false,
      });
    }
  }, [searchSet, activeSetId, navigate]);

  useEffect(() => {
    persistActiveWordSetId(activeSetId);
    setQuestions(loadQuestionsForSet(activeSetId));
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResults(false);
    setShowResetConfirm(false);
    setQuestionKey((prev) => prev + 1);
  }, [activeSetId]);

  const handleQuestionAdvance = (
    updatedQuestions: Question[],
    setId: string,
  ) => {
    persistQuestions(setId, updatedQuestions);
    // The user swapped word sets while the answer animation was still
    // playing; the old set's progress is saved, but leave the UI alone.
    if (setId !== activeSetIdRef.current) return;

    if (updatedQuestions.length === 0) {
      setQuestions([]);
      setShowResults(true);
    } else {
      setQuestions(updatedQuestions);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setQuestionKey((prev) => prev + 1);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || questions.length === 0) return;

    const setId = activeSetId;
    const currentQuestion = questions[0];
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const isCorrect = answer === currentQuestion.correct;

    if (isCorrect) {
      setExitDirection("left");
      correctSound.play();
      const nextQuestions = questions.slice(1);
      setTimeout(() => {
        handleQuestionAdvance(nextQuestions, setId);
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
        handleQuestionAdvance(nextQuestions, setId);
      }, 1500);
    }
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  const resetQuiz = () => {
    persistQuestions(activeSetId, []);
    setQuestions(createNewQuestionQueue(activeSetId));
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResults(false);
    setShowResetConfirm(false);
    setQuestionKey((prev) => prev + 1);
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleWordSetSelect = (setId: string) => {
    setShowWordSetPicker(false);
    if (setId === activeSetId) return;

    navigate({
      to: ".",
      search: { set: setId },
      replace: true,
      viewTransition: false,
    });
  };

  if (questions.length === 0 && !showResults) return <div>Loading...</div>;

  if (showResults) {
    return <ResultScreen onTryAgain={resetQuiz} />;
  }

  const currentQuestion = questions[0];
  const totalQuestions = getTotalQuestions(activeSetId);
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
            <div className="quiz-header-actions">
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
              <motion.button
                onClick={() => setShowWordSetPicker(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="reset-button"
                aria-label="Choose word set"
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </motion.button>
            </div>
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
      <WordSetPicker
        show={showWordSetPicker}
        activeSetId={activeSetId}
        onSelect={handleWordSetSelect}
        onClose={() => setShowWordSetPicker(false)}
      />
    </div>
  );
};

export default VocabularyQuiz;
