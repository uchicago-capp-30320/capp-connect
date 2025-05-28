import { Text, StyleProp, ViewStyle, Pressable, SafeAreaView, StyleSheet, TouchableHighlight } from 'react-native';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons/faX'
import Search from '@/utils/search';
import {Animated} from 'react-native';

interface TagIconProps {
    tag: string;
    color: string;
    style?: StyleProp<ViewStyle>;
    deletable?: boolean;
    listSetter?: (tags: string[]) => void;
    listToRemoveFrom?: Array<string>
    setSearching?: (val: boolean) => void
    searchType?: "Directory" | "Resources" | "Feed";
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

export default function TagIcon({ tag, color, style, deletable, listSetter, listToRemoveFrom, setSearching, searchType }: TagIconProps) {
    // animation logic got from chatgpt
    const scale = React.useRef(new Animated.Value(1)).current;

    const pulse = () => {
    Animated.sequence([
        Animated.timing(scale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
        }),
        Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        }),
    ]).start();
    };

    return (
        <TouchableHighlight 
            onPress={() => {
                if (searchType) {
                    pulse();
                    Search([tag], searchType)
                }
            }}
            underlayColor={"grey"}
            
            
            style={[styles.tag, { backgroundColor: color }, style]}>
                <Animated.View style={{ transform: [{ scale }]  }}>
            <SafeAreaView style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.tagText}>{tag}</Text>
                {deletable ?
                    <Pressable
                        onPress={() => {
                            if (listSetter && listToRemoveFrom) {
                                listSetter(listToRemoveFrom.filter(item => item != tag))
                            }
                            if (setSearching) {
                                setSearching(false)
                            }
                        }}
                    >
                        
                            <FontAwesomeIcon size={10} icon={faX} color={"black"} style={{ paddingLeft: 5 }} />
                        
                    </Pressable>
                : null}
            </SafeAreaView>
            </Animated.View>
        </TouchableHighlight>
    );
}
