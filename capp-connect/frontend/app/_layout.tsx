import { Stack } from 'expo-router/stack';
import { useEffect, useState, useRef } from "react";
import Colors from '@/themes/colors';
import { setCachedData, getCachedData } from "@/utils/caching";
import { updateFeed } from "@/utils/feedTools";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { router } from "expo-router";
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


    const backIcon = Platform.OS === "ios" ? "chevron-back" : "arrow-back-sharp";


  return (
    <Stack screenOptions={{
      contentStyle: {backgroundColor: Colors.background}
    }}>
      <Stack.Screen name="(tabs)" options={{ title: "Back", headerShown: false}} />

      <Stack.Screen name="me"
        options={{
          title: "My Profile",
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText
        }} />

      <Stack.Screen name="user"
        options={{
          title: "Profile",
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText,
          headerTitleStyle: {fontWeight: "bold"},
          headerLeft: () => (
            <Ionicons
              name={backIcon}
              style={{marginLeft: 10}}
              size={25}
              color="white"
              onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            />
          )
        }} />
      <Stack.Screen name="post"
        options={{
          title: "",
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText,
          headerTitleStyle: {fontWeight: "bold"},
          headerLeft: () => (
            <Ionicons
              name={backIcon}
              style={{marginLeft: 10}}
              size={25}
              color="white"
              onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            />
          )
        }} />
      <Stack.Screen name="newpost"
        options={{
          title: "New Post",
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: Colors.header},
          headerTintColor: Colors.headerText,
          headerTitleStyle: {fontWeight: "bold"},
          headerLeft: () => (
            <Ionicons
              name={backIcon}
              style={{marginLeft: 10}}
              size={25}
              color="white"
              onPress={() => router.canGoBack() ? router.back() : router.replace('/feed')}
            />
          )
        }} />
    </Stack>
  );
}
