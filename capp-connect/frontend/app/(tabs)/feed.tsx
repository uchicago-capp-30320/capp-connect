import { RefreshControl, ScrollView, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProfilePhoto from '../../components/ProfilePhoto';
import TagIcon from "../../components/TagIcon";

export default function Feed() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

          <Text>This is the feed</Text>


      </SafeAreaView>
    </SafeAreaProvider>
  );
}
