import { Stack } from 'expo-router/stack';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ title: "Back", headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: "Profile"}} />
      <Stack.Screen name="settings" options={{ title: "Settings"}} />
    </Stack>
    </>
  );
}