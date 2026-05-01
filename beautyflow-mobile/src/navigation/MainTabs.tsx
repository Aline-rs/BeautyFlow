import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { AppointmentsStackNavigator } from './stacks/AppointmentsStackNavigator';
import { CustomersStackNavigator } from './stacks/CustomersStackNavigator';
import { HomeStackNavigator } from './stacks/HomeStackNavigator';
import { MessagesStackNavigator } from './stacks/MessagesStackNavigator';
import { MoreStackNavigator } from './stacks/MoreStackNavigator';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconProps = {
  kind: 'home' | 'customers' | 'appointments' | 'messages' | 'more';
  focused: boolean;
};

function TabIcon({ kind, focused }: TabIconProps) {
  const iconColor = focused ? colors.roseDark : colors.textSecondary;

  if (kind === 'home') {
    return (
      <View style={styles.iconFrame}>
        <View
          style={[
            styles.houseRoof,
            { borderBottomColor: iconColor },
          ]}
        />
        <View style={[styles.houseBody, { borderColor: iconColor }]}>
          <View style={[styles.houseDoor, { backgroundColor: iconColor }]} />
        </View>
      </View>
    );
  }

  if (kind === 'customers') {
    return (
      <View style={styles.iconFrame}>
        <View style={[styles.peopleHeadLeft, { borderColor: iconColor }]} />
        <View style={[styles.peopleHeadRight, { borderColor: iconColor }]} />
        <View style={[styles.peopleBodyLeft, { borderColor: iconColor }]} />
        <View style={[styles.peopleBodyRight, { borderColor: iconColor }]} />
      </View>
    );
  }

  if (kind === 'appointments') {
    return (
      <View style={[styles.iconFrame, styles.calendarFrame, { borderColor: iconColor }]}>
        <View style={[styles.calendarBar, { backgroundColor: iconColor }]} />
        <View style={[styles.calendarPinLeft, { backgroundColor: iconColor }]} />
        <View style={[styles.calendarPinRight, { backgroundColor: iconColor }]} />
        <View style={[styles.calendarDot, styles.calendarDotTop, { backgroundColor: iconColor }]} />
        <View style={[styles.calendarDot, styles.calendarDotBottom, { backgroundColor: iconColor }]} />
      </View>
    );
  }

  if (kind === 'messages') {
    return (
      <View style={styles.iconFrame}>
        <View style={[styles.chatBubble, { borderColor: iconColor }]}>
          <View style={[styles.chatLine, { backgroundColor: iconColor }]} />
          <View style={[styles.chatLineShort, { backgroundColor: iconColor }]} />
        </View>
        <View
          style={[
            styles.chatTail,
            {
              borderTopColor: iconColor,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={styles.iconFrame}>
      <View style={[styles.gridDot, styles.gridDotTopLeft, { backgroundColor: iconColor }]} />
      <View style={[styles.gridDot, styles.gridDotTopRight, { backgroundColor: iconColor }]} />
      <View style={[styles.gridDot, styles.gridDotBottomLeft, { backgroundColor: iconColor }]} />
      <View style={[styles.gridDot, styles.gridDotBottomRight, { backgroundColor: iconColor }]} />
    </View>
  );
}

export function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 74 + insets.bottom,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ],
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
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} kind="home" />,
        }}
      />
      <Tab.Screen
        name="CustomersTab"
        component={CustomersStackNavigator}
        options={{
          title: 'Clientes',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} kind="customers" />,
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsStackNavigator}
        options={{
          title: 'Atend.',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} kind="appointments" />,
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesStackNavigator}
        options={{
          title: 'Mensagens',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} kind="messages" />,
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreStackNavigator}
        options={{
          title: 'Mais',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} kind="more" />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabBarLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 10,
  },
  iconFrame: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  houseRoof: {
    position: 'absolute',
    top: 1,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  houseBody: {
    position: 'absolute',
    top: 8,
    width: 14,
    height: 11,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  houseDoor: {
    width: 4,
    height: 5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginBottom: 1,
  },
  peopleHeadLeft: {
    position: 'absolute',
    top: 2,
    left: 3,
    width: 7,
    height: 7,
    borderWidth: 1.5,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  peopleHeadRight: {
    position: 'absolute',
    top: 2,
    right: 3,
    width: 7,
    height: 7,
    borderWidth: 1.5,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  peopleBodyLeft: {
    position: 'absolute',
    left: 1,
    bottom: 2,
    width: 10,
    height: 7,
    borderWidth: 1.5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  peopleBodyRight: {
    position: 'absolute',
    right: 1,
    bottom: 2,
    width: 10,
    height: 7,
    borderWidth: 1.5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  calendarFrame: {
    borderWidth: 1.5,
    borderRadius: 4,
  },
  calendarBar: {
    position: 'absolute',
    top: 5,
    width: 13,
    height: 1.5,
  },
  calendarPinLeft: {
    position: 'absolute',
    top: 1,
    left: 5,
    width: 2,
    height: 5,
    borderRadius: 999,
  },
  calendarPinRight: {
    position: 'absolute',
    top: 1,
    right: 5,
    width: 2,
    height: 5,
    borderRadius: 999,
  },
  calendarDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 999,
  },
  calendarDotTop: {
    top: 10,
    left: 6,
  },
  calendarDotBottom: {
    top: 14,
    right: 6,
  },
  chatBubble: {
    width: 16,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: '#FFFFFF',
  },
  chatLine: {
    width: 8,
    height: 1.5,
    borderRadius: 999,
  },
  chatLineShort: {
    width: 5,
    height: 1.5,
    borderRadius: 999,
  },
  chatTail: {
    position: 'absolute',
    bottom: 3,
    right: 1,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
  },
  gridDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2,
  },
  gridDotTopLeft: {
    top: 4,
    left: 4,
  },
  gridDotTopRight: {
    top: 4,
    right: 4,
  },
  gridDotBottomLeft: {
    bottom: 4,
    left: 4,
  },
  gridDotBottomRight: {
    bottom: 4,
    right: 4,
  },
});
