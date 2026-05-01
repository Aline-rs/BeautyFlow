import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsProvider } from '../../features/settings';
import { ServicesProvider } from '../../features/services';
import { MoreScreen } from '../../screens/MoreScreen';
import { MessageTemplateScreen } from '../../screens/MessageTemplateScreen';
import { NotificationsScreen } from '../../screens/NotificationsScreen';
import { ProfessionalProfileScreen } from '../../screens/ProfessionalProfileScreen';
import { SalonsScreen } from '../../screens/SalonsScreen';
import { ServiceFormScreen } from '../../screens/ServiceFormScreen';
import { ServicesScreen } from '../../screens/ServicesScreen';
import { MoreStackParamList } from '../types';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export function MoreStackNavigator() {
  return (
    <SettingsProvider>
      <ServicesProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MoreMain" component={MoreScreen} />
          <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfileScreen} />
          <Stack.Screen name="Salons" component={SalonsScreen} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
          <Stack.Screen name="MessageTemplates" component={MessageTemplateScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </ServicesProvider>
    </SettingsProvider>
  );
}
