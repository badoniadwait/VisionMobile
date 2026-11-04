export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  subject: string;
  verified: boolean;
  studentCount: number;
};

export type AdminQuiz = {
  id: number;
  durationMinutes: number;
  createdAt: string;
  expiresAt: string;
  questionCount: number;
};

export type AdminDashboard = {
  quizCount: number;
  studentCount: number;
  quizzes: AdminQuiz[];
};

export type AdminQuizDetail = AdminQuiz & {
  questions: { question: string; options: string[]; answer: number }[];
};
