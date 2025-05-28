import { Stack } from 'expo-router/stack';
import { useEffect, useState, useRef } from "react";
import Colors from '@/themes/colors';
import { setCachedData, getCachedData } from "@/utils/caching";
import { updateFeed } from "@/utils/feedTools";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { router } from "expo-router";
import fetchData from '@/utils/fetchdata';
import { API_BASE_URL } from '@/utils/constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
    // initialize app
    const prefetchPosts = useRef(true)
    const prefetchTags = useRef(true)
    const [currentTime, setCurrentTime] = useState(Date.now())

    // init feed cache
    useEffect(() => {
      const now = Date.now()
      // don't update if its been less than two minutes
      if (((currentTime - now) > 1000*120) || prefetchPosts.current) {
        setCachedData("feed", {
          fullResults: {
            nextPage: 1,
            All: [],
            General: [],
            Event: [],
            Job: [],
            Project: []
          }
        });

        const fetchData = async () => {
          const data = await updateFeed()
          console.log(data)
        };
        fetchData();
        setCurrentTime(now)
        prefetchPosts.current = false
      }
    }, []);

    // init tags cache, loading all tags for autocompletion
    useEffect(() => {
      const now = Date.now()
      // don't update if its been less than two minutes
      if (((currentTime - now) > 1000*60*5) || prefetchTags.current) {
        setCachedData("tags", {
            directory: [],
            resources: [],
            feed: [] 
          }
        )
        async function getTags() {
          const tags = await fetchData(
                              `${API_BASE_URL}/tags/`,
                              "GET",
                              {}
                          )

          const users = await fetchData(
                              `${API_BASE_URL}/profiles/`,
                              "GET",
                              {}
                          )

          let names = []
          for (let user of users) {
            names.push(user.user)
          }
          const cachedData = await getCachedData("tags")
          // resources and feed use only the normal tags, but the directory also uses user profiles
          cachedData["directory"] = [...tags, ...names]

          cachedData["resources"] = tags
          cachedData["feed"] = tags

          setCachedData("tags", cachedData)
        }

        getTags()
        prefetchTags.current = false
      }

    }, []);


    const backIcon = Platform.OS === "ios" ? "chevron-back" : "arrow-back-sharp";


  return (
    <Stack screenOptions={{
      contentStyle: {backgroundColor: Colors.background}
    }}>
      <Stack.Screen name="(tabs)" options={{ title: "Back", headerShown: false}} />

      <Stack.Screen name="profile"
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
