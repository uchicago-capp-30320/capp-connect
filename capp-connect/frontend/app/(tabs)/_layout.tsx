import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import ProfilePhoto from '@/components/ProfilePhoto';
import HelpIcon from '@/components/HelpIcon';
import { View, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Colors from '@/themes/colors';
import { getCurrentUser } from "@/utils/currentUser";
import * as React from 'react';

const ICON_SIZE = Device.deviceType ===  Device.DeviceType.PHONE ? 35: 50

export default function Layout() {
  const [currentUsername, setCurrentUsername] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      const data = await getCurrentUser();
      const user = data?.get("user") ?? "";
      setCurrentUsername(user);
    }
    fetchUser();
  }, []);

function makeTab(fileName: string, label: string, icon: React.ComponentProps<typeof FontAwesome>['name']) {
  return (
    <Tabs.Screen
        name={fileName}
        options={{
          title: label,
          tabBarIcon: ({ color }) => (<FontAwesome size={28} name={icon} color={color} />),
          headerRight: () => (
            <View style={{marginRight: 16}}>
              <ProfilePhoto style={styles.image} user={currentUsername} />
            </View>
          ),
          headerLeft: () => (
            <View style={{marginLeft: 16}}>
              <HelpIcon style={styles.icon}/>
            </View>
          ),
          // set background color for the header bar and scene/page related to it
          headerStyle: {backgroundColor: Colors.header},
          sceneStyle: {backgroundColor: Colors.background},
          // set color for the header text
          headerTintColor: Colors.headerText,
          headerTitleStyle: {fontWeight: "bold"},
          headerTitleAlign: "center"
        }}

      />
  )
}

function makeDrawerScreen(fileName: string, label: string) {
  return (
    <Drawer.Screen
        name={fileName}
        options={{
          title: label,
          headerRight: () => (
            // display profile photo and settings button side by side with some space in between
            <>
            <View style={{marginRight: 7}}>
            <ProfilePhoto style={styles.image} user={currentUsername} />
            </View>

            <HelpIcon style={[styles.icon, {marginRight: 10, marginBottom: 5}]}/>
            </>
          ),
          // set background color for the header bar and scene/page related to it
          headerStyle: {backgroundColor: Colors.header},
          sceneStyle: {backgroundColor: Colors.background},
          // set color for the header text
          headerTintColor: Colors.headerText,
          headerTitleStyle: {fontWeight: "bold"},
          headerTitleAlign: "center"
        }}
      />
  )
}

// use drawer navigation on desktop
  if (Device.deviceType == Device.DeviceType.DESKTOP) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            // add background color and active and inactive text color (tint)
            drawerStyle: { backgroundColor: Colors.menuBackground },
            drawerActiveTintColor: Colors.activeText,
            drawerInactiveTintColor:  Colors.inactiveText,
            drawerLabelStyle: {fontWeight: "bold"}
          }}>
          {/* returns JSX drawer screen objects for all the pages */}
          {makeDrawerScreen("index", "Home")}
          {makeDrawerScreen("directory", "Directory")}
          {makeDrawerScreen("resources", "Resources")}
          {makeDrawerScreen("feed", "Feed")}
        </Drawer>
      </GestureHandlerRootView>
    );
  }

  // use tab navigation on mobile
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.iconActive,
        tabBarInactiveTintColor: Colors.iconInactive,
        tabBarStyle: {backgroundColor: Colors.footer}
      }}
    >
    {/* returns JSX tab objects for all the pages */}
      {makeTab("index", "Home", "home")}
      {makeTab("directory", "Directory", "address-book")}
      {makeTab("resources", "Resources", "list-alt")}
      {makeTab("feed", "Feed", "rss")}
    </Tabs>
  );
  }


const styles = StyleSheet.create({
  image: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: ICON_SIZE/2,
      borderWidth: 1
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE/2,
    paddingTop: 5
}
})
