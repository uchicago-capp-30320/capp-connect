import { Image, StyleProp, ImageStyle, Pressable, SafeAreaView } from "react-native";
import { router } from 'expo-router';

interface ProfilePhotoProps {
    style: StyleProp<ImageStyle>;
}

export default function ProfilePhoto({ style }: ProfilePhotoProps) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const profileImage = require('../assets/images/fakeprofile.png');

    return (
        <SafeAreaView>
            <Pressable onPress={() => router.navigate('/me')}>
                <Image
                    source={profileImage}
                    style={[style, { resizeMode: 'cover' }]}
                />
            </Pressable>
        </SafeAreaView>
    );
}
