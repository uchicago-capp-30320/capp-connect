import { Stack } from 'expo-router/stack';
import { useEffect, useState, useRef } from "react";
import Colors from '@/themes/colors';
import { setCachedData, getCachedData } from "@/utils/caching";
import { updateFeed } from "@/utils/feedTools";
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
    // initialize app
    const initApp = useRef(true)
    const [currentTime, setCurrentTime] = useState(Date.now())

    // init feed cache
    useEffect(() => {
      const now = Date.now()
      // don't update if its been less than two minutes
      if (((currentTime - now) > 1000*120) || initApp.current) {
        console.log(currentTime, now)
        setCachedData("feed", {
          fullResults: {
            nextPage: 1,
            All: [],
            General: [],
            Event: [],
            Job: [],
            Project: []
          },
          searchResults: {
            All: [],
            General: [],
            Event: [],
            Job: [],
            Project: []
          }
        });

        const fetchData = async () => {
          await updateFeed()
          const data = await getCachedData("feed");
          console.log(data)
        };
        fetchData();
        setCurrentTime(now)
        initApp.current = false
      }
    }, []);


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
      {/* <Stack.Screen name="settings"
        options={{
          title: "Settings",
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText
        }} /> */}
      <Stack.Screen name="post"
        options={{
          title: "Feed",
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText
        }} />
    </Stack>
  );
}
