
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_token';

const PROFILE_KEYS = [
  AUTH_TOKEN_KEY,
  'profile_img_url',
  'sapId',
  'name',
  'admin_id',
] as const;

export async function isAuthenticated(): Promise<boolean> {
  try {
    return Boolean(await SecureStore.getItemAsync(AUTH_TOKEN_KEY));
  } catch (error) {
    console.warn('Unable to read saved login:', error);
    return false;
  }
}

export async function saveLogin(
  token: string,
  student: {
    SapId: string;
    name: string;
    adminId: string;
  },
  imageUrl: string
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(AUTH_TOKEN_KEY, token),
    SecureStore.setItemAsync('profile_img_url', imageUrl ?? ''),
    SecureStore.setItemAsync('sapId', student.SapId),
    SecureStore.setItemAsync('name', student.name),
    SecureStore.setItemAsync('admin_id', student.adminId),
  ]);
}

export async function logout(): Promise<void> {
  await Promise.all(
    PROFILE_KEYS.map(key => SecureStore.deleteItemAsync(key))
  );
}
