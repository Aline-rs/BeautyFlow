import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  return (
    <Screen>
      <TopBar title="Criar conta" onBack={() => navigation.navigate('Login')} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppInput label="Nome da responsável *" placeholder="Seu nome completo" />
        <AppInput label="Nome do salão *" placeholder="Studio Bella Hair" />
        <AppInput label="Telefone do salão" placeholder="(31) 99999-9999" keyboardType="phone-pad" />
        <AppInput label="E-mail *" placeholder="seu@email.com" keyboardType="email-address" />
        <AppInput label="Senha *" placeholder="Mínimo 8 caracteres" secureTextEntry />
        <AppInput label="Confirmar senha *" placeholder="Repita a senha" secureTextEntry />

        <View style={styles.buttons}>
          <AppButton label="Criar conta" onPress={() => navigation.replace('Home')} />
          <AppButton
            label="Já tenho uma conta"
            variant="ghost"
            onPress={() => navigation.navigate('Login')}
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
});
