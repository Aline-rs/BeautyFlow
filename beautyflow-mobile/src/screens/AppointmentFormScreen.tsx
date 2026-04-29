import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppInput } from '../components/AppInput';
import { AppSelect } from '../components/AppSelect';
import { AppTextarea } from '../components/AppTextarea';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { AppointmentFormValues, appointmentSchema, useAppointments } from '../features/appointments';
import { fetchCustomers } from '../features/customers/customersService';
import { Customer } from '../features/customers/types';
import { fetchServices } from '../features/services/servicesService';
import { Service } from '../features/services/types';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentForm'>;

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function AppointmentFormScreen({ navigation, route }: Props) {
  const presetCustomerId = route.params?.customerId;
  const { registerAppointment } = useAppointments();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customerId: presetCustomerId ?? '',
      serviceId: '',
      appointmentDate: todayIsoDate(),
      notes: '',
    },
  });

  const selectedCustomerId = watch('customerId');
  const selectedServiceId = watch('serviceId');
  const appointmentDate = watch('appointmentDate');

  useFocusEffect(
    useCallback(() => {
      async function loadOptions() {
        setIsLoadingOptions(true);
        try {
          const [nextCustomers, nextServices] = await Promise.all([
            fetchCustomers(),
            fetchServices(),
          ]);

          const activeServices = nextServices.filter((service) => service.isActive);
          setCustomers(nextCustomers);
          setServices(activeServices);

          if (!selectedCustomerId && nextCustomers.length > 0) {
            setValue('customerId', presetCustomerId ?? nextCustomers[0].id);
          }

          if (!selectedServiceId && activeServices.length > 0) {
            setValue('serviceId', activeServices[0].id);
          }
        } finally {
          setIsLoadingOptions(false);
        }
      }

      void loadOptions();
    }, [presetCustomerId, selectedCustomerId, selectedServiceId, setValue]),
  );

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId),
    [customers, selectedCustomerId],
  );
  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [selectedServiceId, services],
  );

  const suggestedReturnDate = useMemo(() => {
    if (!selectedService || !appointmentDate) {
      return null;
    }

    const next = new Date(`${appointmentDate}T00:00:00`);
    next.setDate(next.getDate() + selectedService.suggestedReturnDays);
    return next;
  }, [appointmentDate, selectedService]);

  const messagePreview = useMemo(() => {
    if (!selectedCustomer || !selectedService) {
      return 'Selecione uma cliente e um servico para ver a previa da mensagem.';
    }

    return `Oi, ${selectedCustomer.name}! Tudo bem? Ja faz ${selectedService.suggestedReturnDays} dias desde ${selectedService.name.toLowerCase()}. Que tal agendar um retorno?`;
  }, [selectedCustomer, selectedService]);

  async function onSubmit(values: AppointmentFormValues) {
    setIsSubmitting(true);

    try {
      await registerAppointment({
        customerId: values.customerId,
        serviceId: values.serviceId,
        appointmentDate: values.appointmentDate,
        notes: values.notes || undefined,
      });

      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar o atendimento agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <TopBar title="Registrar atendimento" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppSelect
          label="Cliente *"
          value={selectedCustomer?.name}
          placeholder={isLoadingOptions ? 'Carregando clientes...' : 'Selecione uma cliente'}
          onPress={() => {
            if (customers.length === 0) {
              return;
            }

            const currentIndex = customers.findIndex((customer) => customer.id === selectedCustomerId);
            const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % customers.length : 0;
            setValue('customerId', customers[nextIndex].id);
          }}
        />
        {errors.customerId?.message ? <Text style={styles.errorText}>{errors.customerId.message}</Text> : null}

        <AppSelect
          label="Servico realizado *"
          value={
            selectedService
              ? `${selectedService.name} - ${selectedService.suggestedReturnDays} dias`
              : undefined
          }
          placeholder={isLoadingOptions ? 'Carregando servicos...' : 'Selecione um servico'}
          onPress={() => {
            if (services.length === 0) {
              return;
            }

            const currentIndex = services.findIndex((service) => service.id === selectedServiceId);
            const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % services.length : 0;
            setValue('serviceId', services[nextIndex].id);
          }}
        />
        {errors.serviceId?.message ? <Text style={styles.errorText}>{errors.serviceId.message}</Text> : null}

        <Controller
          control={control}
          name="appointmentDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Data do atendimento *"
              placeholder="2026-04-01"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.appointmentDate?.message}
            />
          )}
        />

        <AppCard style={styles.returnCard}>
          <Text style={styles.returnLabel}>Mensagem agendada automaticamente para:</Text>
          <Text style={styles.returnDate}>
            {suggestedReturnDate
              ? new Intl.DateTimeFormat('pt-BR').format(suggestedReturnDate)
              : 'Selecione uma data e um servico'}
          </Text>
        </AppCard>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextarea
              label="Observacoes"
              placeholder="Ex: Fez mechas loiras e matizacao"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <AppCard style={styles.previewCard}>
          <Text style={styles.sectionLabel}>Previa da mensagem</Text>
          <Text style={styles.previewText}>{messagePreview}</Text>
        </AppCard>

        <AppButton
          label="Salvar atendimento"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isLoadingOptions}
        />
        <AppButton
          label="Cancelar"
          variant="ghost"
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        />
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
  returnCard: {
    marginBottom: 12,
    backgroundColor: colors.roseLight,
    borderColor: colors.borderStrong,
  },
  returnLabel: {
    marginBottom: 4,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 10,
    color: colors.roseDark,
  },
  returnDate: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 15,
    color: colors.roseDark,
  },
  previewCard: {
    marginBottom: 12,
  },
  sectionLabel: {
    marginBottom: 6,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  previewText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    color: colors.error,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
  },
});
