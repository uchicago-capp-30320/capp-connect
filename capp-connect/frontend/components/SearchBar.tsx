import React from "react";
import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#808080",
      paddingHorizontal: 10,
      height: 40,
      backgroundColor: "#FFFFFF"
    },
    icon: {
      marginRight: 5,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: "#555555",
    },
  });

interface SearchBarProps {
  placeholder: string;
  style: StyleProp<ViewStyle>;
  color: string;
}

export default function SearchBar({placeholder, style, color}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      <FontAwesome size={15} name="search" color={color} style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
}