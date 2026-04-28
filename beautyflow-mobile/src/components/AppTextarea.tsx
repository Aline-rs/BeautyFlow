import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, typography } from '../theme';

type AppTextareaProps = TextInputProps & {
  label: string;
};

export function AppTextarea({ label, ...props }: AppTextareaProps) {
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
      <TextInput
        multiline
        textAlignVertical="top"
        placeholderTextColor="#A7918D"
        style={{
          minHeight: 82,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderRadius: radius.sm,
          paddingVertical: 12,
          paddingHorizontal: 13,
          backgroundColor: '#FFFFFF',
          color: colors.textMain,
          fontFamily: typography.fontFamily.body,
          fontSize: 13,
        }}
        {...props}
      />
    </View>
  );
}
