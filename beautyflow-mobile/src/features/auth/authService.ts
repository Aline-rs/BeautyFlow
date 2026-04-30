import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { AuthSession, LinkedSalon, LoginPayload, RegisterPayload } from './types';

type AuthApiResponse = {
  succeeded?: boolean;
  data?: AuthSession;
  token?: string;
  user?: AuthSession['user'];
  salons?: AuthSession['salons'];
  selectedSalonId?: AuthSession['selectedSalonId'];
};

function createMockSession(
  name: string,
  email: string,
  salonName: string,
): AuthSession {
  const defaultSalon: LinkedSalon = {
    id: 'mock-salon-id',
    name: salonName,
    phone: null,
    email,
    role: 'Owner',
    isPrimary: true,
  };

  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: 'mock-user-id',
      name,
      email,
      profilePhotoUrl: null,
    },
    salons: [defaultSalon],
    selectedSalonId: defaultSalon.id,
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
      salons: response.salons ?? [],
      selectedSalonId: response.selectedSalonId ?? response.salons?.find((salon) => salon.isPrimary)?.id ?? null,
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
