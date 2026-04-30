import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { SalonProfileFormValues, salonProfileSchema, useSettings } from '../features/settings';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'SalonProfile'>;

export function SalonProfileScreen({ navigation }: Props) {
  const { salonProfile, loadSettings, saveSalonProfile } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalonProfileFormValues>({
    resolver: zodResolver(salonProfileSchema),
    defaultValues: {
      salonName: '',
      email: '',
      phone: '',
    },
  });

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
      if (salonProfile) {
        reset({
          salonName: salonProfile.salonName,
          email: salonProfile.email,
          phone: salonProfile.phone ?? '',
        });
      }
    }, [reset, salonProfile]),
  );

  async function onSubmit(values: SalonProfileFormValues) {
    setIsSubmitting(true);
    try {
      await saveSalonProfile({
        salonName: values.salonName,
        email: values.email,
        phone: values.phone || undefined,
      });
      Alert.alert('Sucesso', 'Dados do salao atualizados.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar os dados do salao.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <TopBar title="Meu salao" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{salonProfile?.salonName ?? 'Studio Bella Hair'}</Text>
          <Text style={styles.headerCopy}>
            Use esse contexto para organizar clientes, atendimentos e comunicacoes por salao.
          </Text>
        </View>

        <Controller
          control={control}
          name="salonName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Nome do salao *"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.salonName?.message}
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
            />
          )}
        />

        <AppButton label="Salvar alteracoes" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    marginTop: 8,
    fontFamily: typography.fontFamily.title,
    fontSize: 19,
    color: colors.roseDark,
  },
  headerCopy: {
    marginTop: 4,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
