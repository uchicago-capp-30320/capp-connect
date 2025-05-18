import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import ProfilePhoto from '@/components/ProfilePhoto';
import SettingsIcon from '@/components/SettingsIcon';
import { View, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import * as React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

const ICON_SIZE = Device.deviceType ===  Device.DeviceType.PHONE ? 35: 50

function makeTab(fileName: string, label: string, icon: React.ComponentProps<typeof FontAwesome>['name']) {
  return (
    <Tabs.Screen
        name={fileName}
        options={{
          title: label,
          tabBarIcon: ({ color }) => (<FontAwesome size={28} name={icon} color={color} />),
          headerRight: () => (
            <View style={{marginRight: 16}}>
              <ProfilePhoto style={styles.image} />
            </View>
          ),
          headerLeft: () => (
            <View style={{marginLeft: 16}}>
              <SettingsIcon style={styles.icon} color="grey"/>
            </View>
          )
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
            <View style={{marginRight: 16}}>
                <ProfilePhoto style={styles.image} />
            </View>

            <SettingsIcon style={styles.icon} color="grey"/>
            </>
          )
        }}
      />
  )
}

export default function Layout() {
// use drawer navigation on desktop
  if (Device.deviceType == Device.DeviceType.DESKTOP) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer >
          {makeDrawerScreen("index", "Home")}
          {makeDrawerScreen("feed", "Feed")}
          {makeDrawerScreen("resources", "Resources")}
        </Drawer>
      </GestureHandlerRootView>
    );
  }

  // use tab navigation on mobile
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      {makeTab("feed", "Feed", "rss")}
      {makeTab("index", "Home", "home")}
      {makeTab("resources", "Resources", "file")}
    </Tabs>
  );
  }


const styles = StyleSheet.create({
  image: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: 50,
      borderWidth: 1
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 50,
    paddingTop: 5
}
})
