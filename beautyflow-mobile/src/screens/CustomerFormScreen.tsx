import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
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

type Props = NativeStackScreenProps<CustomersStackParamList, 'CustomerForm'>;

export function CustomerFormScreen({ navigation, route }: Props) {
  const customerId = route.params?.customerId;
  const { session } = useAuth();
  const { getCustomerById, saveCustomer } = useCustomers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(customerId));
  const [isSalonDropdownOpen, setIsSalonDropdownOpen] = useState(false);
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

  const selectedPreference = watch('contactPreference');
  const selectedSalonId = watch('salonId');
  const photoUrl = watch('photoUrl');
  const salonOptions = [
    { id: '', label: 'Nao informar agora' },
    ...(session?.salons.map((salon) => ({ id: salon.id, label: salon.name })) ?? []),
  ];
  const selectedSalonLabel =
    salonOptions.find((option) => option.id === selectedSalonId)?.label ?? 'Nao informar agora';

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
      const savedCustomer = await saveCustomer(
        {
          name: values.name,
          whatsapp: values.whatsapp,
          salonId: values.salonId || undefined,
          salonLabel: values.salonId ? selectedSalonLabel : undefined,
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
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar a cliente agora.');
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
              onChangeText={onChange}
              errorMessage={errors.whatsapp?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="salonId"
          render={() => (
            <View>
              <AppSelect
                label="Salao da cliente"
                value={selectedSalonLabel}
                onPress={() => setIsSalonDropdownOpen((current) => !current)}
              />

              {isSalonDropdownOpen ? (
                <AppCard style={styles.dropdownCard}>
                  {salonOptions.map((option, index) => {
                    const isSelected = option.id === selectedSalonId;

                    return (
                      <Pressable
                        key={option.id || 'no-salon'}
                        style={[
                          styles.dropdownOption,
                          index === salonOptions.length - 1 ? styles.dropdownOptionLast : null,
                        ]}
                        onPress={() => {
                          setValue('salonId', option.id);
                          setIsSalonDropdownOpen(false);
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
          Opcional. Use esse campo apenas para indicar em qual salao essa cliente costuma ser atendida.
        </Text>

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Data de nascimento"
              placeholder="1994-07-16"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <AppSelect
          label="Preferencia de contato"
          value={selectedPreference}
          onPress={() => {
            const currentIndex = contactOptions.indexOf(selectedPreference);
            const nextIndex = (currentIndex + 1) % contactOptions.length;
            setValue('contactPreference', contactOptions[nextIndex]);
          }}
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

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.offWhite,
  },
  infoText: {
    marginBottom: 12,
    color: colors.textSecondary,
  },
  helperText: {
    marginTop: -4,
    marginBottom: 12,
    color: colors.textSecondary,
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
});
