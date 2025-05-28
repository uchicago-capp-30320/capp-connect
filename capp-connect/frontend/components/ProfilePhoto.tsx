import React, { useState, useEffect } from "react";
import { Image, StyleProp, ImageStyle, Pressable, SafeAreaView } from "react-native";
import { router } from 'expo-router';
import { getPhotoUrlUser } from "@/utils/currentUser";


interface ProfilePhotoProps {
    style: StyleProp<ImageStyle>;
    user: string;
    imageUrl?: string;
}

export default function ProfilePhoto({ style, user, imageUrl }: ProfilePhotoProps) {
    const [url, setURL] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImage() {
            const url = await getPhotoUrlUser(user);
            setURL(url && url.trim().length > 0 ? url : null);
        }

        if (!imageUrl) {
            fetchImage();
        } else {
            setURL(imageUrl)
        }
    }, [user]);


    if (!imageUrl) return null;

    return (
        <SafeAreaView>
            <Pressable onPress={() => { console.log(user); router.navigate('/me'); }}>
                <Image
                    source={url ? { uri: url } : undefined}
                    resizeMode="cover"
                    style={style}
                />
            </Pressable>
        </SafeAreaView>
    );
}
