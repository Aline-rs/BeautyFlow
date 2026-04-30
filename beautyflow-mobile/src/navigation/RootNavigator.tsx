import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../features/auth';
import { SalonSetupScreen } from '../screens/SalonSetupScreen';
import { SplashView } from '../screens/SplashView';
import { colors } from '../theme';
import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { hasSkippedSalonSetup, isHydrating, session } = useAuth();

  if (isHydrating) {
    return <SplashView />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.offWhite },
        }}
      >
        {session ? (
          session.salons.length === 0 && !hasSkippedSalonSetup ? (
            <Stack.Screen name="SalonSetup" component={SalonSetupScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
