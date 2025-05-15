import Autocomplete from "react-native-autocomplete-input"
import { useState, useEffect, useRef } from "react"
import { View, Text, TextInput, Keyboard } from "react-native"
import TagIcon from "./TagIcon"
import { StyleSheet } from "react-native"

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
    "James"
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

// create basic autocompleting tag that when submitted creates a tag in the search bar
function TagAutoComplete({onTagSelected, usedTags}: {onTagSelected: Function, usedTags: Array<string>}) {
    const [ query, setQuery ] = useState('');
    const [ hideRec, setHideRec ] = useState(true);
    const [inputKey, setInputKey] = useState(0);

    const data = useFilteredData(query).filter(tag => !usedTags.includes(tag));  

    //submit top choice
    const handleSubmit = () => {
        if (data.length > 0) {
            onTagSelected(data[0])
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
            placeholder="Search..."

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
                backgroundColor: "purple",
                flex: 1
            }}     
            containerStyle={{
                width: "100%",
                height: "100%"
            }}
        />
    )
}


// create a tag-based search bar
export default function TagSearch() {
    const [ tags, setTags ] = useState<string[]>([]);

    const handleTagSelected = (tag: string) => {
        setTags([...tags, tag]);
    }

    return (
        <View style={styles.textInput} >
            {tags.map((tag) => (
                <TagIcon 
                    key={tag} 
                    tag={tag} 
                    color="red" 
                    style={{}} 
                    deletable={true}
                    listSetter={setTags} 
                    listToRemoveFrom={tags}
                />
            ))}
            <TagAutoComplete onTagSelected={handleTagSelected} usedTags={tags}/>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        flex: 1, 
        flexDirection: "row", 
        backgroundColor: "white", 
        borderWidth: 2,
        maxHeight: 70, 
        bottom: 150,
        width: "50%",
        alignItems: "center",
        flexWrap: "wrap",
        // flexShrink: 1
    }
}) 