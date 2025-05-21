import { View, Text, StyleSheet, TouchableHighlight, ViewStyle } from "react-native";
import { useEffect, useState } from "react";
import { Colors, Containers} from "@/themes"
import fetchData from '../utils/fetchdata';


interface SearchButtonProps {
  tags: string[];
  searchType: string;
  styles?: ViewStyle;
}

const searchBarMap: Record<string, string> = {
  users: "",
  resources: "",
  posts: ""
}

const USE_REAL_DATA = false

// will update for production
export default function SearchButton({tags, searchType, styles}: SearchButtonProps) {
    useEffect(() => {
      async function fetchFeed() {
        if (USE_REAL_DATA) {
          const data = await fetchData(searchBarMap[searchType], "GET", {tags: tags})
          
        }
      }
      fetchFeed();
    }, []);
  
    return (
        <TouchableHighlight 
            onPress={() => {}}
            style={[Containers.buttons, styles]}
            underlayColor={Colors.buttonPressed}
        >
            <View style={{flex: 1, justifyContent: "center", alignItems:"center", padding: 15}} >
                <Text>Search</Text>
            </View>
        </TouchableHighlight>
    )

} 