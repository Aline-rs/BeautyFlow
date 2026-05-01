import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppSelect } from '../components/AppSelect';
import { AppTextarea } from '../components/AppTextarea';
import { KeyboardScrollScreen } from '../components/KeyboardScrollScreen';
import { TopBar } from '../components/TopBar';
import { AppointmentFormValues, appointmentSchema, useAppointments } from '../features/appointments';
import { useCustomers } from '../features/customers';
import { fetchCustomers } from '../features/customers/customersService';
import { Customer } from '../features/customers/types';
import { fetchServices } from '../features/services/servicesService';
import { Service } from '../features/services/types';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentForm'>;
type OpenDropdown = 'customer' | 'services' | 'date' | null;

const monthOptions = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Fev' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Abr' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Ago' },
  { value: 9, label: 'Set' },
  { value: 10, label: 'Out' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dez' },
] as const;

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function AppointmentFormScreen({ navigation, route }: Props) {
  const presetCustomerId = route.params?.customerId;
  const { registerAppointment } = useAppointments();
  const { getCustomerById } = useCustomers();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
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
      serviceIds: [],
      appointmentDate: todayIsoDate(),
      notes: '',
    },
  });

  const selectedCustomerId = watch('customerId');
  const selectedServiceIds = watch('serviceIds');
  const appointmentDate = watch('appointmentDate');
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 20 }, (_, index) => currentYear - index);
  }, []);

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
        } finally {
          setIsLoadingOptions(false);
        }
      }

      void loadOptions();
    }, [presetCustomerId, selectedCustomerId, setValue]),
  );

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId),
    [customers, selectedCustomerId],
  );

  const selectedServices = useMemo(
    () => services.filter((service) => selectedServiceIds.includes(service.id)),
    [selectedServiceIds, services],
  );

  const triggerService = useMemo(() => {
    if (selectedServices.length === 0) {
      return null;
    }

    return [...selectedServices].sort((left, right) => {
      if (right.suggestedReturnDays !== left.suggestedReturnDays) {
        return right.suggestedReturnDays - left.suggestedReturnDays;
      }

      return left.name.localeCompare(right.name);
    })[0];
  }, [selectedServices]);

  const suggestedReturnDate = useMemo(() => {
    if (!triggerService || !appointmentDate) {
      return null;
    }

    const next = new Date(`${appointmentDate}T00:00:00`);
    next.setDate(next.getDate() + triggerService.suggestedReturnDays);
    return next;
  }, [appointmentDate, triggerService]);

  const servicesSummary = useMemo(() => {
    if (selectedServices.length === 0) {
      return undefined;
    }

    if (selectedServices.length === 1) {
      const [service] = selectedServices;
      return `${service.name} - ${service.suggestedReturnDays} dias`;
    }

    return `${selectedServices.length} servicos selecionados`;
  }, [selectedServices]);

  async function onSubmit(values: AppointmentFormValues) {
    setIsSubmitting(true);

    try {
      await registerAppointment({
        customerId: values.customerId,
        serviceIds: values.serviceIds,
        appointmentDate: values.appointmentDate,
        notes: values.notes || undefined,
      });
      await getCustomerById(values.customerId);

      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar o atendimento agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardScrollScreen
      header={<TopBar title="Registrar atendimento" onBack={() => navigation.goBack()} />}
      contentContainerStyle={styles.content}
    >
      <View>
        <AppSelect
          label="Cliente *"
          value={selectedCustomer?.name}
          placeholder={isLoadingOptions ? 'Carregando clientes...' : 'Selecione uma cliente'}
          onPress={() => setOpenDropdown((current) => (current === 'customer' ? null : 'customer'))}
        />

        {openDropdown === 'customer' ? (
          <AppCard style={styles.dropdownCard}>
            {customers.map((customer, index) => {
              const isSelected = customer.id === selectedCustomerId;

              return (
                <Pressable
                  key={customer.id}
                  style={[styles.dropdownOption, index === customers.length - 1 ? styles.dropdownOptionLast : null]}
                  onPress={() => {
                    setValue('customerId', customer.id);
                    setOpenDropdown(null);
                  }}
                >
                  <View>
                    <Text style={styles.dropdownOptionTitle}>{customer.name}</Text>
                    <Text style={styles.dropdownOptionCopy}>{customer.contextLabel}</Text>
                  </View>
                  {isSelected ? <Text style={styles.dropdownCheck}>OK</Text> : null}
                </Pressable>
              );
            })}
          </AppCard>
        ) : null}
      </View>
      {errors.customerId?.message ? <Text style={styles.errorText}>{errors.customerId.message}</Text> : null}

      <View>
        <AppSelect
          label="Servicos realizados *"
          value={servicesSummary}
          placeholder={isLoadingOptions ? 'Carregando servicos...' : 'Selecione os servicos'}
          onPress={() => setOpenDropdown((current) => (current === 'services' ? null : 'services'))}
        />

        {openDropdown === 'services' ? (
          <AppCard style={styles.dropdownCard}>
            {services.map((service, index) => {
              const isSelected = selectedServiceIds.includes(service.id);

              return (
                <Pressable
                  key={service.id}
                  style={[styles.dropdownOption, index === services.length - 1 ? styles.dropdownOptionLast : null]}
                  onPress={() => {
                    const nextSelection = isSelected
                      ? selectedServiceIds.filter((serviceId) => serviceId !== service.id)
                      : [...selectedServiceIds, service.id];

                    setValue('serviceIds', nextSelection);
                  }}
                >
                  <View>
                    <Text style={styles.dropdownOptionTitle}>{service.name}</Text>
                    <Text style={styles.dropdownOptionCopy}>{service.suggestedReturnDays} dias para retorno</Text>
                  </View>
                  <Text style={[styles.multiSelectBadge, isSelected ? styles.multiSelectBadgeActive : null]}>
                    {isSelected ? 'OK' : '+'}
                  </Text>
                </Pressable>
              );
            })}
          </AppCard>
        ) : null}
      </View>
      {errors.serviceIds?.message ? <Text style={styles.errorText}>{errors.serviceIds.message}</Text> : null}

      <Controller
        control={control}
        name="appointmentDate"
        render={({ field: { value, onChange } }) => {
          const dateParts = getDateParts(value);
          const maxDay = getDaysInMonth(dateParts.year, dateParts.month);

          return (
            <View>
              <AppSelect
                label="Data do atendimento *"
                value={formatLongDate(value)}
                placeholder="Selecionar data"
                onPress={() => setOpenDropdown((current) => (current === 'date' ? null : 'date'))}
              />

              {openDropdown === 'date' ? (
                <AppCard style={styles.datePickerCard}>
                  <Text style={styles.dropdownOptionTitle}>Escolha a data</Text>

                  <Text style={styles.dateSectionLabel}>Mes</Text>
                  <View style={styles.monthGrid}>
                    {monthOptions.map((month) => (
                      <Pressable
                        key={month.value}
                        style={[styles.dateChip, dateParts.month === month.value ? styles.dateChipActive : null]}
                        onPress={() =>
                          onChange(
                            buildIsoDate(
                              dateParts.year,
                              month.value,
                              Math.min(dateParts.day, getDaysInMonth(dateParts.year, month.value)),
                            ),
                          )
                        }
                      >
                        <Text style={[styles.dateChipText, dateParts.month === month.value ? styles.dateChipTextActive : null]}>
                          {month.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.dateSectionLabel}>Ano</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearRow}>
                    {yearOptions.map((year) => (
                      <Pressable
                        key={year}
                        style={[styles.dateChip, styles.yearChip, dateParts.year === year ? styles.dateChipActive : null]}
                        onPress={() =>
                          onChange(
                            buildIsoDate(
                              year,
                              dateParts.month,
                              Math.min(dateParts.day, getDaysInMonth(year, dateParts.month)),
                            ),
                          )
                        }
                      >
                        <Text style={[styles.dateChipText, dateParts.year === year ? styles.dateChipTextActive : null]}>
                          {year}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>

                  <Text style={styles.dateSectionLabel}>Dia</Text>
                  <View style={styles.dayGrid}>
                    {Array.from({ length: maxDay }, (_, index) => {
                      const day = index + 1;
                      const isSelected = dateParts.day === day;

                      return (
                        <Pressable
                          key={day}
                          style={[styles.dayChip, isSelected ? styles.dateChipActive : null]}
                          onPress={() => onChange(buildIsoDate(dateParts.year, dateParts.month, day))}
                        >
                          <Text style={[styles.dateChipText, isSelected ? styles.dateChipTextActive : null]}>
                            {String(day).padStart(2, '0')}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </AppCard>
              ) : null}
            </View>
          );
        }}
      />
      {errors.appointmentDate?.message ? <Text style={styles.errorText}>{errors.appointmentDate.message}</Text> : null}

      <AppCard style={styles.returnCard}>
        <Text style={styles.returnLabel}>Mensagem agendada automaticamente para:</Text>
        <Text style={styles.returnDate}>
          {suggestedReturnDate
            ? new Intl.DateTimeFormat('pt-BR').format(suggestedReturnDate)
            : 'Selecione uma data e pelo menos um servico'}
        </Text>
        {triggerService ? (
          <Text style={styles.returnHelper}>
            Considerando o maior prazo de retorno: {triggerService.name} ({triggerService.suggestedReturnDays} dias)
          </Text>
        ) : null}
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
            onFocus={() => setOpenDropdown(null)}
            onChangeText={onChange}
          />
        )}
      />

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
    </KeyboardScrollScreen>
  );
}

function getDateParts(date: string) {
  const [year, month, day] = date.split('-').map((part) => Number(part));
  return {
    day: day || 1,
    month: month || 1,
    year: year || new Date().getFullYear(),
  };
}

function buildIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T12:00:00`));
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.offWhite,
  },
  dropdownCard: {
    marginTop: -4,
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionTitle: {
    color: colors.textMain,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
  },
  dropdownOptionCopy: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
  },
  dropdownCheck: {
    color: colors.roseDark,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 12,
  },
  multiSelectBadge: {
    minWidth: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
  multiSelectBadgeActive: {
    borderColor: colors.rose,
    backgroundColor: colors.rose,
    color: '#FFFFFF',
  },
  datePickerCard: {
    marginTop: -4,
    marginBottom: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  dateSectionLabel: {
    marginTop: 12,
    marginBottom: 8,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearRow: {
    gap: 8,
    paddingBottom: 4,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  dateChip: {
    minWidth: 56,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  yearChip: {
    minWidth: 74,
  },
  dayChip: {
    width: '13.4%',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dateChipActive: {
    backgroundColor: colors.rose,
    borderColor: colors.rose,
  },
  dateChipText: {
    color: colors.textMain,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 12,
  },
  dateChipTextActive: {
    color: '#FFFFFF',
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
  returnHelper: {
    marginTop: 6,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
  },
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    color: colors.error,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
  },
});
