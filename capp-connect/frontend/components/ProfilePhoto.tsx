import React, { useState, useEffect } from "react";
import { Image, StyleProp, ImageStyle, Pressable, SafeAreaView } from "react-native";
import { router } from 'expo-router';
import { getPhotoUrlUser } from "@/utils/currentUser";

interface ProfilePhotoProps {
    style: StyleProp<ImageStyle>;
    user: string
}

export default function ProfilePhoto({ style, user }: ProfilePhotoProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fallbackImage = require('../assets/images/fakeprofile.png');

    useEffect(() => {
        async function fetchImage() {
          const url = await getPhotoUrlUser(user);
          if (url && url.trim().length > 0) {
            setImageUrl(url);
          } else {
            setImageUrl(null);
          }
        }
        fetchImage();
      }, [user]);

    return (
        <SafeAreaView>
            <Pressable onPress={() => {console.log(user); router.navigate('/me')}}>
                <Image
                    source={imageUrl ? { uri: imageUrl } : fallbackImage}
                    resizeMode="cover"
                    style={style}
                />
            </Pressable>
        </SafeAreaView>
    );
}
