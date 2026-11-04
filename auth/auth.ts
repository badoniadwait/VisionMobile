
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'auth_role';

const PROFILE_KEYS = [
  AUTH_TOKEN_KEY,
  ROLE_KEY,
  'profile_img_url',
  'sapId',
  'name',
  'admin_id',
  'admin_name',
  'admin_email',
  'admin_subject',
  'admin_verified',
] as const;

export async function isAuthenticated(): Promise<boolean> {
  try {
    return Boolean(await SecureStore.getItemAsync(AUTH_TOKEN_KEY));
  } catch (error) {
    console.warn('Unable to read saved login:', error);
    return false;
  }
}

export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function getAuthRole(): Promise<'STUDENT' | 'ADMIN' | null> {
  const role = await SecureStore.getItemAsync(ROLE_KEY);
  return role === 'STUDENT' || role === 'ADMIN' ? role : null;
}

export async function getStoredStudent() {
  const [sapId, name, profileImageUrl] = await Promise.all([
    SecureStore.getItemAsync('sapId'),
    SecureStore.getItemAsync('name'),
    SecureStore.getItemAsync('profile_img_url'),
  ]);
  return { sapId, name, profileImageUrl };
}

export async function getStoredStudent() {
  const [sapId, name, profileImageUrl] = await Promise.all([
    SecureStore.getItemAsync('sapId'),
    SecureStore.getItemAsync('name'),
    SecureStore.getItemAsync('profile_img_url'),
  ]);
  return { sapId, name, profileImageUrl };
}

export async function saveLogin(
  token: string,
  student: {
    sapId: string;
    name: string;
    adminId: string;
  },
  imageUrl: string
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(AUTH_TOKEN_KEY, token),
    SecureStore.setItemAsync(ROLE_KEY, 'STUDENT'),
    SecureStore.setItemAsync('profile_img_url', imageUrl ?? ''),
    SecureStore.setItemAsync('sapId', student.sapId),
    SecureStore.setItemAsync('name', student.name),
    SecureStore.setItemAsync('admin_id', student.adminId),
  ]);
}

export async function saveAdminLogin(
  token: string,
  admin: { id: string; name: string; email: string; subject: string; verified: boolean },
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(AUTH_TOKEN_KEY, token),
    SecureStore.setItemAsync(ROLE_KEY, 'ADMIN'),
    SecureStore.setItemAsync('admin_id', admin.id),
    SecureStore.setItemAsync('admin_name', admin.name),
    SecureStore.setItemAsync('admin_email', admin.email),
    SecureStore.setItemAsync('admin_subject', admin.subject),
    SecureStore.setItemAsync('admin_verified', String(admin.verified)),
  ]);
}

export async function logout(): Promise<void> {
  await Promise.all(
    PROFILE_KEYS.map(key => SecureStore.deleteItemAsync(key))
  );
}
