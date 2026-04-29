import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessagesProvider } from '../../features/appointments';
import { MessageDetailScreen } from '../../screens/MessageDetailScreen';
import { MessagesScreen } from '../../screens/MessagesScreen';
import { MessagesStackParamList } from '../types';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export function MessagesStackNavigator() {
  return (
    <MessagesProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MessagesMain" component={MessagesScreen} />
        <Stack.Screen name="MessageDetail" component={MessageDetailScreen} />
      </Stack.Navigator>
    </MessagesProvider>
  );
}
