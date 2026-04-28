import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { AuthSession, LoginPayload, RegisterPayload } from './types';

type AuthApiResponse = {
  succeeded?: boolean;
  data?: AuthSession;
  token?: string;
  user?: AuthSession['user'];
};

function createMockSession(
  name: string,
  email: string,
  salonName: string,
): AuthSession {
  return {
    token: `mock-token-${Date.now()}`,
    user: {
      name,
      email,
      salonName,
    },
  };
}

function shouldFallbackToMock(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;

  return !status || status === 404 || status >= 500;
}

function normalizeAuthResponse(response: AuthApiResponse): AuthSession {
  if (response.data?.token) {
    return response.data;
  }

  if (response.token && response.user) {
    return {
      token: response.token,
      user: response.user,
    };
  }

  throw new Error('Resposta de autenticacao invalida.');
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  try {
    const response = await api.post<AuthApiResponse>('/auth/login', payload);
    return normalizeAuthResponse(response.data);
  } catch (error) {
    if (shouldFallbackToMock(error)) {
      return createMockSession('Studio Bella Hair', payload.email, 'Studio Bella Hair');
    }

    throw error;
  }
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  try {
    const response = await api.post<AuthApiResponse>('/auth/register', payload);
    return normalizeAuthResponse(response.data);
  } catch (error) {
    if (shouldFallbackToMock(error)) {
      return createMockSession(payload.ownerName, payload.email, payload.salonName);
    }

    throw error;
  }
}
