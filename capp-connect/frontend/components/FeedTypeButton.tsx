import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from '@/themes';

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
        width: 100
    },
    tagText: {
        fontSize: 16,
        color: '#000',
    },
});

export default function feedButton({ label, name, feedButtonPressed, setButton }: feedButtonProps) {
    return (
        <TouchableHighlight
            style={
                [styles.tag, 
                    (feedButtonPressed == name ? 
                        { backgroundColor: Colors.buttonPressed } : 
                        { backgroundColor: Colors.secondary })
                ]}
            onPress={() => {
                if (feedButtonPressed != name) {
                    // console.log("you're pressing me! ", label)
                    // console.log("current button pressed", feedButtonPressed)
                    setButton(name)
                }
            }}
            // how the card changes when pressed
            activeOpacity={.6}
            underlayColor="#DDDDDD"
        >
            <View>
                <Text style={
                    [styles.tagText,
                    (feedButtonPressed == name ? 
                        { color: "white" } : 
                        { color: "black" })
                ]}
                >{label}</Text>
            </View>
        </TouchableHighlight>
    );
}
