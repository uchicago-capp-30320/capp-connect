import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Colors, Containers } from "@/themes";

// note: ran in mobile & web & looks good for now
// also - ran with it as a tab
export default function NotAuthorized() {
 const router = useRouter();

 return (
   <SafeAreaProvider>
     <SafeAreaView style={styles.pageContainer}>
       <View style={[Containers.cards, styles.card, { alignItems: "center" }]}>
         <Text style={styles.title}>Not Authorized</Text>
         <TouchableHighlight
           style={styles.button}
           onPress={() => {
             router.replace("/"); // redirect to login page
           }}
         >
           <View style={styles.buttonContent}>
             <Text style={styles.buttonText}>Return</Text>
           </View>
         </TouchableHighlight>
       </View>
     </SafeAreaView>
   </SafeAreaProvider>
 );
}


const styles = StyleSheet.create({
 pageContainer: {
   flex: 1,
   justifyContent: "center",
   alignSelf: "center",
   backgroundColor: Colors.background,
   padding: 20,
 },
 card: {
   width: "100%",
   maxWidth: 500,
   padding: 30,
 },
 title: {
   fontSize: 45,
   fontWeight: "bold",
   color: Colors.primary,
   marginBottom: 20,
 },
 button: {
   backgroundColor: Colors.secondary,
   paddingVertical: 12,
   paddingHorizontal: 30,
   borderRadius: 8,
   marginTop: 10,
 },
 buttonText: {
   color: Colors.text,
   fontSize: 30,
   fontWeight: "500",
 },
 buttonContent: {
   alignSelf: "center",
   padding: 15,
 },
});
