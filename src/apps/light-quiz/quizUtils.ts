import finnishData from "./wordSets/finnish-1000.json";
import catalanData from "./wordSets/catalan-1000.json";
import type { Question } from "./types";

export interface WordSet {
  id: string;
  label: string;
  data: Omit<Question, "id">[];
}

export const wordSets: WordSet[] = [
  { id: "finnish-1000", label: "Finnish vocabulary", data: finnishData },
  { id: "catalan-1000", label: "Vocabulari Anglès", data: catalanData },
];

const ACTIVE_SET_KEY = "quizActiveWordSet";
const LEGACY_PROGRESS_KEY = "quizProgress";

const progressKey = (setId: string) => `quizProgress:${setId}`;

export const isValidWordSetId = (setId: string): boolean =>
  wordSets.some((set) => set.id === setId);

export const getWordSet = (setId: string): WordSet =>
  wordSets.find((set) => set.id === setId) ?? wordSets[0];

export const getTotalQuestions = (setId: string): number =>
  getWordSet(setId).data.length;

export const loadActiveWordSetId = (): string => {
  // Pre-word-set progress lived under a single un-namespaced key.
  localStorage.removeItem(LEGACY_PROGRESS_KEY);

  const stored = localStorage.getItem(ACTIVE_SET_KEY);
  return stored && isValidWordSetId(stored) ? stored : wordSets[0].id;
};

export const persistActiveWordSetId = (setId: string) => {
  localStorage.setItem(ACTIVE_SET_KEY, setId);
};

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

export const createNewQuestionQueue = (setId: string): Question[] => {
  const withIds = getWordSet(setId).data.map((question, index) => ({
    ...question,
    id: `${question.word}-${index}-${Math.random().toString(36).slice(2, 6)}`,
  }));

  return randomizeQuestions(withIds);
};

export const loadQuestionsForSet = (setId: string): Question[] => {
  const stored = localStorage.getItem(progressKey(setId));
  if (stored) {
    try {
      const normalized = addIdsToStoredQuestions(JSON.parse(stored));
      if (normalized.length > 0) return normalized;
    } catch {
      // Corrupt progress falls through to a fresh queue.
    }
  }
  return createNewQuestionQueue(setId);
};

export const persistQuestions = (
  setId: string,
  updatedQuestions: Question[],
) => {
  if (updatedQuestions.length === 0) {
    localStorage.removeItem(progressKey(setId));
    return;
  }

  localStorage.setItem(progressKey(setId), JSON.stringify(updatedQuestions));
};
