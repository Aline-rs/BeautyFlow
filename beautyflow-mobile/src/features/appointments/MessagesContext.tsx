import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  MessageFilter,
  cancelMessage,
  fetchMessageById,
  fetchMessages,
  fetchWhatsappLink,
  markMessageAsSent,
  updateMessageText,
} from './messagesService';
import { ScheduledMessage } from './types';

type MessagesContextValue = {
  messages: ScheduledMessage[];
  isLoading: boolean;
  loadMessages: (filter?: MessageFilter, search?: string) => Promise<void>;
  getMessageById: (messageId: string) => Promise<ScheduledMessage | null>;
  saveMessageText: (messageId: string, messageText: string) => Promise<ScheduledMessage>;
  markAsSent: (messageId: string) => Promise<ScheduledMessage>;
  cancelScheduledMessage: (messageId: string) => Promise<ScheduledMessage>;
  getWhatsappLink: (messageId: string) => Promise<string>;
};

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMessages = useCallback(async (filter?: MessageFilter, search?: string) => {
    setIsLoading(true);
    try {
      const nextMessages = await fetchMessages(filter, search);
      setMessages(nextMessages);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMessageById = useCallback(async (messageId: string) => {
    const existingMessage = messages.find((message) => message.id === messageId);
    if (existingMessage) {
      return existingMessage;
    }

    return fetchMessageById(messageId);
  }, [messages]);

  const saveMessageText = useCallback(async (messageId: string, messageText: string) => {
    const nextMessage = await updateMessageText(messageId, messageText);
    setMessages((currentMessages) =>
      currentMessages.map((message) => (message.id === messageId ? nextMessage : message)),
    );
    return nextMessage;
  }, []);

  const markAsSent = useCallback(async (messageId: string) => {
    const nextMessage = await markMessageAsSent(messageId);
    setMessages((currentMessages) =>
      currentMessages.map((message) => (message.id === messageId ? nextMessage : message)),
    );
    return nextMessage;
  }, []);

  const cancelScheduledMessage = useCallback(async (messageId: string) => {
    const nextMessage = await cancelMessage(messageId);
    setMessages((currentMessages) =>
      currentMessages.map((message) => (message.id === messageId ? nextMessage : message)),
    );
    return nextMessage;
  }, []);

  const getWhatsappLink = useCallback(async (messageId: string) => {
    return fetchWhatsappLink(messageId);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      isLoading,
      loadMessages,
      getMessageById,
      saveMessageText,
      markAsSent,
      cancelScheduledMessage,
      getWhatsappLink,
    }),
    [
      cancelScheduledMessage,
      getMessageById,
      getWhatsappLink,
      isLoading,
      loadMessages,
      markAsSent,
      messages,
      saveMessageText,
    ],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error('useMessages must be used within MessagesProvider.');
  }

  return context;
}
