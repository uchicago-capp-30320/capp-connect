import { RefreshControl, View } from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";

const BODY = "The gentle hum of the city faded as the sun dipped below the skyline, casting long shadows across the quiet park. Leaves rustled in the evening breeze, swirling in small, playful circles around the old wooden bench. Somewhere nearby, laughter echoed-brief and bright-before dissolving into the soft chorus of distant traffic. In that moment, time seemed to slow, and the world paused to breathe, wrapped in the golden glow of twilight."

export default function Feed() {
  return (
    <View style={{flex: 1}}>

        <FlashList
          renderItem={({item}) => {
            return <FeedCard title={String(item)} body={String(BODY)} />
          }}

          data={Array(1000).fill("word")}
          // estimatedItemSize={200}
        />



     </View>
  );
}
