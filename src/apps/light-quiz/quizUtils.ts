import vocabData from "./wordSets/1000words.json";
import type { Question } from "./types";

const STORAGE_KEY = "quizProgress";

export const shuffleArray = (array: string[]): string[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const randomizeQuestions = (questions: Question[]): Question[] => {
  return questions
    .map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))
    .sort(() => Math.random() - 0.5);
};

export const addIdsToStoredQuestions = (
  storedQuestions: Array<Partial<Question>>,
): Question[] => {
  return storedQuestions.map((question, index) => ({
    id:
      question.id ||
      `${question.word ?? "question"}-${index}-${Math.random()
        .toString(36)
        .slice(2, 6)}`,
    word: question.word ?? "",
    correct: question.correct ?? "",
    options: question.options ?? [],
  }));
};

export const createNewQuestionQueue = (): Question[] => {
  const withIds = vocabData.map((question, index) => ({
    ...question,
    id: `${question.word}-${index}-${Math.random().toString(36).slice(2, 6)}`,
  }));

  return randomizeQuestions(withIds);
};

export const totalQuestions = vocabData.length;

export const persistQuestions = (updatedQuestions: Question[]) => {
  if (updatedQuestions.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuestions));
};
