import { Platform } from 'react-native';

const iosShadow = {
  shadowColor: '#9E5A65',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
};

export const shadows = {
  card: Platform.select({
    ios: iosShadow,
    android: { elevation: 3 },
    default: {
      ...iosShadow,
    },
  }),
} as const;