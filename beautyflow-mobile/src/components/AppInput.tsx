import { TextInput, TextInputProps, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';

type AppInputProps = TextInputProps & {
  label: string;
};

export function AppInput({ label, ...props }: AppInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#A7918D"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 12,
  },
  label: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 13,
    backgroundColor: '#FFFFFF',
    color: colors.textMain,
    fontFamily: typography.fontFamily.body,
    fontSize: 13,
  },
});
