import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppointmentsProvider } from '../../features/appointments';
import { AppointmentFormScreen } from '../../screens/AppointmentFormScreen';
import { AppointmentsHistoryScreen } from '../../screens/AppointmentsHistoryScreen';
import { AppointmentsStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

export function AppointmentsStackNavigator() {
  return (
    <AppointmentsProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppointmentsMain" component={AppointmentsHistoryScreen} />
        <Stack.Screen name="AppointmentForm" component={AppointmentFormScreen} />
      </Stack.Navigator>
    </AppointmentsProvider>
  );
}
