import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Avatar } from '../components/Avatar';
import { PhotoPicker } from '../components/PhotoPicker';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { SalonProfileFormValues, salonProfileSchema, useSettings } from '../features/settings';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'SalonProfile'>;

export function SalonProfileScreen({ navigation }: Props) {
  const { salonProfile, loadSettings, saveSalonProfile, saveSalonProfilePhoto } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreviewUri, setPhotoPreviewUri] = useState<string | undefined>();
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
        setPhotoPreviewUri(salonProfile.profilePhotoUrl);
        reset({
          salonName: salonProfile.salonName,
          ownerName: salonProfile.ownerName,
          email: salonProfile.email,
          phone: salonProfile.phone ?? '',
        });
      }
    }, [reset, salonProfile]),
  );

  async function handlePickProfilePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para adicionar sua foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const nextUri = result.assets[0]?.uri;
    if (!nextUri) {
      return;
    }

    setPhotoPreviewUri(nextUri);

    try {
      await saveSalonProfilePhoto(nextUri);
      Alert.alert('Sucesso', 'Foto de perfil atualizada.');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
    }
  }

  async function onSubmit(values: SalonProfileFormValues) {
    setIsSubmitting(true);
    try {
      await saveSalonProfile({
        salonName: values.salonName,
        ownerName: values.ownerName,
        email: values.email,
        phone: values.phone || undefined,
        profilePhotoUrl: salonProfile?.profilePhotoUrl,
      });
      Alert.alert('Sucesso', 'Perfil do salão atualizado.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o perfil do salão.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <TopBar title="Meu salao" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar
            initials={buildInitials(salonProfile?.ownerName ?? salonProfile?.salonName ?? 'BF')}
            size={68}
            source={photoPreviewUri ? { uri: photoPreviewUri } : undefined}
          />
          <Text style={styles.headerTitle}>{salonProfile?.salonName ?? 'Studio Bella Hair'}</Text>
          <Text style={styles.headerCopy}>Dados usados nas mensagens enviadas às clientes.</Text>
        </View>

        <PhotoPicker
          label="Adicionar foto de perfil"
          helperText="Escolha uma foto para personalizar sua conta no app."
          previewUri={photoPreviewUri}
          onPress={() => void handlePickProfilePhoto()}
        />

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

function buildInitials(label: string) {
  return label
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
