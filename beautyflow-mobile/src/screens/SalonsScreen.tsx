import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppInput } from '../components/AppInput';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../features/auth';
import { fetchCustomers } from '../features/customers/customersService';
import { Customer } from '../features/customers/types';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

const salonSchema = z.object({
  name: z.string().min(3, 'Informe o nome do salao.'),
  phone: z.string().optional(),
  email: z.email('Informe um e-mail valido.'),
});

type SalonFormValues = z.infer<typeof salonSchema>;
type Props = NativeStackScreenProps<MoreStackParamList, 'Salons'>;

export function SalonsScreen({ navigation }: Props) {
  const { session, createSalonLink } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SalonFormValues>({
    resolver: zodResolver(salonSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: session?.user.email ?? '',
    },
  });

  const loadCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      const nextCustomers = await fetchCustomers();
      setCustomers(nextCustomers);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadCustomers();
    }, [loadCustomers]),
  );

  const groupedCustomers = useMemo(() => {
    const customersWithoutSalon = customers.filter((customer) => !customer.contextSalonId);

    return {
      bySalon: (session?.salons ?? []).map((salon) => ({
        salon,
        customers: customers.filter((customer) => customer.contextSalonId === salon.id),
      })),
      customersWithoutSalon,
    };
  }, [customers, session?.salons]);

  async function onSubmit(values: SalonFormValues) {
    setIsCreating(true);

    try {
      await createSalonLink({
        name: values.name,
        phone: values.phone || undefined,
        email: values.email,
        makePrimary: false,
        selectCreatedSalon: false,
      });

      reset({
        name: '',
        phone: '',
        email: session?.user.email ?? values.email,
      });
      setIsComposerOpen(false);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel criar o salao agora.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Screen>
      <TopBar title="Saloes e clientes" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.heroCard}>
          <Text style={styles.heroTitle}>Classifique sua carteira</Text>
          <Text style={styles.heroCopy}>
            Cadastre saloes para identificar onde cada cliente costuma ser atendida. O salao no MVP existe apenas para essa organizacao.
          </Text>
          <AppButton
            label={isComposerOpen ? 'Cancelar cadastro' : 'Cadastrar salao'}
            variant={isComposerOpen ? 'ghost' : 'primary'}
            onPress={() => setIsComposerOpen((current) => !current)}
            disabled={isCreating}
          />
        </AppCard>

        {isComposerOpen ? (
          <AppCard style={styles.formCard}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Nome do salao *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="E-mail do salao *"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Telefone do salao"
                  keyboardType="phone-pad"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  errorMessage={errors.phone?.message}
                />
              )}
            />

            <AppButton
              label="Salvar salao"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting || isCreating}
            />
          </AppCard>
        ) : null}

        <Text style={styles.sectionLabel}>Clientes por salao</Text>

        {isLoadingCustomers ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.roseDark} />
          </View>
        ) : groupedCustomers.bySalon.length === 0 ? (
          <EmptyState
            title="Nenhum salao cadastrado"
            description="Cadastre o primeiro salao para comecar a classificar suas clientes."
          />
        ) : (
          <>
            {groupedCustomers.bySalon.map(({ salon, customers: salonCustomers }) => (
              <AppCard key={salon.id} style={styles.salonCard}>
                <Text style={styles.salonName}>{salon.name}</Text>
                <Text style={styles.salonMeta}>
                  {salonCustomers.length} cliente{salonCustomers.length === 1 ? '' : 's'}
                </Text>

                {salonCustomers.length > 0 ? (
                  <View style={styles.customerList}>
                    {salonCustomers.map((customer) => (
                      <View key={customer.id} style={styles.customerRow}>
                        <Text style={styles.customerName}>{customer.name}</Text>
                        <Text style={styles.customerPhone}>{customer.whatsapp}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyCopy}>Nenhuma cliente vinculada a este salao ainda.</Text>
                )}
              </AppCard>
            ))}

            <AppCard style={styles.salonCard}>
              <Text style={styles.salonName}>Sem salao informado</Text>
              <Text style={styles.salonMeta}>
                {groupedCustomers.customersWithoutSalon.length} cliente
                {groupedCustomers.customersWithoutSalon.length === 1 ? '' : 's'}
              </Text>

              {groupedCustomers.customersWithoutSalon.length > 0 ? (
                <View style={styles.customerList}>
                  {groupedCustomers.customersWithoutSalon.map((customer) => (
                    <View key={customer.id} style={styles.customerRow}>
                      <Text style={styles.customerName}>{customer.name}</Text>
                      <Text style={styles.customerPhone}>{customer.whatsapp}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyCopy}>Todas as suas clientes ja tem um salao informado.</Text>
              )}
            </AppCard>
          </>
        )}
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
  heroCard: {
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: 21,
    color: colors.roseDark,
  },
  heroCopy: {
    marginTop: 6,
    marginBottom: 12,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
  },
  formCard: {
    marginBottom: 12,
  },
  sectionLabel: {
    marginBottom: 8,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salonCard: {
    marginBottom: 10,
  },
  salonName: {
    fontFamily: typography.fontFamily.title,
    fontSize: 18,
    color: colors.textMain,
  },
  salonMeta: {
    marginTop: 4,
    marginBottom: 10,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  customerList: {
    gap: 8,
  },
  customerRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  customerName: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.textMain,
  },
  customerPhone: {
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
  emptyCopy: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
