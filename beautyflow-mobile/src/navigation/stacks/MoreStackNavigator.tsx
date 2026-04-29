import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicesProvider } from '../../features/services';
import { MoreScreen } from '../../screens/MoreScreen';
import { PlaceholderScreen } from '../../screens/PlaceholderScreen';
import { ServiceFormScreen } from '../../screens/ServiceFormScreen';
import { ServicesScreen } from '../../screens/ServicesScreen';
import { MoreStackParamList } from '../types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export function MoreStackNavigator() {
  return (
    <ServicesProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MoreMain" component={MoreScreen} />
        <Stack.Screen
          name="SalonProfile"
          component={() => (
            <PlaceholderScreen
              title="Meu salao"
              subtitle="Dados do salao e informacoes usadas nas mensagens."
            />
          )}
        />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
        <Stack.Screen
          name="MessageTemplates"
          component={() => (
            <PlaceholderScreen
              title="Mensagens padrao"
              subtitle="Texto base e variaveis disponiveis para follow-up."
            />
          )}
        />
        <Stack.Screen
          name="Notifications"
          component={() => (
            <PlaceholderScreen
              title="Notificacoes"
              subtitle="Configuracoes de lembretes internos do aplicativo."
            />
          )}
        />
      </Stack.Navigator>
    </ServicesProvider>
  );
}
