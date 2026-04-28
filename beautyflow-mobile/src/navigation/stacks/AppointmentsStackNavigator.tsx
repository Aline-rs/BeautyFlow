import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlaceholderScreen } from '../../screens/PlaceholderScreen';
import { AppointmentsStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

export function AppointmentsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AppointmentsMain"
        component={() => (
          <PlaceholderScreen
            title="Atendimentos"
            subtitle="Historico e registro de novos atendimentos entram neste fluxo."
          />
        )}
      />
      <Stack.Screen
        name="AppointmentForm"
        component={() => (
          <PlaceholderScreen
            title="Registrar atendimento"
            subtitle="Estrutura pronta para formulario, retorno sugerido e previa da mensagem."
          />
        )}
      />
    </Stack.Navigator>
  );
}
