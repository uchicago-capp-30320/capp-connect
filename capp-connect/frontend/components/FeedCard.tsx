import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import * as Device from 'expo-device';
import ProfilePhoto from "./ProfilePhoto";
import TagIcon from "./TagIcon";
import createTagColorMapper from "../utils/tagColorMapper"
import { useRouter } from "expo-router";


// create conditional styling for desktop vs mobile
const CARD_HEIGHT = Device.deviceType === Device.DeviceType.DESKTOP ? 500: 350
const NUM_TEXT_LINES = Device.deviceType === Device.DeviceType.DESKTOP ? 10: 4
const PADDING = Device.deviceType === Device.DeviceType.DESKTOP ? 5: 5
const PROFILE_PHOTO_SIZE = Device.deviceType === Device.DeviceType.DESKTOP ? 90: 60

const BORDER_RADIUS = 5

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS,
        alignSelf:"center",
        height: CARD_HEIGHT,
        width: "100%",
        padding: PADDING
    },
    cardBackground: {
        height: "100%",
        width: "100%",
        backgroundColor: "grey",
        borderWidth: 1,
        borderRadius: BORDER_RADIUS,
        //Help getting shadow effect from ChatGPT. Prompt: I am creating a card in react for react native (expo). I want to create a shadow around it. How do i do that? Here is my card so far:
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        // Native shadow (optional, for mobile)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        padding: 15
    },
    textTitleContainer: {
        alignItems: "center"
    },
    textBodyContainer: {
        padding: 15,
        alignItems:"center"
    },
    text: {
        fontSize: 20
    },
    image: {
        width: PROFILE_PHOTO_SIZE,
        height: PROFILE_PHOTO_SIZE,
        borderRadius: 50,
        borderWidth: 1
    },
});


// The text box should take a key/label for the text box, as well as a current value
interface FeedCardProps {
    title: string
    body: string
    tags: Array<string>
}

// create Tag color mapper:
const getColorForTag = createTagColorMapper();

// create basic card for feed
// should update to remove tags that would surpass the screen width
export default function FeedCard({title, body, tags}: FeedCardProps) {
    return (
        <TouchableHighlight
            onPress={() => {
                const router = useRouter()
                router.push(
                    `/post?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&tags=${encodeURIComponent(tags.join(','))}`
                )
            }}
            // how the card changes when pressed
            activeOpacity={.6}
            underlayColor="#DDDDDD"
            style={styles.container}
            >

            <View style={styles.cardBackground} >
                {/* create profile photo for poster */}
                <View style={{paddingBottom: 5}}>
                    <ProfilePhoto style={styles.image}/>
                </View>
                {/* create title */}
                <View style={[styles.textTitleContainer, {paddingTop: 15}]}>
                    <Text style={styles.text}>{title}</Text>
                </View>
                {/* create text body */}
                <View style={styles.textBodyContainer}>
                    <Text
                        numberOfLines={NUM_TEXT_LINES}
                        style={styles.text}
                    >{body}</Text>
                </View>
                <View style={{
                    // flex:1,
                    flexDirection:"row",
                    position:"absolute",
                    bottom:10,
                    flexWrap: 'wrap',
                    }}
                >
                    {tags.map((tag, index) => (
                        <TagIcon key={index} tag={tag} color={getColorForTag(tag)} style={{}}/>
                    ))}
                </View>
            </View>
        </TouchableHighlight>
    )
}
