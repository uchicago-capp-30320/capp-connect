import { View } from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import FeedTypeButton from '../../components/FeedTypeButton'
import {updateFeed} from "@/utils/feedTools"
import { getCachedData } from "@/utils/caching";

// const BODY = "The gentle hum of the city faded as the sun dipped below the skyline, casting long shadows across the quiet park. Leaves rustled in the evening breeze, swirling in small, playful circles around the old wooden bench. Somewhere nearby, laughter echoed-brief and bright-before dissolving into the soft chorus of distant traffic. In that moment, time seemed to slow, and the world paused to breathe, wrapped in the golden glow of twilight."

type Post = {
  title: string;
  description: string;
  poster_name: string;
  post_type: string;
  tags: Array<string>;
};

export default function Feed() {
  // set data
  // const [data, setData] = useState<Post[]>([]);
  const [data, setData] = useState<Record<string, Post[]>>({
    All: [],
    General: [],
    Event: [],
    Job: [],
    Project: []
  });

  // create flag for when to load new data for the feed
  const [ loadNewData, setLoadNewData ] = useState(true)

  // whenever new data should be loaded in, pull from cache
  useEffect(() => {
    async function fetchFeed() {
      if (loadNewData) {
        const fetchedData = await getCachedData("feed")
        if (fetchedData && fetchedData.fullResults) {
          const fullData = fetchedData.fullResults

          // set full data to the types listed in the cache, ignoring the "nextPage" key
          setData(Object.fromEntries(
            Object.entries(fullData).filter(([key]) => !["nextPage"].includes(key))
          ) as Record<string, Post[]>)
        }
      }
    }
    fetchFeed();
    setLoadNewData(false)

  }, [loadNewData]);

  // set button (feed type)
  const [feedType, setFeedType] = useState("All")
  // keep record of the parsed data
  const [filteredData, setFilteredData] = useState<Post[]>([]);

  useEffect(() => {
    // Filter data whenever data or feedType changes
    setFilteredData(data[feedType])

  }, [data, feedType]);

  // manage refreshing state
  const [refreshing, setRefreshing] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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
    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
      <FeedTypeButton label="All" name="All" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="General" name="General" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="Events" name="Event" feedButtonPressed={feedType} setButton={setFeedType}  />
      <FeedTypeButton label="Jobs" name="Job" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="Projects" name="Project" feedButtonPressed={feedType} setButton={setFeedType} />
    </View>
    <View style={{flex: 1, width:"100%"}}>
        <FlashList
          renderItem={({item}) => {
            return <FeedCard title={item.title} body={item.description} tags={item.tags} />
          }}

          data={filteredData}
          estimatedItemSize={500}

          // use for loading more data
          onEndReached={
            async () => {
              // if there's no data to begin with, do nothing
              if (isFetchingMore || filteredData.length === 0) return
              setIsFetchingMore(true);
              await updateFeed();
              setLoadNewData(true);
              setIsFetchingMore(false);
            }
          }
          onEndReachedThreshold={.5}
          onRefresh={ () => {
            setRefreshing(true);
            updateFeed()
            setRefreshing(false);
            setLoadNewData(true)
          }}
          refreshing={refreshing}
        />
     </View>
     </>
  );
}
