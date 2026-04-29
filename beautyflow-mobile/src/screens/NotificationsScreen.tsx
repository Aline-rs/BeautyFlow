import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppInput } from '../components/AppInput';
import { AppSelect } from '../components/AppSelect';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import {
  NotificationSettingsFormValues,
  notificationSettingsSchema,
  useSettings,
} from '../features/settings';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'Notifications'>;

const reminderModeOptions = [
  { label: 'Somente quando houver mensagens no dia', value: 'OnlyWhenDue' },
  { label: 'Todos os dias', value: 'Daily' },
  { label: 'Nunca', value: 'Never' },
] as const;

export function NotificationsScreen({ navigation }: Props) {
  const { notificationSettings, loadSettings, saveNotificationSettings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      isEnabled: true,
      preferredTime: '09:00',
      reminderMode: 'OnlyWhenDue',
    },
  });

  const isEnabled = watch('isEnabled');
  const reminderMode = watch('reminderMode');

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
      if (notificationSettings) {
        reset(notificationSettings);
      }
    }, [notificationSettings, reset]),
  );

  async function onSubmit(values: NotificationSettingsFormValues) {
    setIsSubmitting(true);
    try {
      await saveNotificationSettings(values);
      Alert.alert('Sucesso', 'Notificacoes atualizadas.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar as notificacoes.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <TopBar title="Notificacoes" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.highlightCard}>
          <Text style={styles.sectionLabel}>Lembretes internos</Text>
          <Text style={styles.cardCopy}>
            Receba um aviso quando houver mensagens para enviar no dia.
          </Text>
        </AppCard>

        <AppCard style={styles.toggleCard}>
          <View>
            <Text style={styles.toggleTitle}>Receber notificacoes</Text>
            <Text style={styles.toggleSubtitle}>Avisos diarios do app</Text>
          </View>
          <Pressable style={[styles.switchBase, isEnabled ? styles.switchOn : null]} onPress={() => setValue('isEnabled', !isEnabled)}>
            <View style={[styles.switchKnob, isEnabled ? styles.switchKnobOn : null]} />
          </Pressable>
        </AppCard>

        <Controller
          control={control}
          name="preferredTime"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Horario preferido"
              placeholder="09:00"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.preferredTime?.message}
            />
          )}
        />

        <AppSelect
          label="Quando avisar?"
          value={reminderModeOptions.find((option) => option.value === reminderMode)?.label}
          onPress={() => {
            const currentIndex = reminderModeOptions.findIndex((option) => option.value === reminderMode);
            const nextIndex = (currentIndex + 1) % reminderModeOptions.length;
            setValue('reminderMode', reminderModeOptions[nextIndex].value);
          }}
        />
        {errors.reminderMode?.message ? <Text style={styles.errorText}>{errors.reminderMode.message}</Text> : null}

        <AppButton
          label="Salvar notificacoes"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
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
  highlightCard: {
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
  cardCopy: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  toggleCard: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.textMain,
  },
  toggleSubtitle: {
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
    fontSize: 10,
    color: colors.textSecondary,
  },
  switchBase: {
    width: 46,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#E5D8D5',
    padding: 3,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: colors.rose,
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  switchKnobOn: {
    alignSelf: 'flex-end',
  },
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    color: colors.error,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
  },
});
