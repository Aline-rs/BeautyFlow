import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { CreateSalonPayload, LinkedSalon } from './types';

function shouldFallback(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;

  return !status || status === 404 || status >= 500;
}

export async function createSalon(payload: CreateSalonPayload): Promise<LinkedSalon> {
  try {
    const response = await api.post<LinkedSalon>('/salons', payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return {
      id: `mock-salon-${Date.now()}`,
      name: payload.name,
      phone: payload.phone ?? null,
      email: payload.email,
      role: 'Owner',
      isPrimary: payload.makePrimary ?? true,
    };
  }
}
