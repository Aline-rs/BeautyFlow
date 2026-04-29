import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  fetchMessageTemplate,
  fetchNotificationSettings,
  fetchSalonProfile,
  restoreDefaultMessageTemplate,
  uploadSalonProfilePhoto,
  updateMessageTemplate,
  updateNotificationSettings,
  updateSalonProfile,
} from './settingsService';
import { MessageTemplateSettings, NotificationSettings, SalonProfile } from './types';

type SettingsContextValue = {
  messageTemplate: MessageTemplateSettings | null;
  notificationSettings: NotificationSettings | null;
  salonProfile: SalonProfile | null;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  saveMessageTemplate: (payload: MessageTemplateSettings) => Promise<MessageTemplateSettings>;
  resetMessageTemplate: () => Promise<MessageTemplateSettings>;
  saveNotificationSettings: (payload: NotificationSettings) => Promise<NotificationSettings>;
  saveSalonProfile: (payload: SalonProfile) => Promise<SalonProfile>;
  saveSalonProfilePhoto: (photoUri: string) => Promise<SalonProfile>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [messageTemplate, setMessageTemplate] = useState<MessageTemplateSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [salonProfile, setSalonProfile] = useState<SalonProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const [nextTemplate, nextNotifications, nextSalonProfile] = await Promise.all([
        fetchMessageTemplate(),
        fetchNotificationSettings(),
        fetchSalonProfile(),
      ]);

      setMessageTemplate(nextTemplate);
      setNotificationSettings(nextNotifications);
      setSalonProfile(nextSalonProfile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMessageTemplate = useCallback(async (payload: MessageTemplateSettings) => {
    const nextTemplate = await updateMessageTemplate(payload);
    setMessageTemplate(nextTemplate);
    return nextTemplate;
  }, []);

  const resetMessageTemplate = useCallback(async () => {
    const nextTemplate = restoreDefaultMessageTemplate();
    setMessageTemplate(nextTemplate);
    return nextTemplate;
  }, []);

  const saveNotificationSettings = useCallback(async (payload: NotificationSettings) => {
    const nextSettings = await updateNotificationSettings(payload);
    setNotificationSettings(nextSettings);
    return nextSettings;
  }, []);

  const saveSalonProfile = useCallback(async (payload: SalonProfile) => {
    const nextProfile = await updateSalonProfile(payload);
    setSalonProfile(nextProfile);
    return nextProfile;
  }, []);

  const saveSalonProfilePhoto = useCallback(async (photoUri: string) => {
    const nextProfile = await uploadSalonProfilePhoto(photoUri);
    setSalonProfile(nextProfile);
    return nextProfile;
  }, []);

  const value = useMemo(
    () => ({
      messageTemplate,
      notificationSettings,
      salonProfile,
      isLoading,
      loadSettings,
      saveMessageTemplate,
      resetMessageTemplate,
      saveNotificationSettings,
      saveSalonProfile,
      saveSalonProfilePhoto,
    }),
    [
      isLoading,
      loadSettings,
      messageTemplate,
      notificationSettings,
      resetMessageTemplate,
      salonProfile,
      saveMessageTemplate,
      saveNotificationSettings,
      saveSalonProfile,
      saveSalonProfilePhoto,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider.');
  }

  return context;
}
