import React, { useState, useEffect } from "react";
import { Image, StyleProp, ImageStyle, Pressable, SafeAreaView } from "react-native";
import { router } from 'expo-router';
import { getPhotoUrlUser } from "@/utils/currentUser";

interface ProfilePhotoProps {
    style: StyleProp<ImageStyle>;
    user: string;
}

export default function ProfilePhoto({ style, user }: ProfilePhotoProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImage() {
            const url = await getPhotoUrlUser(user);
            setImageUrl(url && url.trim().length > 0 ? url : null);
        }
        fetchImage();
    }, [user]);

    if (!imageUrl) return null;

    return (
        <SafeAreaView>
            <Pressable onPress={() => { console.log(user); router.navigate('/me'); }}>
                <Image
                    source={{ uri: imageUrl }}
                    resizeMode="cover"
                    style={style}
                />
            </Pressable>
        </SafeAreaView>
    );
}
