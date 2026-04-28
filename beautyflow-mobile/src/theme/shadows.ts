import { Platform, ViewStyle } from 'react-native';

const iosShadow: ViewStyle = {
  shadowColor: '#9E5A65',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
};

export const shadows = {
  card: Platform.select<ViewStyle>({
    ios: iosShadow,
    android: { elevation: 3 },
    default: iosShadow,
  }) ?? iosShadow,
} as const;
