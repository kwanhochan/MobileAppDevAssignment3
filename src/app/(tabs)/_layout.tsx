import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const tabIcon =
  (focusedIcon: IconName, outlineIcon: IconName) =>
  ({ size, focused }: { size: number; focused: boolean }) => (
    <Ionicons name={focused ? focusedIcon : outlineIcon} size={size} color={focused ? colors.primary : colors.muted} />
  );

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: '600' },
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { fontWeight: '700', color: colors.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Employee', headerTitle: 'Employee Information', tabBarIcon: tabIcon('people', 'people-outline') }}
      />
      <Tabs.Screen
        name="auth"
        // The auth folder has its own Stack header, so hide the tab header to avoid two headers.
        options={{ title: 'Account', headerShown: false, tabBarIcon: tabIcon('person-circle', 'person-circle-outline') }}
      />
    </Tabs>
  );
}
