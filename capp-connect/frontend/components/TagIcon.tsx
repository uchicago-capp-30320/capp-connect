import { View, Text, StyleProp, ViewStyle, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';

interface TagIconProps {
    tag: string;
    color: string;
    style: StyleProp<ViewStyle>;
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

export default function TagIcon({ tag, color, style }: TagIconProps) {
    return (
        <Pressable style={[styles.tag, { backgroundColor: color }, style]}>
            <SafeAreaView>
                <Text style={styles.tagText}>{tag}</Text>
            </SafeAreaView>
        </Pressable>
    );
}