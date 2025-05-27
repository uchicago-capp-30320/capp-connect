import React, { useEffect } from 'react';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, Platform, KeyboardAvoidingView, Text, TouchableHighlight } from 'react-native';
// import MarkdownEditor from '@uiw/react-markdown-editor';
import RichTextEditor from '@/components/RichTextEditor'
import { Colors, Containers, TextStyles } from '@/themes';
import TagSearch from '@/components/TagSearch';
import fetchData from '@/utils/fetchdata';
import FeedTypeButton from '../components/FeedTypeButton'
import { router, Router } from 'expo-router';
import { getCachedData } from '@/utils/caching';


export default function NewPost() {
    const [title, setTitle] = useState("")
    const [postType, setPostType] = useState("General")
    const [body, setBody] = useState("")
    const [tags, setTags] = useState<string[]>(["Python"])
    // const [startTime, setStartTime] = useState<Date>(Date.UTC())
    const [buttonPressed, setButtonPressed] = useState(false)

    const handleSave = async () => {
        // require some content of the body
        if (title && body) {
            const post = {
                title: title,
                description: body,
                post_type: postType,
                tags: tags,
                links: "",
                start_time: "2025-05-26T22:48:00-05:00",
                location: ""
            }

            const resp = await fetchData(
                "http://127.0.0.1:8080/ccserver/posts/",
                "POST",
                post
            )

            const completePost = {
                ...post,
                ...resp
            }

            console.log(post)
            console.log(resp)

            const cachedData = await getCachedData("feed")

            cachedData["fullResults"]["All"] = [completePost, ...cachedData["fullResults"]["All"]]
            cachedData["fullResults"][postType] = [completePost, ...cachedData["fullResults"]["All"]]

            router.navigate("/feed")

        }
    }

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                {/* set post type */}
                <View style={{ flexDirection: "column", padding: 0}}>
                    <Text style={[TextStyles.subheading, {paddingBottom: 0, marginBottom: 0}]}>Set type</Text>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                        <FeedTypeButton label="General" name="General" feedButtonPressed={postType} setButton={setPostType}/>
                        <FeedTypeButton label="Events" name="Event" feedButtonPressed={postType} setButton={setPostType}  />
                        <FeedTypeButton label="Jobs" name="Job" feedButtonPressed={postType} setButton={setPostType}/>
                        <FeedTypeButton label="Projects" name="Project" feedButtonPressed={postType} setButton={setPostType} />
                    </View>
                </View>

                <View style={{ flexDirection: "column", padding: 0}}>
                    {/* add rich text editor for title and body */}
                    <View style={{width: "100%", alignSelf: "center", marginTop: 5, justifyContent: "center"}}>
                        <Text style={[TextStyles.subheading, {paddingBottom: 0, marginBottom: 0}]}>Title</Text>
                        <RichTextEditor editable={true} saveText={setTitle} style={{height: 120}} />
                    </View>
                    <View style={{width: "100%", alignSelf: "center", marginTop: 15, justifyContent: "center"}}>
                        <Text style={[TextStyles.subheading, {paddingBottom: 0, marginBottom: 0}]}>Body</Text>
                        <RichTextEditor editable={true} saveText={setBody} />
                    </View>
                    
                    {/* add tagging for posts */}
                    <View style={{width: "95%", alignSelf: "center",  marginTop: 15, justifyContent: "center"}}>
                        <Text style={[TextStyles.subheading, {paddingBottom: 5, marginBottom: 0}]}>Add tags</Text>
                        <TagSearch setTags={setTags} limit={5} searchType='Feed' placeholder='ML, Python, Urban Policy, etc...'/>
                    </View>

                    <View style={{width: "100%", marginTop: 110}}>
                        <TouchableHighlight
                            onPress={async () => {await handleSave()}}
                            style={[Containers.buttons, {width: "80%"}]}
                            underlayColor={Colors.buttonPressed}
                            onPressIn={() => setButtonPressed(true)}
                            onPressOut={() => setButtonPressed(false)}
                        >
                            
                            <View style={{flex: 1, padding: 15, alignItems: "center", width: "100%"}} >
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
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
  );
};