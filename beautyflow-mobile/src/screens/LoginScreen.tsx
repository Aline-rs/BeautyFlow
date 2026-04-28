import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Screen } from '../components/Screen';
import { RootStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.flower}>🌸</Text>
          <Text style={styles.title}>Bem-vinda de volta</Text>
          <Text style={styles.subtitle}>Entre na sua conta do salão</Text>
        </View>

        <AppInput label="E-mail" placeholder="seu@email.com" keyboardType="email-address" />
        <AppInput label="Senha" placeholder="••••••••" secureTextEntry />

        <Text style={styles.forgot}>Esqueci minha senha</Text>

        <AppButton label="Entrar" onPress={() => navigation.replace('Home')} />
        <Text style={styles.footerText}>
          Não tem conta?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('SignUp')}>
            Criar conta
          </Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 22,
    backgroundColor: colors.offWhite,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  flower: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: 23,
    color: colors.roseDark,
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 19,
  },
  forgot: {
    textAlign: 'right',
    marginBottom: 18,
    color: colors.rose,
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 4,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
  },
  footerLink: {
    color: colors.rose,
  },
});
