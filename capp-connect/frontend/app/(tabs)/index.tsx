import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import ProfilePhoto from '../../components/ProfilePhoto';
import SearchBar from '../../components/SearchBar';
import AutoComplete from "@/components/TagAutocomplete";
import { useState } from "react";

export default function Index() {
  const [ tags, setTags ] = useState<string[]>([]);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AutoComplete tags={tags} setTags={setTags}/>

        <SearchBar
          placeholder="Search..."
          style={{ marginVertical: 5
           }}
          color="gray"
        />

          <Text>This the home page</Text>


      </SafeAreaView>
    </SafeAreaProvider>
  );
}
