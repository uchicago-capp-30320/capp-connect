import { View, Text} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";
import TagIcon from "@/components/TagIcon";
import createTagColorMapper from "../utils/tagColorMapper"

/* eslint-disable no-redeclare, @typescript-eslint/no-redeclare -- type Post exists only temporarily, will be renamed */
type Post = { // This shares a name with the function at line 18. Doesn't seem to be used?
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
