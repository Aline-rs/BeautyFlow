import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppTextarea } from '../components/AppTextarea';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import {
  MessageTemplateFormValues,
  messageTemplateSchema,
  useSettings,
} from '../features/settings';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'MessageTemplates'>;

export function MessageTemplateScreen({ navigation }: Props) {
  const { messageTemplate, loadSettings, saveMessageTemplate, resetMessageTemplate } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MessageTemplateFormValues>({
    resolver: zodResolver(messageTemplateSchema),
    defaultValues: {
      templateText: '',
    },
  });

  const templateText = watch('templateText');

  useFocusEffect(
    useCallback(() => {
      async function hydrate() {
        await loadSettings();
      }

      void hydrate();
    }, [loadSettings]),
  );

  useFocusEffect(
    useCallback(() => {
      if (messageTemplate) {
        reset({
          templateText: messageTemplate.templateText,
        });
      }
    }, [messageTemplate, reset]),
  );

  const previewText = useMemo(() => {
    return templateText
      .replaceAll('{nome}', 'Gabriela')
      .replaceAll('{servico}', 'Mechas')
      .replaceAll('{dias}', '15')
      .replaceAll('{salao}', 'Studio Bella Hair')
      .replaceAll('{data_atendimento}', '01/04/2026');
  }, [templateText]);

  async function onSubmit(values: MessageTemplateFormValues) {
    setIsSubmitting(true);
    try {
      await saveMessageTemplate({
        templateText: values.templateText,
      });
      Alert.alert('Sucesso', 'Mensagem padrao atualizada.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar a mensagem padrao.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRestoreDefault() {
    try {
      const nextTemplate = await resetMessageTemplate();
      reset({
        templateText: nextTemplate.templateText,
      });
    } catch {
      Alert.alert('Erro', 'Nao foi possivel restaurar o texto padrao.');
    }
  }

  return (
    <Screen>
      <TopBar title="Mensagens padrao" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.highlightCard}>
          <Text style={styles.sectionLabel}>Mensagem geral</Text>
          <Text style={styles.cardCopy}>
            Esse texto pode ser usado como base quando o servico nao tiver uma mensagem propria.
          </Text>
        </AppCard>

        <Controller
          control={control}
          name="templateText"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextarea
              label="Modelo da mensagem"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={styles.templateArea}
            />
          )}
        />
        {errors.templateText?.message ? <Text style={styles.errorText}>{errors.templateText.message}</Text> : null}

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionLabel}>Variaveis disponiveis</Text>
          <Text style={styles.cardCopy}>{'{nome}, {servico}, {dias}, {salao}, {data_atendimento}'}</Text>
        </AppCard>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionLabel}>Previa</Text>
          <Text style={styles.previewText}>{previewText}</Text>
        </AppCard>

        <AppButton
          label="Salvar mensagem padrao"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
        <AppButton label="Restaurar texto padrao" variant="secondary" onPress={() => void handleRestoreDefault()} />
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
  highlightCard: {
    marginBottom: 12,
    backgroundColor: colors.roseLight,
  },
  infoCard: {
    marginBottom: 12,
  },
  sectionLabel: {
    marginBottom: 6,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  cardCopy: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  previewText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    color: colors.error,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
  },
  templateArea: {
    minHeight: 150,
  },
});
