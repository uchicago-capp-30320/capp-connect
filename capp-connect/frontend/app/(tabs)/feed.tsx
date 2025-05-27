import { View } from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import FeedTypeButton from '../../components/FeedTypeButton'
import {updateFeed} from "@/utils/feedTools"
import { getCachedData } from "@/utils/caching";
import CreateNewPost from "@/components/CreateNewPost";

// const BODY = "The gentle hum of the city faded as the sun dipped below the skyline, casting long shadows across the quiet park. Leaves rustled in the evening breeze, swirling in small, playful circles around the old wooden bench. Somewhere nearby, laughter echoed-brief and bright-before dissolving into the soft chorus of distant traffic. In that moment, time seemed to slow, and the world paused to breathe, wrapped in the golden glow of twilight."

type Post = {
  post_id: string
  user: string
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
    try {
      if (!loadNewData) return;

      // First, update cache with latest posts
      await updateFeed();

      // Then, pull from cache
      const fetchedData = await getCachedData("feed");

      if (fetchedData?.fullResults) {
        const entries = Object.entries(fetchedData.fullResults)
          .filter(([key]) => key !== "nextPage");

        setData(Object.fromEntries(entries) as Record<string, Post[]>);
      }
    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setLoadNewData(false);
    }
  }

  fetchFeed();
}, [loadNewData]);

  // set button (feed type)
  const [feedType, setFeedType] = useState("All")
  // keep record of the parsed data
  const [filteredData, setFilteredData] = useState<Post[]>([]);

  useEffect(() => {
    // Filter data whenever data or feedType changes
    setFilteredData(data[feedType] ?? [])

  }, [data, feedType]);

  // manage refreshing state
  const [refreshing, setRefreshing] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  return (
    <View style={{ flex: 1, height: "100%" }}>
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

    <CreateNewPost />

    <View style={{flex: 1, width:"100%", minHeight: 200 }}>
        <FlashList
          data={filteredData}
          renderItem={({ item }) => {
            if (
              !item ||
              typeof item.post_id !== "string" ||
              typeof item.user !== "string" ||
              typeof item.title !== "string" ||
              typeof item.description !== "string" ||
              !Array.isArray(item.tags)
            ) {
              return null;
            }

  return (
    <FeedCard
      postID={item.post_id}
      userID={item.user}
      title={item.title}
      body={item.description}
      tags={item.tags}
    />
  );
}}


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
          onRefresh={async () => {
            setRefreshing(true);
            await updateFeed();
            setRefreshing(false);
            setLoadNewData(true);
          }}
          refreshing={refreshing}
        />
     </View>
     </View>
  );
}
