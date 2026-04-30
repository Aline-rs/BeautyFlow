import { LinkedSalon } from '../salons/types';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  ownerName: string;
  email: string;
  password: string;
};

export type AuthSession = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePhotoUrl?: string | null;
  };
  salons: LinkedSalon[];
  selectedSalonId?: string | null;
};
