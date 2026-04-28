import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlaceholderScreen } from '../../screens/PlaceholderScreen';
import { MessagesStackParamList } from '../types';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export function MessagesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MessagesMain"
        component={() => (
          <PlaceholderScreen
            title="Mensagens"
            subtitle="Lista de mensagens pendentes, enviadas e com erro."
          />
        )}
      />
      <Stack.Screen
        name="MessageDetail"
        component={() => (
          <PlaceholderScreen
            title="Detalhe da mensagem"
            subtitle="Texto editavel e acoes para WhatsApp e confirmacao de envio."
          />
        )}
      />
    </Stack.Navigator>
  );
}
