import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import React from 'react';

interface feedButtonProps {
    label: string;
    name: string;
    setButton: (name: string) => void;
    feedButtonPressed: string;
}


const styles = StyleSheet.create({
    tag:{
        padding: 10,
        borderRadius: 20,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagText: {
        fontSize: 16,
        color: '#000',
    },
});

export default function feedButton({ label, name, feedButtonPressed, setButton }: feedButtonProps) {
    return (
        <TouchableHighlight
            style={[styles.tag, { backgroundColor: "grey" }]}
            onPress={() => {
                if (feedButtonPressed != name) {
                    console.log("you're pressing me! ", label)
                    console.log("current button pressed", feedButtonPressed)
                    setButton(name)
                }
            }}
            // how the card changes when pressed
            activeOpacity={.6}
            underlayColor="#DDDDDD"
        >
            <View>
                <Text style={styles.tagText}>{label}</Text>
            </View>
        </TouchableHighlight>
    );
}
