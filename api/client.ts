import * as SecureStore from 'expo-secure-store';



export const API_URL ='http://10.28.78.53:8080';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = RequestInit & {
  authenticated?: boolean;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { authenticated = false, headers, body, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (body && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...requestOptions,
      body,
      headers: requestHeaders,
    });
  } catch {
    throw new ApiError('Unable to reach the backend. Check the API URL and network connection.', 0, null);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const responseBody = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof responseBody === 'object'
      && responseBody !== null
      && 'message' in responseBody
      && typeof responseBody.message === 'string'
      ? responseBody.message
      : `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as T;
}
