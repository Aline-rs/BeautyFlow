import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { colors, typography } from '../theme';

export function HomePlaceholderScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Placeholder inicial após autenticação.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.offWhite,
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
    color: colors.textSecondary,
  },
});
