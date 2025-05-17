import { Text, View, StyleProp, ViewStyle, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faX} from '@fortawesome/free-solid-svg-icons/faX'

interface TagIconProps {
    tag: string;
    color: string;
    style: StyleProp<ViewStyle>;
    deletable: boolean;
    listSetter?: Function;
    listToRemoveFrom?: Array<string>
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

export default function TagIcon({ tag, color, style, deletable, listSetter, listToRemoveFrom }: TagIconProps) {
    return (
        <Pressable style={[styles.tag, { backgroundColor: color }, style]}>
            <SafeAreaView style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.tagText}>{tag}</Text>
                {deletable ?
                    <Pressable
                        onPress={() => {
                            if (listSetter && listToRemoveFrom) {
                                listSetter(listToRemoveFrom.filter(item => item != tag))
                            }
                        }}
                    >
                        <FontAwesomeIcon size={10} icon={faX} color={"black"} style={{ paddingLeft: 5 }} />

                    </Pressable>
                : null}



            </SafeAreaView>
        </Pressable>
    );
}
