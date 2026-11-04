import { apiFetch } from '@/api/client';
import { AdminDashboard, AdminProfile, AdminQuizDetail } from '@/types/adminDashboard';

export function fetchAdminDashboard() {
  return apiFetch<AdminDashboard>('/api/admin/dashboard', { authenticated: true });
}

export function fetchAdminProfile() {
  return apiFetch<AdminProfile>('/api/admin/profile', { authenticated: true });
}

export function createQuiz(payload: unknown) {
  return apiFetch('/api/admin/quizzes', { method: 'POST', body: JSON.stringify(payload), authenticated: true });
}

export function deleteQuiz(id: number) {
  return apiFetch<void>(`/api/admin/quizzes/${id}`, { method: 'DELETE', authenticated: true });
}

export function fetchAdminQuiz(id: number) {
  return apiFetch<AdminQuizDetail>(`/api/admin/quizzes/${id}`, { authenticated: true });
}

export async function registerStudent(payload: { sapId: string; name: string; password: string; imageUri: string }) {
  const form = new FormData();
  form.append('sapId', payload.sapId);
  form.append('name', payload.name);
  form.append('password', payload.password);
  form.append('referencePhotoPath', { uri: payload.imageUri, name: 'reference.jpg', type: 'image/jpeg' } as unknown as Blob);
  return apiFetch<{ message: string }>('/api/admin/students', { method: 'POST', body: form, authenticated: true });
}

export function requestVerificationEmail() {
  return apiFetch<{ message: string }>('/api/admin/profile/verify-email', { method: 'POST', authenticated: true });
}
