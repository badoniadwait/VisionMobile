export type QuizSummary = {
  id: number;
  durationMinutes: number;
  expiresAt: string;
  questionCount: number;
};

export type StudentProfile = {
  sapId: string;
  name: string;
  adminId: string;
  profileImageUrl: string;
};

export type QuestionPrompt = {
  id: number;
  question: string;
  options: string[];
};

export type QuizDetails = QuizSummary & {
  questions: QuestionPrompt[];
};

export type ExamResult = {
  attemptId: number;
  score: number;
  total: number;
  percentage: number;
};

export type AttemptResult = ExamResult & {
  quizId: number;
  submittedAt: string;
};
