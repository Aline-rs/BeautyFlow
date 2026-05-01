import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Avatar } from '../components/Avatar';
import { PhotoPicker } from '../components/PhotoPicker';
import { KeyboardScrollScreen } from '../components/KeyboardScrollScreen';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../features/auth';
import {
  fetchProfessionalProfile,
  ProfessionalProfileFormValues,
  professionalProfileSchema,
  updateProfessionalProfile,
  uploadProfessionalProfilePhoto,
} from '../features/profile';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'ProfessionalProfile'>;

export function ProfessionalProfileScreen({ navigation }: Props) {
  const { session, syncProfessionalProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photoPreviewUri, setPhotoPreviewUri] = useState<string | undefined>();
  const sessionProfile = useMemo(
    () => ({
      name: session?.user.name ?? '',
      email: session?.user.email ?? '',
      profilePhotoUrl: session?.user.profilePhotoUrl ?? undefined,
    }),
    [session?.user.email, session?.user.name, session?.user.profilePhotoUrl],
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfessionalProfileFormValues>({
    resolver: zodResolver(professionalProfileSchema),
    defaultValues: {
      name: sessionProfile.name,
      email: sessionProfile.email,
    },
  });

  useFocusEffect(
    useCallback(() => {
      async function hydrate() {
        setIsLoading(true);
        setPhotoPreviewUri(sessionProfile.profilePhotoUrl);
        reset({
          name: sessionProfile.name,
          email: sessionProfile.email,
        });

        try {
          const profile = await fetchProfessionalProfile(sessionProfile);
          setPhotoPreviewUri(profile.profilePhotoUrl ?? undefined);
          reset({
            name: profile.name,
            email: profile.email,
          });
          syncProfessionalProfile(profile);
        } finally {
          setIsLoading(false);
        }
      }

      void hydrate();
    }, [reset, sessionProfile, syncProfessionalProfile]),
  );

  async function handlePickProfilePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissao necessaria', 'Permita o acesso a galeria para adicionar sua foto.');
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
      const profile = await uploadProfessionalProfilePhoto(nextUri);
      setPhotoPreviewUri(profile.profilePhotoUrl ?? nextUri);
      syncProfessionalProfile(profile);
      Alert.alert('Sucesso', 'Foto de perfil atualizada.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel atualizar sua foto agora.');
    }
  }

  async function onSubmit(values: ProfessionalProfileFormValues) {
    setIsSubmitting(true);
    try {
      const profile = await updateProfessionalProfile({
        name: values.name,
        email: values.email,
        profilePhotoUrl: photoPreviewUri,
      });
      syncProfessionalProfile(profile);
      Alert.alert('Sucesso', 'Perfil profissional atualizado.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar seu perfil agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardScrollScreen
      header={<TopBar title="Meu perfil" onBack={() => navigation.goBack()} />}
      contentContainerStyle={styles.content}
    >
        <View style={styles.header}>
          <Avatar
            initials={buildInitials(session?.user.name ?? 'BF')}
            size={68}
            source={photoPreviewUri ? { uri: photoPreviewUri } : undefined}
          />
          <Text style={styles.headerTitle}>Seu perfil profissional</Text>
          <Text style={styles.headerCopy}>Sua identidade vem primeiro no BeautyFlow.</Text>
        </View>

        <PhotoPicker
          label="Adicionar foto de perfil"
          helperText="Escolha uma foto para aparecer no seu perfil."
          previewUri={photoPreviewUri}
          onPress={() => void handlePickProfilePhoto()}
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Seu nome *"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Seu e-mail *"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <View style={styles.statusRow}>
          <Text style={styles.loadingText}>{isLoading ? 'Carregando perfil...' : ' '}</Text>
        </View>

        <AppButton
          label="Salvar alteracoes"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isLoading}
        />
    </KeyboardScrollScreen>
  );
}

function buildInitials(label: string) {
  return label
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
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
  loadingText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
  },
  statusRow: {
    minHeight: 20,
    marginBottom: 12,
    justifyContent: 'center',
  },
});
