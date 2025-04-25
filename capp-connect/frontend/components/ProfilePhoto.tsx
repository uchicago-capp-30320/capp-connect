import { Image, StyleProp, ImageStyle, Pressable, SafeAreaView } from "react-native";
import { router } from 'expo-router';

interface ProfilePhotoProps {
    style: StyleProp<ImageStyle>;
}

export default function ProfilePhoto({style}: ProfilePhotoProps) {
    return (
        <SafeAreaView>
            <Pressable onPress={() => router.navigate('/profile')}>
                <Image source={
                    require('../assets/images/fakeprofile.png')} 
                    style={[style, {resizeMode: 'cover'}]}
                />
            </Pressable>
        </SafeAreaView>
    )
}