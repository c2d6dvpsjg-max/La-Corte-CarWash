import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
