import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../features/auth';
import { SignUpFormValues, signUpSchema } from '../features/auth/schemas';
import { AuthStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      ownerName: '',
      salonName: '',
      salonPhone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      await signUp({
        ownerName: values.ownerName,
        salonName: values.salonName,
        salonPhone: values.salonPhone,
        email: values.email,
        password: values.password,
      });
    } catch {
      setError('root', {
        message: 'Nao foi possivel criar a conta agora. Tente novamente em instantes.',
      });
    }
  }

  return (
    <Screen>
      <TopBar title="Criar conta" onBack={() => navigation.navigate('Login')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Controller
          control={control}
          name="ownerName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Nome da responsavel *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Seu nome completo"
              value={value}
              errorMessage={errors.ownerName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="salonName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Nome do salao *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Studio Bella Hair"
              value={value}
              errorMessage={errors.salonName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="salonPhone"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              keyboardType="phone-pad"
              label="Telefone do salao"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="(31) 99999-9999"
              value={value}
              errorMessage={errors.salonPhone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="E-mail *"
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
              label="Senha *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Minimo 8 caracteres"
              secureTextEntry
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              autoCapitalize="none"
              label="Confirmar senha *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Repita a senha"
              secureTextEntry
              value={value}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        {errors.root?.message ? <Text style={styles.formError}>{errors.root.message}</Text> : null}

        <View style={styles.buttons}>
          <AppButton
            label="Criar conta"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
          <AppButton
            label="Ja tenho uma conta"
            variant="ghost"
            onPress={() => navigation.navigate('Login')}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.offWhite,
  },
  buttons: {
    marginTop: 4,
  },
  formError: {
    marginBottom: 12,
    color: colors.error,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
  },
});
