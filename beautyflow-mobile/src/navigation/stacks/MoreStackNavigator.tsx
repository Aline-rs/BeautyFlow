import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlaceholderScreen } from '../../screens/PlaceholderScreen';
import { MoreStackParamList } from '../types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export function MoreStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MoreMain"
        component={() => (
          <PlaceholderScreen
            title="Mais"
            subtitle="Acesso para meu salao, servicos, mensagens padrao e notificacoes."
          />
        )}
      />
      <Stack.Screen
        name="SalonProfile"
        component={() => (
          <PlaceholderScreen
            title="Meu salao"
            subtitle="Dados do salao e informacoes usadas nas mensagens."
          />
        )}
      />
      <Stack.Screen
        name="Services"
        component={() => (
          <PlaceholderScreen
            title="Servicos"
            subtitle="Lista de servicos com status e retorno sugerido."
          />
        )}
      />
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
  );
}
