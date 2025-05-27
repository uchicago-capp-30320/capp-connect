import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { logoutConfirmation } from "@/utils/alert";
import Colors from "@/themes/colors";

export default function LogoutButton() {
  const slackLogoutUrl = "https://capp-connect.unnamed.computer/accounts/logout/";

  const handleLogout = () => {
    logoutConfirmation(slackLogoutUrl);
  };

  return (
    <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 0.45,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
