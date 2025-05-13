import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import TagIcon from "./TagIcon";

type Tag = {
    name: string
    color: string
}

export default function TagCarousel({tags}: {tags: Tag[]}) {
    return (
        <View>
            <FlashList
            renderItem={
                ({item}) => {
                        return <TagIcon tag={item.name} color={item.color} style={{minWidth: 80}} />
                    }
                }
            horizontal={true}
            data={tags}
            />
        </View>
    )
}
