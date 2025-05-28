import { View, Text, TouchableHighlight, ViewStyle } from "react-native";
import { useEffect } from "react";
import { Colors, Containers} from "@/themes"
import fetchData from '../utils/fetchdata';
import Search from "@/utils/search";

interface SearchButtonProps {
  tags: string[];
  searchType: "Directory"|"Resources"|"Feed";
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
  // get data
    useEffect(() => {
      async function fetchFeed() {
        if (USE_REAL_DATA) {
          const data = await fetchData(searchBarMap[searchType], "GET", {tags: tags})
          console.log(data)
        }
      }
      fetchFeed();
    }, []);

    return (
        <TouchableHighlight
            onPress={() => {
              Search(tags, searchType)
            }}
            style={[Containers.buttons, styles]}
            underlayColor={Colors.buttonPressed}
        >
            <View style={{flex: 1, justifyContent: "center", alignItems:"center", padding: 15}} >
                <Text>Search</Text>
            </View>
        </TouchableHighlight>
    )

}
