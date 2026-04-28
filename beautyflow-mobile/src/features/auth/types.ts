export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  ownerName: string;
  salonName: string;
  salonPhone?: string;
  email: string;
  password: string;
};

export type AuthSession = {
  token: string;
  user: {
    name: string;
    email: string;
    salonName: string;
  };
};
