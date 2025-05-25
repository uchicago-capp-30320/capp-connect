import { Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/themes/colors";

// note: tested as a tab -- needs to be put as home start page

export default function SignIn() {
 const slackAuthUrl =
   "https://capp-connect.unnamed.computer/auth/login/slack/";

 const handleSlackSignIn = () => {
   Linking.openURL(slackAuthUrl);
 };

 return (
   <SafeAreaView style={styles.container}>
      {/* // not working - will ask in morning about images
      <Image
        source={require("../assets/images/capp_connect_splash_icon.png")}
        style={styles.logo}
      /> 
      */}

     <Text style={styles.description}>
        Connect with Students and Alumni of the University of Chicago&apos;s CAPP Program
     </Text>

     <TouchableOpacity style={styles.slackButton} onPress={handleSlackSignIn}>
       <Image
         source={{ uri: "https://platform.slack-edge.com/img/sign_in_with_slack.png" }}
         style={styles.slackLogo}
         resizeMode="contain"
       />
     </TouchableOpacity>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: Colors.background,
   justifyContent: "center",
   alignItems: "center",
 },
 logo: {
   width: 500,
   height: 400,
   marginBottom: 10,
 },
 description: {
   fontSize: 20,
   color: Colors.primary,
   textAlign: "center",
   marginBottom: 30,
 },
 slackButton: {
   backgroundColor: "#4A154B",
   borderRadius: 8,
   paddingVertical: 10,
   paddingHorizontal: 16,
 },
 slackLogo: {
   width: 200,
   height: 40,
 },
});
