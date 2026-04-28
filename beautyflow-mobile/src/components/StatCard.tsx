import { ReactNode } from 'react';
import { Text } from 'react-native';
import { AppCard } from './AppCard';
import { colors, typography } from '../theme';

type StatCardProps = {
  icon?: ReactNode;
  value: string;
  label: string;
};

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <AppCard style={{ flex: 1 }}>
      {icon}
      <Text
        style={{
          marginTop: 6,
          fontFamily: typography.fontFamily.title,
          fontSize: 22,
          color: colors.roseDark,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontFamily: typography.fontFamily.body,
          fontSize: 10,
          lineHeight: 14,
          color: colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </AppCard>
  );
}
