import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';
import { AppointmentsStackNavigator } from './stacks/AppointmentsStackNavigator';
import { CustomersStackNavigator } from './stacks/CustomersStackNavigator';
import { HomeStackNavigator } from './stacks/HomeStackNavigator';
import { MessagesStackNavigator } from './stacks/MessagesStackNavigator';
import { MoreStackNavigator } from './stacks/MoreStackNavigator';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={[styles.icon, focused && styles.iconActive]}>{label}</Text>;
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors.roseDark,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="In" />,
        }}
      />
      <Tab.Screen
        name="CustomersTab"
        component={CustomersStackNavigator}
        options={{
          title: 'Clientes',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Cl" />,
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsStackNavigator}
        options={{
          title: 'Atend.',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="At" />,
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesStackNavigator}
        options={{
          title: 'Mensagens',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Ms" />,
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreStackNavigator}
        options={{
          title: 'Mais',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="+" />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabBarLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 10,
  },
  icon: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
  iconActive: {
    color: colors.roseDark,
  },
});
