import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { mockMessages, replaceMockMessage } from './mockStore';
import { ScheduledMessage } from './types';

export type MessageFilter = 'Hoje' | 'Pendentes' | 'Enviadas' | 'Erro';

function shouldFallback(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;

  return !status || status === 404 || status >= 500;
}

function apiStatusForFilter(filter?: MessageFilter) {
  switch (filter) {
    case 'Pendentes':
      return 'Pending';
    case 'Enviadas':
      return 'Sent';
    case 'Erro':
      return 'Error';
    default:
      return undefined;
  }
}

function filterMockMessages(messages: ScheduledMessage[], filter?: MessageFilter, search?: string) {
  const todayIso = new Date().toISOString().slice(0, 10);

  let nextMessages = messages;
  if (filter === 'Hoje') {
    nextMessages = nextMessages.filter((message) => message.scheduledForDate === todayIso);
  }

  if (filter === 'Pendentes') {
    nextMessages = nextMessages.filter((message) => message.status === 'Pendente');
  }

  if (filter === 'Enviadas') {
    nextMessages = nextMessages.filter((message) => message.status === 'Enviada');
  }

  if (filter === 'Erro') {
    nextMessages = nextMessages.filter((message) => message.status === 'Erro');
  }

  const normalizedSearch = search?.trim().toLowerCase();
  if (normalizedSearch) {
    nextMessages = nextMessages.filter(
      (message) =>
        message.customerName.toLowerCase().includes(normalizedSearch) ||
        message.serviceName.toLowerCase().includes(normalizedSearch),
    );
  }

  return nextMessages;
}

export async function fetchMessages(filter?: MessageFilter, search?: string): Promise<ScheduledMessage[]> {
  try {
    const response = await api.get<ScheduledMessage[]>('/messages', {
      params: {
        status: apiStatusForFilter(filter),
        search: search || undefined,
      },
    });
    const nextMessages = response.data;

    if (filter === 'Hoje') {
      const todayIso = new Date().toISOString().slice(0, 10);
      return nextMessages.filter((message) => message.scheduledForDate === todayIso);
    }

    return nextMessages;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return filterMockMessages(mockMessages, filter, search);
  }
}

export async function fetchMessageById(messageId: string): Promise<ScheduledMessage | null> {
  try {
    const response = await api.get<ScheduledMessage>(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockMessages.find((message) => message.id === messageId) ?? null;
  }
}

export async function updateMessageText(messageId: string, messageText: string): Promise<ScheduledMessage> {
  try {
    const response = await api.put<ScheduledMessage>(`/messages/${messageId}`, { messageText });
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockMessages.find((message) => message.id === messageId);
    if (!current) {
      throw new Error('Mensagem nao encontrada.');
    }

    const nextMessage = { ...current, messageText };
    replaceMockMessage(messageId, nextMessage);
    return nextMessage;
  }
}

export async function markMessageAsSent(messageId: string): Promise<ScheduledMessage> {
  try {
    const response = await api.patch<ScheduledMessage>(`/messages/${messageId}/mark-as-sent`);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockMessages.find((message) => message.id === messageId);
    if (!current) {
      throw new Error('Mensagem nao encontrada.');
    }

    const nextMessage = {
      ...current,
      status: 'Enviada' as const,
      sentAtUtc: new Date().toISOString(),
    };
    replaceMockMessage(messageId, nextMessage);
    return nextMessage;
  }
}

export async function cancelMessage(messageId: string): Promise<ScheduledMessage> {
  try {
    const response = await api.patch<ScheduledMessage>(`/messages/${messageId}/cancel`);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockMessages.find((message) => message.id === messageId);
    if (!current) {
      throw new Error('Mensagem nao encontrada.');
    }

    const nextMessage = {
      ...current,
      status: 'Cancelada' as const,
    };
    replaceMockMessage(messageId, nextMessage);
    return nextMessage;
  }
}

export async function fetchWhatsappLink(messageId: string): Promise<string> {
  try {
    const response = await api.get<{ url: string }>(`/messages/${messageId}/whatsapp-link`);
    return response.data.url;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockMessages.find((message) => message.id === messageId);
    if (!current) {
      throw new Error('Mensagem nao encontrada.');
    }

    const digits = current.customerWhatsapp.replace(/\D/g, '');
    return `https://wa.me/55${digits}?text=${encodeURIComponent(current.messageText)}`;
  }
}
