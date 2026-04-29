export type Service = {
  id: string;
  name: string;
  suggestedReturnDays: number;
  isActive: boolean;
};

export type ServiceFormPayload = {
  name: string;
  suggestedReturnDays: number;
  isActive: boolean;
};
