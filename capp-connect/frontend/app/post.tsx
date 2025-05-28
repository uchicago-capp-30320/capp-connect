import { View, Text, StyleSheet, TouchableHighlight,ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";
import createTagColorMapper from "../utils/tagColorMapper"
import { useEffect, useState } from "react";
import fetchData from "@/utils/fetchdata";
import RichTextEditor from "@/components/RichTextEditor";
import { FlashList } from "@shopify/flash-list";
import * as Device from 'expo-device'
import { Colors, Containers } from "@/themes";
import { toHTML } from "slack-markdown";
import { WebView } from 'react-native-webview';
import ProfilePhoto from "@/components/ProfilePhoto";
import TagCarousel from "@/components/TagCarousel";


type Comment = {
  user: string
  comment_text: string
}

// const DATA: Comment[] = [
//   {user: "bob", comment_text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
//   {user: "sara", comment_text: "bye"},
//   {user: "bob", comment_text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
//   {user: "sara", comment_text: "bye"}
// ]

// create Tag color mapper:
const getColorForTag = createTagColorMapper();

// create function
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

export default function Post() {
  const params = useLocalSearchParams();
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [buttonPressed, setButtonPressed] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

   useEffect(() => {
      async function fetchComments() {
        const data = await fetchData(
            `http://127.0.0.1:8080/ccserver/posts/${params.postID}/comments/`,
            "GET",
            {}
        )
        setComments(data)
      }
      fetchComments()
    }, []);

  let richBody: string;

  // if title is general, project, event, or job "from slack", convert it to html
  if (
    !params.title ||
    (
      typeof params.title === "string" &&
      (["general", "project", "event", "job"]).some(type =>
        (params.title as string).toLowerCase().includes(`${type} from slack`)
      )
    )
  ) {
      const bodyStr = Array.isArray(params.body) ? params.body.join(", ") : params.body;
      richBody = toHTML(bodyStr);
  } else {
      richBody = Array.isArray(params.body) ? params.body.join(", ") : params.body;
  }

  const handleSave = async () => {
    const resp = await fetchData(
                    `http://127.0.0.1:8080/ccserver/posts/${params.postID}/comments/`,
                    "POST",
                    {comment_text: newComment}
                )

    setComments([resp, ...comments])
    // force remount to clear editor after save
    setEditorKey(editorKey + 1)
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ScrollView style={{width: "100%"}}>
          <View style={{flex: 1, flexDirection: "column", alignItems: "center", width: "95%", alignSelf: "center"}}>
            <View style={{alignItems:"center", padding: 10, width: "90%"}}>
              <Text style={{fontSize: 30}}>{params.title}</Text>
            </View>


              <View style={{ paddingTop: 10, minHeight: "10%", width: "95%"}}>
                <WebView source={{ html: wrapHTML(richBody) }} style={{ flex: 1, minHeight: 250 }} />
              </View>

              <View style={{width: "100%"}}>

                {params.tags ?
                  <TagCarousel
                    searchType={
                      ["Directory", "Resources", "Feed"].includes(String(params.searchType))
                        ? String(params.searchType) as "Directory" | "Resources" | "Feed" // Replace 'any' with 'SearchType' if imported
                        : "Directory" // or another default valid SearchType value
                    }
                    style={{alignSelf: "center", width: "auto", minWidth: 100}}
                    tags={
                      (typeof params.tags === "string"
                        ? params.tags.split(",").map(tag => ({
                            name: tag.trim(),
                            color: getColorForTag(tag.trim())
                          }))
                        : params.tags.map(tag => ({
                            name: tag.trim(),
                            color: getColorForTag(tag.trim())
                          }))
                      )
                    }
                  />
                  :
                  null
                }
              </View>
            <View style={{  minHeight: 150, width: "100%", flexDirection: "column", paddingBottom: 50 }}>
                <RichTextEditor key={editorKey} editable={true} saveText={setNewComment} style={{width: "100%", flex: 1}}/>
                <View style={{paddingTop: 20}}>
                  <TouchableHighlight
                      onPress={async () => {await handleSave()}}
                      style={[Containers.buttons, {width: "80%"}]}
                      underlayColor={Colors.buttonPressed}
                      onPressIn={() => setButtonPressed(true)}
                      onPressOut={() => setButtonPressed(false)}
                  >

                      <View style={{padding: 15, alignItems: "center", width: "100%"}} >
                          <Text style={
                              (
                                  buttonPressed ?
                                  {color: "white"} :
                                  {color: "black"}
                              )
                          }>Save</Text>
                      </View>
                  </TouchableHighlight>
              </View>
            </View>
            <View style={{ height: "50%", width: "95%"}}>
                <FlashList
                  renderItem={({item}) => {
                    return <CommentCard user={item.user} body={item.comment_text} />
                  }}

                  data={comments}
                  estimatedItemSize={200} />
            </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const PROFILE_PHOTO_SIZE = Device.deviceType === Device.DeviceType.DESKTOP ? 50: 40

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

function CommentCard({user, body}: {user: string, body: string}) {
  return (
    <View style={[Containers.cards, {flex: 1, minHeight: 50, maxHeight: 200, flexDirection: "row", margin: 5}]}>
      {/* create profile photo for poster */}
      <View style={{paddingBottom: 5}}>
          <ProfilePhoto user={user} style={styles.image}/>
      </View>
      <View style={{flex: 1, marginLeft: 50, justifyContent: "center", flexGrow: 2}}>
        <WebView source={{ html: wrapHTML(toHTML(body)) }} style={{ flex: 1 }} />
      </View>
    </View>
  )
}
