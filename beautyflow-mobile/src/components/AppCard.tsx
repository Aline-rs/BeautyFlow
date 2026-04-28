import { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../theme';

type AppCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function AppCard({ children, style }: AppCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: 13,
        },
        shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}
