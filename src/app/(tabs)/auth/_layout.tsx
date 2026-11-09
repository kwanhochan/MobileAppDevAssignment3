import { Stack } from 'expo-router';

import { colors } from '@/theme';

// Nested Stack inside the Account tab (same pattern as courses/ and settings/ in the lecture):
// Sign In is the first screen, and Sign Up is pushed on top of it with a back button.
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Sign In' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}
