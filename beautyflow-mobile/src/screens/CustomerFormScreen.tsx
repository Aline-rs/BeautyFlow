import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppInput } from '../components/AppInput';
import { AppSelect } from '../components/AppSelect';
import { AppTextarea } from '../components/AppTextarea';
import { KeyboardScrollScreen } from '../components/KeyboardScrollScreen';
import { PhotoPicker } from '../components/PhotoPicker';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../features/auth';
import { CustomerFormValues, customerSchema, useCustomers } from '../features/customers';
import { CustomersStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

const contactOptions: CustomerFormValues['contactPreference'][] = [
  'WhatsApp',
  'Ligacao',
  'SMS',
];

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

type Props = NativeStackScreenProps<CustomersStackParamList, 'CustomerForm'>;
type OpenDropdown = 'salon' | 'contact' | 'birthDate' | null;

export function CustomerFormScreen({ navigation, route }: Props) {
  const customerId = route.params?.customerId;
  const { session } = useAuth();
  const { getCustomerById, saveCustomer } = useCustomers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(customerId));
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      salonId: '',
      birthDate: '',
      contactPreference: 'WhatsApp',
      notes: '',
      photoUrl: '',
    },
  });

  const photoUrl = watch('photoUrl');
  const salonOptions = [
    { id: '', label: 'Nao informar agora' },
    ...(session?.salons.map((salon) => ({ id: salon.id, label: salon.name })) ?? []),
  ];
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 80 }, (_, index) => currentYear - index);
  }, []);

  useEffect(() => {
    async function loadCustomer() {
      if (!customerId) {
        return;
      }

      const customer = await getCustomerById(customerId);

      if (customer) {
        reset({
          name: customer.name,
          whatsapp: customer.whatsapp,
          salonId: customer.contextSalonId ?? '',
          birthDate: customer.birthDate ?? '',
          contactPreference: customer.contactPreference,
          notes: customer.notes ?? '',
          photoUrl: customer.photoUrl ?? '',
        });
      }

      setIsLoading(false);
    }

    void loadCustomer();
  }, [customerId, getCustomerById, reset]);

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissao necessaria', 'Permita o acesso a galeria para inserir a foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setValue('photoUrl', result.assets[0]?.uri ?? '');
    }
  }

  async function onSubmit(values: CustomerFormValues) {
    setIsSubmitting(true);

    try {
      const selectedSalonLabel = values.salonId
        ? salonOptions.find((option) => option.id === values.salonId)?.label
        : undefined;

      const savedCustomer = await saveCustomer(
        {
          name: values.name,
          whatsapp: values.whatsapp,
          salonId: values.salonId || undefined,
          salonLabel: selectedSalonLabel,
          birthDate: values.birthDate || undefined,
          contactPreference: values.contactPreference,
          notes: values.notes || undefined,
          photoUrl: values.photoUrl || undefined,
        },
        customerId,
      );

      navigation.replace('CustomerDetail', {
        customerId: savedCustomer.id,
      });
    } catch (error) {
      Alert.alert('Erro', getCustomerSaveErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardScrollScreen
      header={
        <TopBar
          title={customerId ? 'Editar cliente' : 'Nova cliente'}
          onBack={() => navigation.goBack()}
        />
      }
      contentContainerStyle={styles.content}
    >
        <PhotoPicker
          label="Foto da cliente"
          helperText="Adicione uma foto para reconhecer a cliente mais rapido."
          previewUri={photoUrl || undefined}
          onPress={() => void handlePickPhoto()}
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Nome da cliente *"
              placeholder="Nome completo"
              value={value}
              onBlur={onBlur}
              onFocus={() => setOpenDropdown(null)}
              onChangeText={onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="whatsapp"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="WhatsApp *"
              placeholder="(31) 99999-9999"
              keyboardType="phone-pad"
              value={value}
              onBlur={onBlur}
              onFocus={() => setOpenDropdown(null)}
              onChangeText={onChange}
              errorMessage={errors.whatsapp?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="salonId"
          render={({ field: { value, onChange } }) => (
            <View>
              <AppSelect
                label="Salao da cliente"
                value={salonOptions.find((option) => option.id === value)?.label ?? 'Nao informar agora'}
                onPress={() => setOpenDropdown((current) => (current === 'salon' ? null : 'salon'))}
              />

              {openDropdown === 'salon' ? (
                <AppCard style={styles.dropdownCard}>
                  {salonOptions.map((option, index) => {
                    const isSelected = option.id === value;

                    return (
                      <Pressable
                        key={option.id || 'no-salon'}
                        style={[
                          styles.dropdownOption,
                          index === salonOptions.length - 1 ? styles.dropdownOptionLast : null,
                        ]}
                        onPress={() => {
                          onChange(option.id);
                          setOpenDropdown(null);
                        }}
                      >
                        <View>
                          <Text style={styles.dropdownOptionTitle}>{option.label}</Text>
                          <Text style={styles.dropdownOptionCopy}>
                            {option.id ? 'Cliente vinculada a este salao.' : 'Cliente sem salao informado.'}
                          </Text>
                        </View>
                        {isSelected ? <Text style={styles.dropdownCheck}>OK</Text> : null}
                      </Pressable>
                    );
                  })}
                </AppCard>
              ) : null}
            </View>
          )}
        />

        <Text style={styles.helperText}>
          Use esse campo apenas para indicar em qual salao essa cliente costuma ser atendida. Voce pode cadastrar um novo salao no menu Mais.
        </Text>

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { value, onChange } }) => {
            const birthParts = getBirthDateParts(value);
            const maxDay = getDaysInMonth(birthParts.year, birthParts.month);

            return (
              <View>
                <AppSelect
                  label="Data de nascimento"
                  value={value ? formatBirthDate(value) : undefined}
                  placeholder="Selecionar data"
                  onPress={() => setOpenDropdown((current) => (current === 'birthDate' ? null : 'birthDate'))}
                />

                {openDropdown === 'birthDate' ? (
                  <AppCard style={styles.datePickerCard}>
                    <View style={styles.datePickerHeader}>
                      <Text style={styles.dropdownOptionTitle}>Escolha a data</Text>
                      <Pressable
                        onPress={() => {
                          onChange('');
                          setOpenDropdown(null);
                        }}
                      >
                        <Text style={styles.clearAction}>Limpar</Text>
                      </Pressable>
                    </View>

                    <Text style={styles.dateSectionLabel}>Mes</Text>
                    <View style={styles.monthGrid}>
                      {monthOptions.map((month) => (
                        <Pressable
                          key={month.value}
                          style={[styles.dateChip, birthParts.month === month.value ? styles.dateChipActive : null]}
                          onPress={() =>
                            onChange(
                              buildIsoDate(
                                birthParts.year,
                                month.value,
                                Math.min(birthParts.day, getDaysInMonth(birthParts.year, month.value)),
                              ),
                            )
                          }
                        >
                          <Text style={[styles.dateChipText, birthParts.month === month.value ? styles.dateChipTextActive : null]}>
                            {month.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <Text style={styles.dateSectionLabel}>Ano</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.yearRow}
                    >
                      {yearOptions.map((year) => (
                        <Pressable
                          key={year}
                          style={[styles.dateChip, styles.yearChip, birthParts.year === year ? styles.dateChipActive : null]}
                          onPress={() =>
                            onChange(
                              buildIsoDate(
                                year,
                                birthParts.month,
                                Math.min(birthParts.day, getDaysInMonth(year, birthParts.month)),
                              ),
                            )
                          }
                        >
                          <Text style={[styles.dateChipText, birthParts.year === year ? styles.dateChipTextActive : null]}>
                            {year}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>

                    <Text style={styles.dateSectionLabel}>Dia</Text>
                    <View style={styles.dayGrid}>
                      {Array.from({ length: maxDay }, (_, index) => {
                        const day = index + 1;
                        const isSelected = birthParts.day === day;

                        return (
                          <Pressable
                            key={day}
                            style={[styles.dayChip, isSelected ? styles.dateChipActive : null]}
                            onPress={() => onChange(buildIsoDate(birthParts.year, birthParts.month, day))}
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

        <Controller
          control={control}
          name="contactPreference"
          render={({ field: { value, onChange } }) => (
            <View>
              <AppSelect
                label="Preferencia de contato"
                value={value}
                onPress={() => setOpenDropdown((current) => (current === 'contact' ? null : 'contact'))}
              />

              {openDropdown === 'contact' ? (
                <AppCard style={styles.dropdownCard}>
                  {contactOptions.map((option, index) => {
                    const isSelected = option === value;

                    return (
                      <Pressable
                        key={option}
                        style={[styles.dropdownOption, index === contactOptions.length - 1 ? styles.dropdownOptionLast : null]}
                        onPress={() => {
                          onChange(option);
                          setOpenDropdown(null);
                        }}
                      >
                        <Text style={styles.dropdownOptionTitle}>{option}</Text>
                        {isSelected ? <Text style={styles.dropdownCheck}>OK</Text> : null}
                      </Pressable>
                    );
                  })}
                </AppCard>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextarea
              label="Observacoes"
              placeholder="Alergias, preferencias, historico importante..."
              value={value}
              onBlur={onBlur}
              onFocus={() => setOpenDropdown(null)}
              onChangeText={onChange}
            />
          )}
        />

        {isLoading ? <Text style={styles.infoText}>Carregando cliente...</Text> : null}

        <AppButton
          label="Salvar cliente"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isLoading}
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

function formatBirthDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T12:00:00`));
}

function getBirthDateParts(date?: string) {
  if (!date) {
    return {
      day: 1,
      month: 1,
      year: 1995,
    };
  }

  const [year, month, day] = date.split('-').map((part) => Number(part));
  return {
    day: day || 1,
    month: month || 1,
    year: year || 1995,
  };
}

function buildIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getCustomerSaveErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string; errors?: string[]; data?: { message?: string } }>;
  return (
    axiosError.response?.data?.message ??
    axiosError.response?.data?.data?.message ??
    axiosError.response?.data?.errors?.[0] ??
    'Nao foi possivel salvar a cliente agora.'
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.offWhite,
  },
  infoText: {
    marginBottom: 12,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
  },
  helperText: {
    marginTop: -4,
    marginBottom: 12,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    lineHeight: 17,
  },
  dropdownCard: {
    marginTop: -4,
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  datePickerCard: {
    marginTop: -4,
    marginBottom: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  datePickerHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateSectionLabel: {
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
    marginBottom: 12,
  },
  yearRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 12,
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
  yearChip: {
    minWidth: 74,
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
  clearAction: {
    color: colors.rose,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 12,
  },
});
