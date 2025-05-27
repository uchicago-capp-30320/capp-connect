import Colors from "./colors";
import { StyleSheet } from "react-native";

const Text = StyleSheet.create({
    heading: {
        color: "#000000",
        fontSize: 32,
        fontWeight: "bold" ,
        alignSelf: "center",
        paddingBottom: 10,
        paddingTop: 10
    },
    subheading: {
        color: "#000000",
        fontSize: 20,
        // fontWeight: "bold" ,
        alignSelf: "center",
        paddingBottom: 10,
        paddingTop: 10
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        // fontWeight: "bold" ,
        alignSelf: "center",
        paddingBottom: 10,
        paddingTop: 10
    },
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
