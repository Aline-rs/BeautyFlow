import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { colors, typography } from '../theme';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View
      style={{
        minHeight: 230,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      {icon}
      <Text
        style={{
          marginTop: 8,
          fontFamily: typography.fontFamily.title,
          fontSize: 20,
          color: colors.roseDark,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontFamily: typography.fontFamily.body,
          fontSize: 12,
          lineHeight: 18,
          color: colors.textSecondary,
          textAlign: 'center',
        }}
      >
        {description}
      </Text>
    </View>
  );
}
