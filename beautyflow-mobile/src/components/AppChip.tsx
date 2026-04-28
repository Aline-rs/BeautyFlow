import { Text, View } from 'react-native';
import { colors, typography } from '../theme';

type AppChipVariant = 'pending' | 'sent' | 'error' | 'inactive';

type AppChipProps = {
  label: string;
  variant?: AppChipVariant;
};

const chipStyles = {
  pending: { backgroundColor: colors.goldLight, color: '#8A6020' },
  sent: { backgroundColor: '#E5F5EC', color: '#2E7A52' },
  error: { backgroundColor: '#FBEAEA', color: '#963D3D' },
  inactive: { backgroundColor: '#EEE7E5', color: colors.textSecondary },
} as const;

export function AppChip({ label, variant = 'pending' }: AppChipProps) {
  const selected = chipStyles[variant];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: selected.backgroundColor,
      }}
    >
      <Text
        style={{
          color: selected.color,
          fontFamily: typography.fontFamily.bodyBold,
          fontSize: 10,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
