export type MessageTemplateSettings = {
  templateText: string;
};

export type NotificationSettings = {
  isEnabled: boolean;
  preferredTime: string;
  reminderMode: string;
};

export type SalonProfile = {
  salonName: string;
  ownerName: string;
  email: string;
  phone?: string;
  profilePhotoUrl?: string;
};
