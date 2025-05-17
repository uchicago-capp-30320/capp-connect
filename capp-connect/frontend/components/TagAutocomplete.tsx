import Autocomplete from "react-native-autocomplete-input"
import { useState, useEffect, useRef } from "react"
import { View, Text, TextInput, Keyboard } from "react-native"
import TagIcon from "./TagIcon"
import { StyleSheet } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import createTagColorMapper from "@/utils/tagColorMapper"


const DATA = [
    "Greg",
    "Bob",
    "Julia",
    "Michelle",
    "Jim",
    "Freddy",
    "Billy",
    "Shantel",
    "Julius",
    "Jae",
    "Fanta",
    "Amber",
    "James",
    "Lee-Or",
    "Alison",
    "Paula",
    "Kiran"
]

// filter the tags based on the query
// should be updated to call from cache
function useFilteredData(query: string) {
    const [data, setData] = useState(DATA)

    useEffect(() => {
        if (query) {
            setData(DATA.filter(
                (item) => item.toLowerCase().includes(query.toLowerCase())
            ))
        } else {
            setData(DATA)
        }
    }, [query])

    return data
}

const fontSpecs = {
  fontSize: 16,
  fontFamily: 'System', // or your custom font
  fontWeight: '400' as const,
};


// create basic autocompleting tag that when submitted creates a tag in the search bar
function TagAutoComplete({usedTags, setTags, placeholder}: {usedTags: Array<string>, setTags: Function, placeholder: string}) {
    const [ query, setQuery ] = useState('');
    const [ hideRec, setHideRec ] = useState(true);
    const [inputKey, setInputKey] = useState(0);
    const [keyPressed, setKeyPressed] = useState('');


    const data = useFilteredData(query).filter(tag => !usedTags.includes(tag));

    //submit top choice
    const handleSubmit = () => {
        if (data.length > 0) {
            setTags([...usedTags, data[0]])
            setQuery('')
            setHideRec(true)
        }
    }

    // force remount by giving updating the key
    useEffect(() => {
        setInputKey(inputKey + 1)
    }, [usedTags])

    return (
        <Autocomplete
            key={inputKey}
            data={data}
            value={query}
            autoFocus={true}
            placeholder={placeholder}
            onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Backspace') {
                    // const removedTag = usedTags.slice(-1);
                    if (usedTags && query=="") {
                        setTags(usedTags.slice(0, -1))
                    }
                }
            }}

            onChangeText={(text) => {
                setQuery(text)
                setHideRec(!text)
            }}
            onSubmitEditing={handleSubmit}
            hideResults={hideRec}
            flatListProps={{
                keyExtractor: (_, idx) => String(idx),
                renderItem: ({ item }) => <Text>{item}</Text>,
            }}
            inputContainerStyle={{
                borderWidth:0,
                padding:0,
                elevation:0,
                backgroundColor: "transparent",
                borderColor: "transparent",
                outline: 'none',
                flex: 1
            }}
            style={{
                outline: "none", // gets rid of highlighting on web
                backgroundColor: "transparent",
                flex: 1
            }}
            containerStyle={{
                width: "100%",
                height: 50,
                flex: 1,
                minWidth: 50
            }}
        />
    )
}


// create a tag-based search bar
export default function TagSearch({tags, setTags, search}: {tags: string[], setTags: Function, search?: boolean}) {
     const colorMapper = createTagColorMapper()

    return (
        <View style={styles.textInput} >
            {search ? <FontAwesome size={15} name="search" color={"grey"} style={{}} />: null }
            {tags.map((tag) => (
                <TagIcon
                    key={tag}
                    tag={tag}
                    color={colorMapper(tag)}
                    style={{}}
                    deletable={true}
                    listSetter={setTags}
                    listToRemoveFrom={tags}
                />
            ))}
            <TagAutoComplete usedTags={tags} setTags={setTags} placeholder={search ? "Search...": ""}/>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        // flex: 1,
        flexDirection: "row",
        backgroundColor: "white",
        borderWidth: 2,

        bottom: 150,
        width: "80%",
        minWidth: 50,
        alignItems: "center",
        flexWrap: "wrap",
        minHeight: 50,
        maxHeight: 500,
        // flexGrow: 1
        overflow: "visible",

        borderColor: "#808080",
        paddingHorizontal: 10
    }
})
