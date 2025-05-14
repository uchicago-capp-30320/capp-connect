import Colors from "./colors";
import { StyleSheet } from "react-native";
import * as Device from 'expo-device';

// create conditional styling for desktop vs mobile
const CARD_HEIGHT = Device.deviceType === Device.DeviceType.DESKTOP ? 500: 350
const PADDING = Device.deviceType === Device.DeviceType.DESKTOP ? 5: 5
const BORDER_RADIUS = 5

const Containers = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS,
        alignSelf:"center",
        height: CARD_HEIGHT,
        width: "100%",
        padding: PADDING
    },
    cards: {
        backgroundColor: Colors.cardBackground,
        borderWidth: 1,
        borderRadius: BORDER_RADIUS,
        padding: 15,
        //Help getting shadow effect from ChatGPT. Prompt: I am creating a card in react for react native (expo). I want to create a shadow around it. How do i do that? Here is my card so far:
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        // Native shadow (optional, for mobile)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttons: {
        backgroundColor: Colors.secondary
    },
    textFields: {
        backgroundColor: Colors.textFieldBackground
    }
})

export default Containers;