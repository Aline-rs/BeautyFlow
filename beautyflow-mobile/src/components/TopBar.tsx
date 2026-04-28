import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

type TopBarProps = {
  title: string;
  onBack?: () => void;
};

export function TopBar({ title, onBack }: TopBarProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable style={styles.iconButton} onPress={onBack}>
          <Text style={styles.iconText}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: 17,
    color: colors.roseDark,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.roseLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.roseDark,
    fontSize: 13,
    fontFamily: typography.fontFamily.bodyBold,
  },
  placeholder: {
    width: 30,
    height: 30,
  },
});
