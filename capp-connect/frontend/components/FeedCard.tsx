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

function wrapHTML(html: string) {
  return `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            word-break: break-word;
            white-space: pre-wrap;
            font-size: 16px;
          }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;
}


// The text box should take a key/label for the text box, as well as a current value
interface FeedCardProps {
    postID: string
    title: string
    body: string
    tags: Array<string>
    userID: string
}

// create Tag color mapper:
const getColorForTag = createTagColorMapper();

// create basic card for feed
// should update to remove tags that would surpass the screen width
export default function FeedCard({postID, userID, title, body, tags}: FeedCardProps) {
    const handleClick = () => {
        const router = useRouter()
        router.push(
            `/post?postID=${encodeURIComponent(postID)}&userID=${encodeURIComponent(userID)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&tags=${encodeURIComponent(tags.join(','))}`
        )
    }

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
            onPress={() => {handleClick()}}
            // how the card changes when pressed
            activeOpacity={.6}
            underlayColor={Colors.background}
            style={[Containers.container]}
            >

            <View style={[Containers.cards, styles.cardBackground]} >
                {/* create profile photo for poster */}
                <View style={{paddingBottom: 5}}>
                    <ProfilePhoto user={userID} style={styles.image}/>
                </View>
                {/* create title */}
                <View style={[styles.textTitleContainer, {paddingTop: 15}]}>
                    <Text style={styles.text}>{title}</Text>
                </View>
                {/* create text body */}
                <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <WebView source={{ html: wrapHTML(richBody) }} style={{ flex: 1, paddingTop: 15 }} />
                    <TouchableHighlight
                        onPress={() => {handleClick()}}
                        style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'transparent',
                        zIndex: 1,
                        cursor: 'pointer', // Only works on web
                        }}
                        activeOpacity={0.6}
                        underlayColor="transparent"
                    >
                        <View style={{ flex: 1 }} />
                    </TouchableHighlight>
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
