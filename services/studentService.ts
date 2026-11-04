import { apiFetch } from '@/api/client';
import { AttemptResult, ExamResult, QuizDetails, QuizSummary, StudentProfile } from '@/types/quiz';

export function fetchStudentProfile() {
  return apiFetch<StudentProfile>('/api/student/profile', { authenticated: true });
}

export function fetchAvailableQuizzes() {
  return apiFetch<QuizSummary[]>('/api/student/quizzes', { authenticated: true });
}

export function fetchQuiz(id: string) {
  return apiFetch<QuizDetails>(`/api/student/quizzes/${id}`, { authenticated: true });
}

export function submitQuiz(id: string, answers: Record<number, number>) {
  return apiFetch<ExamResult>(`/api/student/quizzes/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
    authenticated: true,
  });
}

export function fetchExamHistory() {
  return apiFetch<AttemptResult[]>('/api/student/history', { authenticated: true });
}
