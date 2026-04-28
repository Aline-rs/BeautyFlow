import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlaceholderScreen } from '../../screens/PlaceholderScreen';
import { CustomersStackParamList } from '../types';

const Stack = createNativeStackNavigator<CustomersStackParamList>();

export function CustomersStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CustomersMain"
        component={() => (
          <PlaceholderScreen
            title="Clientes"
            subtitle="Lista de clientes e atalhos para criar e ver detalhes."
          />
        )}
      />
      <Stack.Screen
        name="CustomerForm"
        component={() => (
          <PlaceholderScreen
            title="Nova cliente"
            subtitle="Formulario base pronto para a tela de cadastro e edicao."
          />
        )}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={() => (
          <PlaceholderScreen
            title="Detalhes da cliente"
            subtitle="Resumo da cliente, historico e proximo contato."
          />
        )}
      />
    </Stack.Navigator>
  );
}
