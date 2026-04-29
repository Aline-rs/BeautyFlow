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
      ownerName: '',
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
          ownerName: salonProfile.ownerName,
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
        ownerName: values.ownerName,
        email: values.email,
        phone: values.phone || undefined,
      });
      Alert.alert('Sucesso', 'Perfil do salao atualizado.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar o perfil do salao.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <TopBar title="Meu salao" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SB</Text>
          </View>
          <Text style={styles.headerTitle}>{salonProfile?.salonName ?? 'Studio Bella Hair'}</Text>
          <Text style={styles.headerCopy}>Dados usados nas mensagens enviadas as clientes.</Text>
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
          name="ownerName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Nome da responsavel *"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.ownerName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="E-mail da conta"
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
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.rose,
    marginBottom: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 20,
  },
  headerTitle: {
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
