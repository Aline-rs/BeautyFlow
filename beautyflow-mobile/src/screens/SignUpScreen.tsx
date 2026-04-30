import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { PhotoPicker } from '../components/PhotoPicker';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../features/auth';
import { uploadProfessionalProfilePhoto } from '../features/profile';
import { SignUpFormValues, signUpSchema } from '../features/auth/schemas';
import { AuthStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp, syncProfessionalProfile } = useAuth();
  const [photoPreviewUri, setPhotoPreviewUri] = useState<string | undefined>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      ownerName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      await signUp({
        ownerName: values.ownerName,
        email: values.email,
        password: values.password,
      });

      if (photoPreviewUri) {
        const profile = await uploadProfessionalProfilePhoto(photoPreviewUri);
        syncProfessionalProfile(profile);
      }
    } catch {
      setError('root', {
        message: 'Nao foi possivel criar a conta agora. Tente novamente em instantes.',
      });
    }
  }

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
  }

  return (
    <Screen>
      <TopBar title="Criar conta" onBack={() => navigation.navigate('Login')} />
      <ScrollView contentContainerStyle={styles.content}>
        <PhotoPicker
          label="Foto de perfil"
          helperText="Opcional. Voce tambem pode adicionar depois no seu perfil."
          previewUri={photoPreviewUri}
          onPress={() => void handlePickProfilePhoto()}
        />

        <Controller
          control={control}
          name="ownerName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Seu nome profissional *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Seu nome completo"
              value={value}
              errorMessage={errors.ownerName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label="E-mail *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="seu@email.com"
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              autoCapitalize="none"
              label="Senha *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Minimo 8 caracteres"
              secureTextEntry
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              autoCapitalize="none"
              label="Confirmar senha *"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Repita a senha"
              secureTextEntry
              value={value}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        <Text style={styles.helperText}>
          Sua conta profissional vem primeiro. O vinculo com salao pode ser feito depois, quando fizer sentido para sua rotina.
        </Text>

        {errors.root?.message ? <Text style={styles.formError}>{errors.root.message}</Text> : null}

        <View style={styles.buttons}>
          <AppButton
            label="Criar conta"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
          <AppButton
            label="Ja tenho uma conta"
            variant="ghost"
            onPress={() => navigation.navigate('Login')}
            disabled={isSubmitting}
          />
        </View>
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
  buttons: {
    marginTop: 4,
  },
  helperText: {
    marginBottom: 12,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    textAlign: 'center',
  },
  formError: {
    marginBottom: 12,
    color: colors.error,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
  },
});
