import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { ProfessionalProfile } from './types';

const defaultProfile: ProfessionalProfile = {
  name: 'BeautyFlow',
  email: 'sessao@beautyflow.app',
  profilePhotoUrl: undefined,
};

let mockProfile = defaultProfile;

function shouldFallback(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;

  return !status || status === 404 || status >= 500;
}

export async function fetchProfessionalProfile(): Promise<ProfessionalProfile> {
  try {
    const response = await api.get<ProfessionalProfile>('/profile');
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockProfile;
  }
}

export async function updateProfessionalProfile(
  payload: ProfessionalProfile,
): Promise<ProfessionalProfile> {
  try {
    const response = await api.put<ProfessionalProfile>('/profile', payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    mockProfile = payload;
    return mockProfile;
  }
}

export async function uploadProfessionalProfilePhoto(photoUri: string): Promise<ProfessionalProfile> {
  const formData = new FormData();
  formData.append('photo', {
    uri: photoUri,
    name: `perfil-${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as never);

  try {
    const response = await api.post<ProfessionalProfile>('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    mockProfile = {
      ...mockProfile,
      profilePhotoUrl: photoUri,
    };

    return mockProfile;
  }
}
