import { Pressable, Image, StyleSheet } from "react-native";
import { router, useRouter } from 'expo-router';

export default function ProfilePhoto() {
    return (
            <Pressable onPress={() => router.navigate('/(tabs)/profile')}>
                <Image source={
                    require('../assets/images/fakeprofile.png')} 
                    style={[styles.image, {resizeMode: 'cover'}]}
                />
            </Pressable>
    )
}

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        top: 30,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2
    }
})