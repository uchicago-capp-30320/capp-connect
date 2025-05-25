import { TouchableOpacity, Text, StyleSheet } from "react-native";
import fetchData from "@/utils/fetchdata";
import { deleteConfirmation, errorAlert } from "@/utils/alert";
import Colors from "@/themes/colors";
// import { useRouter } from "expo-router";

type Props = {
  username: string | undefined;
};

export default function ProfileDeleteButton({ username }: Props) {
  // const router = useRouter(); // use with login 1st page

  const handleDelete = () => {
    if (!username) {
      errorAlert("Unable to determine username.");
      return;
    }

    deleteConfirmation(async () => {
      try {
        const result = await fetchData(`/ccserver/profile/${username.toLowerCase()}/`, "DELETE", {});
        if (result.status === 204 || result.message === "No Content") {
          // router.replace("/(auth)/login"); // use with login 1st page
        } else {
          throw new Error("Unexpected response");
        }
      } catch (error) {
        console.error("Delete profile error:", error);
        errorAlert("Failed to delete profile. Please try again.");
      }
    });
  };

  return (
    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
      <Text style={styles.text}>Delete Profile</Text>
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
  deleteButton: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
