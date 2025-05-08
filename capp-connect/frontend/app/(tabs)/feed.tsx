import { View } from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";
import SearchBar from '../../components/SearchBar';

const BODY = "The gentle hum of the city faded as the sun dipped below the skyline, casting long shadows across the quiet park. Leaves rustled in the evening breeze, swirling in small, playful circles around the old wooden bench. Somewhere nearby, laughter echoed-brief and bright-before dissolving into the soft chorus of distant traffic. In that moment, time seemed to slow, and the world paused to breathe, wrapped in the golden glow of twilight."

export default function Feed() {
  return (
    <>
      <SearchBar
          placeholder="Search..."
          style={
            { marginVertical: 10,
              width: "90%",
              alignSelf: "center"
            }
          }
          color="gray"
        />
    <View style={{flex: 1, width:"100%"}}>
        <FlashList
          renderItem={({item}) => {
            return <FeedCard title={String(item)} body={String(BODY)} />
          }}

          data={Array(1000).fill("word")}
          estimatedItemSize={500}

          // will use for loading more data
          // onEndReached={() => {}}
          // onEndReachedThreshold={}

        />
     </View>
     </>
  );
}
