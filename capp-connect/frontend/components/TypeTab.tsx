import { View, Text, TouchableHighlight, StyleSheet} from "react-native";

interface TypeTabProps {
    // label: string;
    name: string;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    idx: number;
}


const styles = StyleSheet.create({
    tag:{
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 50,
        borderWidth: 2,


    },
    tagText: {
        fontSize: 16,
        color: '#000'
    },
});

const tabStyle = (idx: number, isActive: boolean) => ({
  backgroundColor: isActive ? "#fff" : "#888", // Active tab is white, inactive is grey
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  borderBottomWidth: isActive ? 0 : 2, // Remove bottom border for active tab
  borderColor: "black",
  paddingVertical: 12,
  paddingHorizontal: 32,
  marginLeft: idx !== 0 ? -20 : null, // Negative margin for overlap
  zIndex: isActive ? 2 : 1, // Active tab on top
  elevation: isActive ? 2 : 0, // For Android shadow
});


export default function TypeTab({ name, activeTab, setActiveTab, idx }: TypeTabProps) {
    const isActive = activeTab === name

    return (
        <TouchableHighlight
            style={[styles.tag, { backgroundColor: "grey" }, tabStyle(idx, isActive)]}
            onPress={() => {
              setActiveTab(name)
            }}
            // how the card changes when pressed
            activeOpacity={.6}
            underlayColor="#DDDDDD"
        >
            <View>
                <Text style={styles.tagText} adjustsFontSizeToFit={true} numberOfLines={1}>{name}</Text>
            </View>
        </TouchableHighlight>
    );
}
