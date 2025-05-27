import { TouchableHighlight, View, Text } from "react-native"
import {Colors, Containers, TextStyles} from "@/themes"
import { useRouter } from "expo-router";

export default function CreateNewPost() {

    return (
        <>
        <TouchableHighlight
            onPress={(() => {
                const router = useRouter();
                router.navigate("/newpost")
            })}
            underlayColor={Colors.buttonPressedSecondary}
            style={[Containers.buttons, {backgroundColor: Colors.tertiary, width: "50%"}]}>
            <Text style={TextStyles.buttonText}>New</Text>

        </TouchableHighlight>
        <View style={{paddingTop: 7, borderBottomWidth: 1}}></View>
        </>
    )
}
