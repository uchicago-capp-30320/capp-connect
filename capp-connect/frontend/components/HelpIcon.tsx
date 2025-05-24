import { StyleProp, Text, ViewStyle, View, SafeAreaView, Pressable } from "react-native";
import { useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from "react";
import { Colors } from "@/themes";
import Tooltip from 'react-native-walkthrough-tooltip';
import { usePathname } from "expo-router";

interface HelpIconProps {
    style: StyleProp<ViewStyle>;
}

const TOOLTIPS: Record<string, string> = {
    "/": `\nWelcome to CAPP Connect!\n\nThis is the home page. From here you can search for information across the app, specifically you can search content in the 'Directory', 'Resources', and 'Feed' pages. Choose a tab to select what kind of content you are looking for.`,
    "/directory": `\nWelcome to the Directory page!\n\nHere you can explore CAPP students and alumni who have signed up for CAPP Connect. Click on any profile to learn more, including skills, interests, job title, and organization.`,
    "/resources": `\nWelcome to the Resources page!\n\nHere you can explore CAPP resources like the CAPP elective sheet or CAPP salary sheet. This page serves as a central location for your CAPP-related info needs.`,
    "/feed": `\nWelcome to Feed page!\n\nHere you can view posts made on Slack and on CAPP Connect. Posts are categorized as General, Events, Jobs, and Projects.`

}

export default function HelpIcon({style}: HelpIconProps) {
    const [visible, setVisible] = useState(false);
    const pathName = usePathname()

    return (
        <SafeAreaView>
            <Tooltip
                isVisible={visible}
                content={<Text>{TOOLTIPS[pathName]}</Text>}
                placement="bottom"
                onClose={() => setVisible(false)}
                contentStyle={{width: 200}}
            >
            <Pressable onPress={() => setVisible(true)}>
                <View style={[style, { alignItems: "center", justifyContent:"center", alignContent: "center"}]}>
                    <FontAwesome
                        size={28}
                        name="info"
                        color={Colors.secondary}
                    />
                </View>
            </Pressable>
            </Tooltip>
        </SafeAreaView>
    )
}
