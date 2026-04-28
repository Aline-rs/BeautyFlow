import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  Pressable,
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
  style?: ViewStyle;
  icon?: ReactNode;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  style,
  icon,
}: AppButtonProps) {
  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} style={[styles.buttonBase, style]}>
        <LinearGradient
          colors={[colors.rose, '#D26377']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primaryBg, shadows.card]}
        >
          {icon}
          <Text style={styles.primaryText}>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.buttonBase, styles[variant], style]}
    >
      <View style={styles.contentRow}>
        {icon}
        <Text style={[styles.secondaryText, variant === 'ghost' && styles.ghostText]}>
          {label}
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
