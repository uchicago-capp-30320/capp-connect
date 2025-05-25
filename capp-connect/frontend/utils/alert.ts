import { Alert, Platform, Linking } from "react-native";

type AlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

// web
const alertFill = (title: string, message: string, buttons: AlertButton[]) => {
  const result = window.confirm([title, message].join("\n"));

  // choose button action
  if (result) {
    const confirmOption = buttons.find(({ style }) => style !== "cancel");
    confirmOption?.onPress?.();
  } else {
    const cancelOption = buttons.find(({ style }) => style === "cancel");
    cancelOption?.onPress?.();
  }
};

const alert = Platform.OS === "web" ? alertFill : Alert.alert;

// delete
export const deleteConfirmation = (onConfirm: () => void) => {
  alert(
    "Delete Profile",
    "Are you sure you want to delete your profile? This action cannot be undone",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onConfirm,
      },
    ]
  );
};

// logout
export const logoutConfirmation = (slackLogoutUrl: string) => {
  alert("Logout", "Are you sure you want to logout?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Logout",
      onPress: () => {
        if (Platform.OS === "web") {
          window.location.assign(slackLogoutUrl);
        } else {
          Linking.openURL(slackLogoutUrl);
        }
      },
    },
  ]);
};

// error
export const errorAlert = (message: string) => {
  alert("Error", message, [
    {
      text: "OK",
      onPress: () => console.log("Error alert dismissed"),
    },
  ]);
};

export default alert;
