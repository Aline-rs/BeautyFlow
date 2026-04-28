import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

export function SplashView() {
  return (
    <LinearGradient colors={['#FFF5F3', '#FDF0EC', '#F7E8E4']} style={styles.container}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <View style={styles.center}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>*</Text>
        </View>
        <Text style={styles.brand}>BeautyFlow</Text>
        <Text style={styles.subtitle}>Cuide das suas clientes{'\n'}no momento certo.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderWidth: 2,
    borderColor: colors.rose,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  logoEmoji: {
    fontSize: 34,
  },
  brand: {
    fontFamily: typography.fontFamily.title,
    color: colors.roseDark,
    fontSize: 30,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    fontFamily: typography.fontFamily.body,
  },
  blobTop: {
    position: 'absolute',
    top: -52,
    right: -54,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(199,125,138,.12)',
  },
  blobBottom: {
    position: 'absolute',
    bottom: 92,
    left: -58,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(214,168,90,.14)',
  },
});
