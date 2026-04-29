import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppInput } from '../components/AppInput';
import { AppSelect } from '../components/AppSelect';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { ServiceFormValues, serviceSchema, useServices } from '../features/services';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'ServiceForm'>;

export function ServiceFormScreen({ navigation, route }: Props) {
  const serviceId = route.params?.serviceId;
  const { getServiceById, saveService } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(serviceId));
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      suggestedReturnDays: '',
      isActive: true,
    },
  });

  const isActive = watch('isActive');

  useEffect(() => {
    async function loadService() {
      if (!serviceId) {
        return;
      }

      const service = await getServiceById(serviceId);

      if (service) {
        reset({
          name: service.name,
          suggestedReturnDays: String(service.suggestedReturnDays),
          isActive: service.isActive,
        });
      }

      setIsLoading(false);
    }

    void loadService();
  }, [getServiceById, reset, serviceId]);

  async function onSubmit(values: ServiceFormValues) {
    setIsSubmitting(true);

    try {
      await saveService(
        {
          name: values.name,
          suggestedReturnDays: Number(values.suggestedReturnDays),
          isActive: values.isActive,
        },
        serviceId,
      );

      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar o servico agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <TopBar
        title={serviceId ? 'Editar servico' : 'Novo servico'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Nome do servico *"
              placeholder="Ex: Mechas"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="suggestedReturnDays"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Prazo de retorno em dias *"
              placeholder="15"
              keyboardType="number-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.suggestedReturnDays?.message}
            />
          )}
        />

        <AppSelect
          label="Status"
          value={isActive ? 'Ativo' : 'Inativo'}
          onPress={() => setValue('isActive', !isActive)}
        />

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionLabel}>Variaveis disponiveis</Text>
          <Text style={styles.infoText}>{'{nome}, {servico}, {dias}, {salao}, {data_atendimento}'}</Text>
        </AppCard>

        {isLoading ? <Text style={styles.loadingText}>Carregando servico...</Text> : null}

        <AppButton
          label="Salvar servico"
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
  infoCard: {
    marginBottom: 12,
    backgroundColor: colors.roseLight,
  },
  sectionLabel: {
    marginBottom: 6,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  infoText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  loadingText: {
    marginBottom: 12,
    color: colors.textSecondary,
  },
});
