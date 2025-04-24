import {View, Text, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';

export default function Menu() {
    return (
        <SafeAreaProvider style={{backgroundColor:"white"}}>
            <Text>Navigation</Text>
            <Link href="/">
                <Text>Home</Text>
            </Link>
            <Link href="/profile">
                <Text>Profile</Text>
            </Link>
        </SafeAreaProvider>
    )
}