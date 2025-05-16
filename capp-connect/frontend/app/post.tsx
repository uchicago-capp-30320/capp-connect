import { View, Text} from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../components/SearchBar';
import fetchData from '../utils/fetchdata';
import * as Device from 'expo-device'
import FeedTypeButton from '../components/FeedTypeButton'
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";
import TagIcon from "@/components/TagIcon";
import createTagColorMapper from "../utils/tagColorMapper"

type Post = {
  title: string;
  description: string;
  poster_name: string;
  post_type: string;
  tags: Array<string>;
};

// create Tag color mapper:
const getColorForTag = createTagColorMapper();

export default function Post() {
  const params = useLocalSearchParams();
  console.log(useLocalSearchParams())
  return (
    <SafeAreaProvider>
      <SafeAreaView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
        <View style={{flex: 1, alignItems:"center", padding: 10, width: "90%", height: "25%"}}>
          <Text style={{fontSize: 30}}>{params.title}</Text>
        </View>
        <View style={{flex: 1, alignItems: "center", bottom: 200, width: "80%", height: "50%"}}>
          <Text style={{fontSize: 20 }}>{params.body}</Text>
          <View style={{
            flex:1,
            flexDirection:"row",
            flexWrap: 'wrap',
            paddingTop: 30
            }}
        >
            {(typeof params.tags === "string" ? params.tags.split(",") : params.tags).map((tag, index) => (
                <TagIcon key={index} tag={tag} color={getColorForTag(tag)} style={{}}/>
            ))}
        </View>
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
