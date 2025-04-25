import { RefreshControl, ScrollView, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProfilePhoto from '../../components/ProfilePhoto';

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
          <Text>This is the resources page.</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
