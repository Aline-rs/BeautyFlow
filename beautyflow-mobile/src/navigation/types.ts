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
  AppointmentForm: undefined;
};

export type MessagesStackParamList = {
  MessagesMain: undefined;
  MessageDetail: undefined;
};

export type MoreStackParamList = {
  MoreMain: undefined;
  SalonProfile: undefined;
  Services: undefined;
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
  Main: NavigatorScreenParams<MainTabParamList>;
};
