import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import * as Device from 'expo-device';
import ProfilePhoto from "./ProfilePhoto";
import TagIcon from "./TagIcon";
import createTagColorMapper from "../utils/tagColorMapper"
import { useRouter } from "expo-router";
import { Colors, Containers} from "@/themes";
import { toHTML } from "slack-markdown";
import { WebView } from 'react-native-webview';
import { useState } from "react";


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

// had help from chatgpt to get html right
function wrapHTML(html: string, maxLines: number = 4) {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-size: 16px;
            line-height: 1.4;
            max-height: ${maxLines * 1.4}em;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: ${maxLines};
            -webkit-box-orient: vertical;
            word-break: break-word;
            white-space: pre-wrap;
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
    searchType: "Directory" | "Resources" | "Feed"
}

// create Tag color mapper:
const getColorForTag = createTagColorMapper();

// create basic card for feed
// should update to remove tags that would surpass the screen width
export default function FeedCard({postID, userID, title, body, tags, searchType}: FeedCardProps) {
    const [webViewHeight, setWebViewHeight] = useState(0);

    const injectedJavaScript = `
        setTimeout(function() {
        window.ReactNativeWebView.postMessage(
            Math.min(document.body.scrollHeight, ${1.4 * 4 * 16}) // max 4 lines
        );
        }, 100);
        true;
    `;
    const handleClick = () => {
        const router = useRouter()
        router.push(
            `/post?postID=${encodeURIComponent(postID)}&userID=${encodeURIComponent(userID)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&tags=${encodeURIComponent(tags.join(','))}&searchType=${encodeURIComponent(searchType)}`
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
                    <View style={{ height: webViewHeight || undefined }}>
                        <WebView
                            source={{ html: wrapHTML(richBody, 4) }}
                            injectedJavaScript={injectedJavaScript}
                            onMessage={event => {
                            const height = parseInt(event.nativeEvent.data);
                            setWebViewHeight(height);
                            }}
                            scrollEnabled={false}
                            style={{ width: '100%', backgroundColor: 'transparent' }}
                        />
                    </View>
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
                        <TagIcon key={index} tag={tag} color={getColorForTag(tag)} style={{}} deletable={false} searchType={searchType}/>
                    ))}
                </View>
            </View>
        </TouchableHighlight>
    )
}
