export type CreateSalonPayload = {
  name: string;
  phone?: string;
  email: string;
  makePrimary?: boolean;
};

export type LinkedSalon = {
  id: string;
  name: string;
  phone?: string | null;
  email: string;
  role: string;
  isPrimary: boolean;
};
