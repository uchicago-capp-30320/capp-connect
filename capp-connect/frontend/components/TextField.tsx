import { Text, TextInput, StyleProp, TextStyle, SafeAreaView } from "react-native";
import React from "react";

// The text field should take a key/label for the text box, as well as a current value
interface TextFieldProps {
    label: string
    dataKey: string
    data: Map<string, string>
    updateData: Function
    editMode: boolean
    style: StyleProp<TextStyle>;
}


export default function TextField(props: TextFieldProps) {
    // create text box to represent a current state of information that can be editable as determined by the editMode prop
    // see here for relevant documentation: https://reactnative.dev/docs/textinput
    let newData = new Map(props.data)
    const [text, changeText] = React.useState(props.data.get(props.dataKey) || "")

    return (
        <SafeAreaView>
            <Text style={{alignContent: "center"}}>{props.label}</Text>
            <TextInput
            editable={props.editMode}
            style={props.style}
            value={text}
            onChangeText={(newText) => {changeText(newText); newData.set(props.dataKey, newText); props.updateData(newData)}}
            enterKeyHint="done"
            // allows for the keyboard to be opened to a setup that more easily allows the input of email addresses
            inputMode={props.dataKey === "email" ? "email": "text"}
            />
        </SafeAreaView>
    )
}
