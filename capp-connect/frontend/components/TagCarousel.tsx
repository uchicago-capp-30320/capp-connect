import { View, ViewStyle } from "react-native";
import { FlashList } from "@shopify/flash-list";
import TagIcon from "./TagIcon";

type Tag = {
    name: string
    color: string
}

type SearchType = "Directory" | "Resources" | "Feed";

export default function TagCarousel({tags, style, searchType}: {tags: Tag[], style?: ViewStyle, searchType: SearchType}) {
    return (
        <View style={style}>
            <FlashList
            renderItem={
                ({item}) => {
                        return <TagIcon tag={item.name} color={item.color} style={{minWidth: 80}} deletable={false} searchType={searchType} />
                    }
                }
            horizontal={true}
            data={tags}
            estimatedItemSize={80}
            />
        </View>
    )
}
