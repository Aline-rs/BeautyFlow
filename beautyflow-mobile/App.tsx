import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    PlayfairDisplay_600SemiBold,
  });

  const titleFontFamily = fontsLoaded ? typography.fontFamily.title : undefined;
  const bodyFontFamily = fontsLoaded ? typography.fontFamily.body : undefined;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: titleFontFamily }]}>
        BeautyFlow
      </Text>
      <Text style={[styles.subtitle, { fontFamily: bodyFontFamily }]}>
        Base Expo + TypeScript pronta para o MVP.
      </Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.size.xxl,
    lineHeight: typography.lineHeight.xxl,
    color: colors.textMain,
  },
  subtitle: {
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
