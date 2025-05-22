import Autocomplete from "react-native-autocomplete-input"
import { useState, useEffect } from "react"
import { View, Text, NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native"
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
                (item) => item.toLowerCase().trim().includes(query.toLowerCase().trim())
            ))
        } else {
            setData(DATA)
        }
    }, [query])

    return data
}


// create basic autocompleting tag that when submitted creates a tag in the search bar
function TagAutoComplete({usedTags, setTags, placeholder}: {usedTags: Array<string>, setTags: (tags: string[]) => void, placeholder: string}) {
    const [ query, setQuery ] = useState('');
    const [ hideRec, setHideRec ] = useState(true);
    const [inputKey, setInputKey] = useState(0);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);

    const data = useFilteredData(query).filter(tag => !usedTags.includes(tag));

    //submit top choice
    const handleSubmit = () => {
        if (data.length > 0) {
            let index = 0
            if (isOpen) {
                index = highlightedIndex
            }
            // add tag to list
            setTags([...usedTags, data[index]])

            // reset query
            setQuery('')
            setHideRec(true)
            setHighlightedIndex(-1)
            setIsOpen(false)
        }
    }

    // allow user to navigate dropdown menu of recommendations with keys
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (usedTags && query=="") {
                setTags(usedTags.slice(0, -1))
            }
        }
        if (e.nativeEvent.key === 'Tab' || e.nativeEvent.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                setHighlightedIndex(0);
            } else {
                setHighlightedIndex((prevIndex) => (prevIndex + 1) % data.length);
            }
        } else if (e.nativeEvent.key === 'ArrowUp') {
            e.preventDefault();
            if (isOpen) {
                setHighlightedIndex((prevIndex) =>
                    prevIndex === 0 ? data.length - 1 : prevIndex - 1
                );
            }
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
            onKeyPress={(e) => handleKeyPress(e)}

            onChangeText={(text) => {
                setQuery(text)
                setHideRec(!text)
            }}
            onSubmitEditing={handleSubmit}
            hideResults={hideRec}
            flatListProps={{
                keyExtractor: (_, idx) => String(idx),
                renderItem: ({ item, index }) => (
                    <Text
                        style={[
                            {fontSize:16},
                            { backgroundColor: index === highlightedIndex ? '#e0e0e0' : 'transparent',}
                        ]}>
                            {item}
                    </Text>
                ),
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
export default function TagSearch({tags, setTags, search}: {tags: string[], setTags: (tags: string[]) => void, search?: boolean}) {
     const colorMapper = createTagColorMapper()

    return (
        <View style={styles.textInput} >
            {search ? <FontAwesome size={15} name="search" color={"#808080"} style={{}} />: null }
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
        overflow: "visible",

        borderColor: "#808080",
        paddingHorizontal: 10
    }
})
