import { Pressable, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';

type AppSelectProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
};

export function AppSelect({
  label,
  value,
  placeholder = 'Selecionar',
  onPress,
}: AppSelectProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.bodyMedium,
          fontSize: 11,
          color: colors.textSecondary,
          marginBottom: 5,
        }}
      >
        {label}
      </Text>
      <Pressable
        style={{
          minHeight: 48,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderRadius: radius.sm,
          paddingHorizontal: 13,
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: value ? colors.textMain : '#A7918D',
            fontFamily: typography.fontFamily.body,
            fontSize: 13,
          }}
        >
          {value ?? placeholder}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: typography.fontFamily.bodyBold,
            fontSize: 12,
          }}
        >
          v
        </Text>
      </Pressable>
    </View>
  );
}
