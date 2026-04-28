import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  style,
  icon,
  disabled = false,
  loading = false,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <Pressable
        disabled={isDisabled}
        onPress={onPress}
        style={[styles.buttonBase, style, isDisabled ? styles.disabled : null]}
      >
        <LinearGradient
          colors={[colors.rose, '#D26377']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primaryBg, shadows.card]}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : icon}
          <Text style={styles.primaryText}>{loading ? 'Carregando...' : label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.buttonBase, styles[variant], style, isDisabled ? styles.disabled : null]}
    >
      <View style={styles.contentRow}>
        {loading ? <ActivityIndicator color={colors.roseDark} size="small" /> : icon}
        <Text style={[styles.secondaryText, variant === 'ghost' && styles.ghostText]}>
          {loading ? 'Carregando...' : label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: radius.md,
    marginBottom: spacing.xs + 1,
  },
  primaryBg: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  contentRow: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  primary: {
    borderWidth: 1.5,
    borderColor: colors.rose,
    backgroundColor: 'transparent',
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: colors.rose,
    backgroundColor: 'transparent',
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  primaryText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  secondaryText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 14,
    color: colors.rose,
  },
  ghostText: {
    fontFamily: typography.fontFamily.bodyMedium,
    color: colors.textSecondary,
  },
});
