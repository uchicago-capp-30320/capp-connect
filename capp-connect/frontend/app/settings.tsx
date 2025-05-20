import { Text, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import ProfilePhoto from '../components/ProfilePhoto'

export default function Index() {
  return (
      <SafeAreaProvider
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Square />

        <Text>This is the User Profile page.</Text>
      </SafeAreaProvider>
  );
}

const Square = () => {
  return <SafeAreaView style={styles.square} />
}

const styles = StyleSheet.create({
  square: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
});
