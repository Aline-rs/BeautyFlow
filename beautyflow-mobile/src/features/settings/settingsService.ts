import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { MessageTemplateSettings, NotificationSettings, SalonProfile } from './types';

const defaultMessageTemplate: MessageTemplateSettings = {
  templateText:
    'Oi, {nome}! Tudo bem?\n\nJa faz {dias} dias desde o servico de {servico} aqui no {salao}.\n\nQue tal agendar um retorno?',
};

const defaultNotificationSettings: NotificationSettings = {
  isEnabled: true,
  preferredTime: '09:00',
  reminderMode: 'OnlyWhenDue',
};

const defaultSalonProfile: SalonProfile = {
  salonName: 'Studio Bella Hair',
  ownerName: 'Bella Martins',
  email: 'bellahairstudio@email.com',
  phone: '(31) 98888-0000',
};

let mockMessageTemplate = defaultMessageTemplate;
let mockNotificationSettings = defaultNotificationSettings;
let mockSalonProfile = defaultSalonProfile;

function shouldFallback(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;

  return !status || status === 404 || status >= 500;
}

export async function fetchMessageTemplate(): Promise<MessageTemplateSettings> {
  try {
    const response = await api.get<MessageTemplateSettings>('/settings/message-template');
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockMessageTemplate;
  }
}

export async function updateMessageTemplate(
  payload: MessageTemplateSettings,
): Promise<MessageTemplateSettings> {
  try {
    const response = await api.put<MessageTemplateSettings>('/settings/message-template', payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    mockMessageTemplate = payload;
    return mockMessageTemplate;
  }
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  try {
    const response = await api.get<NotificationSettings>('/settings/notifications');
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockNotificationSettings;
  }
}

export async function updateNotificationSettings(
  payload: NotificationSettings,
): Promise<NotificationSettings> {
  try {
    const response = await api.put<NotificationSettings>('/settings/notifications', payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    mockNotificationSettings = payload;
    return mockNotificationSettings;
  }
}

export async function fetchSalonProfile(): Promise<SalonProfile> {
  try {
    const response = await api.get<SalonProfile>('/salon/profile');
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockSalonProfile;
  }
}

export async function updateSalonProfile(payload: SalonProfile): Promise<SalonProfile> {
  try {
    const response = await api.put<SalonProfile>('/salon/profile', payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    mockSalonProfile = payload;
    return mockSalonProfile;
  }
}

export function restoreDefaultMessageTemplate() {
  mockMessageTemplate = defaultMessageTemplate;
  return mockMessageTemplate;
}
