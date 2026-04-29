import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomersProvider } from '../../features/customers';
import { CustomerDetailScreen } from '../../screens/CustomerDetailScreen';
import { CustomerFormScreen } from '../../screens/CustomerFormScreen';
import { CustomersScreen } from '../../screens/CustomersScreen';
import { CustomersStackParamList } from '../types';

const Stack = createNativeStackNavigator<CustomersStackParamList>();

export function CustomersStackNavigator() {
  return (
    <CustomersProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CustomersMain" component={CustomersScreen} />
        <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
        <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
      </Stack.Navigator>
    </CustomersProvider>
  );
}
