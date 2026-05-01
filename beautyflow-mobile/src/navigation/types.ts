import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
};

export type CustomersStackParamList = {
  CustomersMain: undefined;
  CustomerForm: {
    customerId?: string;
  };
  CustomerDetail: {
    customerId: string;
  };
};

export type AppointmentsStackParamList = {
  AppointmentsMain: undefined;
  AppointmentForm: {
    customerId?: string;
    appointmentId?: string;
    mode?: 'create' | 'edit';
  };
};

export type MessagesStackParamList = {
  MessagesMain: undefined;
  MessageDetail: {
    messageId: string;
  };
};

export type MoreStackParamList = {
  MoreMain: undefined;
  ProfessionalProfile: undefined;
  Salons: undefined;
  Services: undefined;
  ServiceForm: {
    serviceId?: string;
  };
  MessageTemplates: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CustomersTab: NavigatorScreenParams<CustomersStackParamList>;
  AppointmentsTab: NavigatorScreenParams<AppointmentsStackParamList>;
  MessagesTab: NavigatorScreenParams<MessagesStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  SalonSetup: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};
