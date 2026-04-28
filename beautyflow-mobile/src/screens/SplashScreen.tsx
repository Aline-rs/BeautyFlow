import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AuthStackParamList } from '../navigation/types';
import { SplashView } from './SplashView';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <SplashView />
      <View style={styles.footer}>
        <AppButton label="Entrar" onPress={() => navigation.navigate('Login')} />
        <AppButton
          label="Criar conta"
          variant="secondary"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 34,
  },
});
