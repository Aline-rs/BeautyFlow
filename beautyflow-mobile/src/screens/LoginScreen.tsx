import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { KeyboardScrollScreen } from '../components/KeyboardScrollScreen';
import { useAuth } from '../features/auth';
import { LoginFormValues, loginSchema } from '../features/auth/schemas';
import { AuthStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await signIn(values);
    } catch {
      setError('root', {
        message: 'Nao foi possivel entrar agora. Tente novamente em instantes.',
      });
    }
  }

  return (
    <KeyboardScrollScreen contentContainerStyle={styles.content}>
      <View>
        <View style={styles.header}>
          <Text style={styles.flower}>*</Text>
          <Text style={styles.title}>Bem-vinda de volta</Text>
          <Text style={styles.subtitle}>Entre na sua conta do salao</Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="E-mail"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="seu@email.com"
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              autoCapitalize="none"
              label="Senha"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="********"
              secureTextEntry
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Text style={styles.forgot}>Esqueci minha senha</Text>

        {errors.root?.message ? <Text style={styles.formError}>{errors.root.message}</Text> : null}

        <AppButton
          label="Entrar"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
        <Text style={styles.footerText}>
          Nao tem conta?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('SignUp')}>
            Criar conta
          </Text>
        </Text>
      </View>
    </KeyboardScrollScreen>
  );
}

const styles = StyleSheet.create({
  content: {
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
  formError: {
    marginBottom: 12,
    color: colors.error,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
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
