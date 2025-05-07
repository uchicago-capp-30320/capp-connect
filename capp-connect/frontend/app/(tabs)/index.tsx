import { RefreshControl, ScrollView, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProfilePhoto from '../../components/ProfilePhoto';
import SearchBar from '../../components/SearchBar';

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

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
