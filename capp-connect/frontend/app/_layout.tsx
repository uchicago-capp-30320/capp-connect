import { Stack } from 'expo-router/stack';
import Colors from '@/themes/colors';


export default function RootLayout() {
  return (
    <Stack screenOptions={{
      contentStyle: {backgroundColor: Colors.background}
    }}>
      <Stack.Screen name="(tabs)" options={{ title: "Back", headerShown: false}} />
      
      <Stack.Screen name="profile" 
        options={{ 
          title: "Profile",
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText
        }} />
      <Stack.Screen name="settings"
        options={{ 
          title: "Settings", 
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText
        }} />
      <Stack.Screen name="post" 
        options={{ 
          title: "Feed",  
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText
        }} />
    </Stack>
  );
}
