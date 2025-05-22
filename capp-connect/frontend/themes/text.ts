import Colors from "./colors";
import { StyleSheet } from "react-native";

const Text = StyleSheet.create({
    warning: {
        color: Colors.secondary,
        fontSize: 20,
        fontWeight: "bold" ,
        alignSelf: "center",
        paddingBottom: 10,
        paddingTop: 10
    },
    error: {
        color: Colors.error,
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
        paddingBottom: 20
    }
})

export default Text;