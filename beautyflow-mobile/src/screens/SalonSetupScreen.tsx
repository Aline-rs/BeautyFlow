import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppInput } from '../components/AppInput';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { useAuth } from '../features/auth';
import { colors, spacing, typography } from '../theme';

const salonSetupSchema = z.object({
  name: z.string().min(3, 'Informe o nome do salao.'),
  phone: z.string().optional(),
  email: z.email('Informe um e-mail valido.'),
});

type SalonSetupValues = z.infer<typeof salonSetupSchema>;

export function SalonSetupScreen() {
  const { session, createSalonLink, signOut } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SalonSetupValues>({
    resolver: zodResolver(salonSetupSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: session?.user.email ?? '',
    },
  });

  async function onSubmit(values: SalonSetupValues) {
    try {
      await createSalonLink({
        name: values.name,
        phone: values.phone,
        email: values.email,
      });
    } catch {
      setError('root', {
        message: 'Nao foi possivel vincular seu salao agora. Tente novamente em instantes.',
      });
    }
  }

  return (
    <Screen>
      <View style={styles.container}>
        <EmptyState
          title="Seu primeiro salao"
          description="Sua conta profissional ja esta pronta. Agora vamos cadastrar o primeiro salao para liberar servicos, atendimentos e configuracoes."
        />

        <AppCard style={styles.card}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Nome do salao *"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Studio Bella Hair"
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="phone-pad"
                label="Telefone do salao"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="(31) 99999-9999"
                value={value}
                errorMessage={errors.phone?.message}
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
                label="E-mail do salao *"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="contato@seusalao.com"
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          {errors.root?.message ? <Text style={styles.formError}>{errors.root.message}</Text> : null}

          <AppButton label="Salvar e continuar" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
          <AppButton label="Sair da conta" variant="ghost" onPress={() => void signOut()} disabled={isSubmitting} />
        </AppCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: spacing.md,
  },
  card: {
    padding: 16,
  },
  formError: {
    marginBottom: 12,
    color: colors.error,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
  },
});
