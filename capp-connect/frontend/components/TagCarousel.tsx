import { View, ViewStyle } from "react-native";
import { FlashList } from "@shopify/flash-list";
import TagIcon from "./TagIcon";

type Tag = {
    name: string
    color: string
}

export default function TagCarousel({tags, style}: {tags: Tag[], style?: ViewStyle}) {
    return (
        <View style={style}>
            <FlashList
            renderItem={
                ({item}) => {
                        return <TagIcon tag={item.name} color={item.color} style={{minWidth: 80}} deletable={false}/>
                    }
                }
            horizontal={true}
            data={tags}
            estimatedItemSize={80}
            />
        </View>
    )
}
