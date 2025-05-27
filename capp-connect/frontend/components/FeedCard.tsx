import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import * as Device from 'expo-device';
import ProfilePhoto from "./ProfilePhoto";
import TagIcon from "./TagIcon";
import createTagColorMapper from "../utils/tagColorMapper"
import { useRouter } from "expo-router";
import { Colors, Containers} from "@/themes";
import { toHTML } from "slack-markdown";
import { WebView } from 'react-native-webview';


// create conditional styling for desktop vs mobile
const PROFILE_PHOTO_SIZE = Device.deviceType === Device.DeviceType.DESKTOP ? 90: 60
// const NUM_TEXT_LINES = Device.deviceType === Device.DeviceType.DESKTOP ? 10: 4

const styles = StyleSheet.create({
    cardBackground: {
        height: "100%",
        width: "100%",
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
    let richBody: string;

    // if title is general, project, event, or job "from slack", convert it to html
    if (!title || (["general", "project", "event", "job"]).some(type => title.toLocaleLowerCase().includes(`${type} from slack`)) ) {
        richBody = toHTML(body);
    } else {
        richBody = body;
    }
    return (
        <TouchableHighlight
        // on press route to the post page with this post's content
            onPress={() => {
                const router = useRouter()
                router.push(
                    `/post?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&tags=${encodeURIComponent(tags.join(','))}`
                )
            }}
            // how the card changes when pressed
            activeOpacity={.6}
            underlayColor={Colors.background}
            style={[Containers.container]}
            >

            <View style={[Containers.cards, styles.cardBackground]} >
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
                    <WebView  source={{ html: richBody }} />
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
                        <TagIcon key={index} tag={tag} color={getColorForTag(tag)} style={{}} deletable={false}/>
                    ))}
                </View>
            </View>
        </TouchableHighlight>
    )
}
