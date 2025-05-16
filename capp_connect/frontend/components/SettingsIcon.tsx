import { Image, StyleProp, TextStyle, Pressable, SafeAreaView } from "react-native";
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from "react";

interface SettingsIconProps {
    style: StyleProp<TextStyle>;
    color: string
}

export default function SettingsIcon({style, color}: SettingsIconProps) {
    return (
        <SafeAreaView>
            <Pressable onPress={() => router.navigate('/settings')}>
                <FontAwesome size={28} name="gear" color={color} style={[style]}/>
            </Pressable>
        </SafeAreaView>
    )
}
