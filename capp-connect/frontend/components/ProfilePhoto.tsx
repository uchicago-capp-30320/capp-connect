import { Image, StyleProp, ImageStyle, Pressable, SafeAreaView } from "react-native";
import { router } from 'expo-router';

interface ProfilePhotoProps {
    style: StyleProp<ImageStyle>;
    user: string
}

export default function ProfilePhoto({ style, user }: ProfilePhotoProps) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const profileImage = require('../assets/images/fakeprofile.png');

    return (
        <SafeAreaView>
            <Pressable onPress={() => {console.log(user); router.navigate('/me')}}>
                <Image
                    source={profileImage}
                    resizeMode="cover"
                    style={style}
                />
            </Pressable>
        </SafeAreaView>
    );
}
