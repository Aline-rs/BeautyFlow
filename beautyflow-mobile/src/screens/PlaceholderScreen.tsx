import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { colors, typography } from '../theme';

type PlaceholderScreenProps = {
  title: string;
  subtitle: string;
};

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: 24,
    color: colors.roseDark,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: typography.fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
