// using require() is useful for images
/* eslint-disable @typescript-eslint/no-require-imports */

import { Image, View, Dimensions, useWindowDimensions, LayoutChangeEvent, Pressable, Keyboard } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AutoComplete from "@/components/TagAutocomplete";
import { useEffect, useState } from "react";
import * as Device from 'expo-device';
import TypeTab from "@/components/TypeTab";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Index() {
  // list of tags
  const [ tags, setTags ] = useState<string[]>([]);
  // get width of search bar
  const [searchbarWidth, setSearchbarWidth] = useState(0);
  // get width of screen
  const [screenWidth, setScreenWidth] = useState(0);
  // set search type
  const [searchType, setSearchType] = useState("Directory");
  // use key to force remount when window dimensions change
  const [key, setKey] = useState(0)

  // adjust width of search bar
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSearchbarWidth(width);
  };

  // remount search bar when window size changes
  const { width, height } = useWindowDimensions();
  useEffect(()=> {
    setKey(key + 1)
  }, [width, height])

  const tabNames = ["Directory", "Resources", "Feed"]

  return (
    <>
      {/* allow users to press anywhere to exit the search bar tagging on mobile, but not on desktop (doing so causes the hand icon to show)*/}
      {Device.deviceType !== Device.DeviceType.DESKTOP ? (

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          extraScrollHeight={16}
          horizontal={false}
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
      >
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",

            }}
            key={key}
            focusable={true}
            onLayout={() => setScreenWidth(Dimensions.get('window').width)}
          >

            <Pressable onPress={Keyboard.dismiss} style={{ alignItems: "center", justifyContent: "center" }}>
              <Image source={require('../../assets/images/CAPP Connect.png')} style={{height: 300}} />
              <View style={{flex: 1, flexDirection: "column"}}>
                <View style={{flexDirection: "row", width: searchbarWidth/3 + 13, padding: 0, margin: 0, justifyContent: "space-between"}}>
                  {tabNames.map((tab, idx) => (
                    <TypeTab key={idx} name={tab} activeTab={searchType} setActiveTab={setSearchType} idx={idx} />
                  ))}
                </View>

                <AutoComplete tags={tags} setTags={setTags} searchType={searchType} search handleLayout={handleLayout} styles={{width: screenWidth*.9}} />
              </View>
            </Pressable>
          </SafeAreaView>
        </SafeAreaProvider>
        </KeyboardAwareScrollView>

      ) : (
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",

            }}
            key={key}
            focusable={true}
            onLayout={() => setScreenWidth(Dimensions.get('window').width)}
          >
            <Image source={require('../../assets/images/CAPP Connect.png')} style={{height: 300}} />
            <View style={{flex: 1, flexDirection: "column", marginLeft: -60}}>
              <View style={{flexDirection: "row", width: searchbarWidth/3 + 13, padding: 0, margin: 0, justifyContent: "space-between"}}>
              {tabNames.map((tab, idx) => (
                  <TypeTab key={idx} name={tab} activeTab={searchType} setActiveTab={setSearchType} idx={idx} />
                ))}
              </View>

              <AutoComplete tags={tags} setTags={setTags} searchType={searchType} search handleLayout={handleLayout} styles={{width: screenWidth*.8}} />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      )}

      </>
  );
}
