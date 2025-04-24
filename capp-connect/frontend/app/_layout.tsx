// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Drawer } from 'expo-router/drawer';
import { Stack } from 'expo-router/stack';
// import Menu from "../components/Menu"

// See more navigation design resoruces
// https://reactnavigation.org/docs/drawer-based-navigation/

// export default function RootLayout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       {/* https://stackoverflow.com/questions/71435167/drawer-navigation-position-right */}
//       <Drawer screenOptions={{drawerPosition: 'right'}} /> 
//     </GestureHandlerRootView>
//   );
// }

export default function RootLayout() {
  return (
    <Stack>
      {/* https://stackoverflow.com/questions/71435167/drawer-navigation-position-right */}
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/> 
    </Stack>
  );
}

// Code for stack
{/* <Stack 
screenOptions={{
  headerStyle: {
    backgroundColor: '#f4511e',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}}>
<Stack.Screen name="index" />
<Stack.Screen name="profile" />
{/* <Stack.Screen name="+not-found" /> */}
// </Stack> */}
