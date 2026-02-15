import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'הרשמה' }} />
      <Stack.Screen name="login" options={{ title: 'התחברות' }} />
      <Stack.Screen name="explain-sms" options={{ title: 'הרשמה עם מספר נייד' }} />
      <Stack.Screen name="register-steps" options={{ title: 'הרשמה' }} />
      <Stack.Screen name="register-simple" options={{ title: 'הרשמה' }} />
      <Stack.Screen name="phone" options={{ title: 'מספר נייד' }} />
    </Stack>
  );
}
