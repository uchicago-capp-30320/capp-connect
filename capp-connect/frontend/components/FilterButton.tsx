import { Pressable, Text, StyleProp, ViewStyle, SafeAreaView, StyleSheet } from "react-native";

interface FilterButton {
    onPress: () => void;
    label: string;
    style?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    textColor?: string;
}

export default function ActionButton({
    onPress,
    label,
    style,
    backgroundColor = "#3b82f6",
    textColor = "white"
}: FilterButton) {
    return (
        <SafeAreaView>
            <Pressable
                onPress={onPress}
                style={[styles.button, { backgroundColor }, style]}
            >
                <Text style={[styles.text, { color: textColor }]}>
                    {label}
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
    },
});
