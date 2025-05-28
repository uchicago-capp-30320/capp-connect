import { View } from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState, useRef } from "react";
import FeedTypeButton from '../../components/FeedTypeButton'
import {updateFeed} from "@/utils/feedTools"
import { getCachedData } from "@/utils/caching";
import CreateNewPost from "@/components/CreateNewPost";
import { useLocalSearchParams, useRouter } from "expo-router";
import TagSearch from "@/components/TagSearch";
import TagIcon from "@/components/TagIcon";

// const BODY = "The gentle hum of the city faded as the sun dipped below the skyline, casting long shadows across the quiet park. Leaves rustled in the evening breeze, swirling in small, playful circles around the old wooden bench. Somewhere nearby, laughter echoed-brief and bright-before dissolving into the soft chorus of distant traffic. In that moment, time seemed to slow, and the world paused to breathe, wrapped in the golden glow of twilight."
const TAG_LIMIT = 5

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
// Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
  // set button (feed type)
  const [feedType, setFeedType] = useState("All")
  // keep record of the parsed data
  const [filteredData, setFilteredData] = useState<Post[]>([]);

  const params = useLocalSearchParams();

  const [searched, setSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  useEffect(() => { setSearched(Object.keys(params).length > 0) }, [params])

  // adjust results to show only search results
  useEffect(() => {
    let isMounted = true;

    async function getSearchResults() {
      const results = await getCachedData(`search_Feed`);
      if (isMounted) {
        setSearchResults(results || []);
        console.log(results);
      }
    }

    async function resetFeed() {
      const fetchedData = await getCachedData("feed");
      if (fetchedData?.fullResults && isMounted) {
        const entries = Object.entries(fetchedData.fullResults)
          .filter(([key]) => key !== "nextPage");
        setData(Object.fromEntries(entries) as Record<string, Post[]>);

        const router = useRouter()
        router.navigate("/(tabs)/feed")
      }
    }

    if (searched) {
      getSearchResults();
    } else {
      resetFeed();
    }

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(params), searched]);

  // create flag for when to load new data for the feed
  const [ loadNewData, setLoadNewData ] = useState(false)

  // whenever new data should be loaded in, pull from cache
  useEffect(() => {
    async function fetchFeed() {
      try {
        if (loadNewData) {
          // First, update cache with latest posts
          await updateFeed();
        }

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
    if (!searched) {
      fetchFeed();
    }
  }, [loadNewData]);



  useEffect(() => {
    if (!searched) {
      // Filter data whenever data or feedType changes
      setFilteredData(data[feedType] ?? [])
    } else {
      if (Array.isArray(searchResults)) {
        // Filter by feedType, unless feedType is "All"
        const filtered =
          feedType === "All"
            ? searchResults
            : searchResults.filter((post: Post) => post.post_type === feedType);
        setFilteredData(filtered);
      }

    }

  }, [data, feedType, searched, searchResults]);

  // manage refreshing state
  const [refreshing, setRefreshing] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Poller reference to clear interval when needed
  const pollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll for data if empty, but avoid infinite update loop by not depending on `data`
  useEffect(() => {
    // Only start polling if not searching and all categories are empty
    const isDataEmpty = Object.values(data).every(arr => arr.length === 0);

    if (!searched && isDataEmpty && !pollerRef.current) {
      pollerRef.current = setInterval(async () => {
        const fetchedData = await getCachedData("feed");
        if (fetchedData?.fullResults) {
          const entries = Object.entries(fetchedData.fullResults)
            .filter(([key]) => key !== "nextPage");
          // If data is found, update state and stop polling
          if (entries.length > 0 && entries.some(([, arr]) => (arr as Post[]).length > 0)) {
            setData(Object.fromEntries(entries) as Record<string, Post[]>);
            if (pollerRef.current) {
              clearInterval(pollerRef.current);
              pollerRef.current = null;
            }
          }
        }
      }, 1500); // Poll every 1.5 seconds
    }

    // Cleanup: clear interval when component unmounts or when searched changes
    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, [searched]);

  return (
    <View style={{ flex: 1, height: "100%" }}>

    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
      <FeedTypeButton label="All" name="All" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="General" name="General" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="Events" name="Event" feedButtonPressed={feedType} setButton={setFeedType}  />
      <FeedTypeButton label="Jobs" name="Job" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="Projects" name="Project" feedButtonPressed={feedType} setButton={setFeedType} />
    </View>
      <View style={{flexDirection: "column"}}>
        <View style={{ width: "80%", justifyContent: "center", alignSelf:"center", marginLeft: -60, marginTop: 20,marginBottom: 130}}>
            {/* handle if tags is an array of strings */}
            {searched && Array.isArray(params.searchTags) && params.searchTags.length > 0 ? (
              <TagIcon
                color={"grey"}
                tag={params.searchTags.join(" + ")}
                deletable
                setSearching={setSearched}
              />
              // handle if tags is a single string
            ) : searched && typeof params.searchTags === "string" ? (
              <TagIcon
                color={"grey"}
                tag={params.searchTags}
                deletable
                setSearching={setSearched}
              />
            ) : null}
            <TagSearch searchType={"Feed"} search  limit={TAG_LIMIT} />

        </View>
        <CreateNewPost />
      </View>

    <View style={{flex: 1, width:"100%", minHeight: 200 }}>
        <FlashList
          data={filteredData}
          renderItem={({ item, index }) => {
            if (!item || typeof item.title !== "string" || typeof item.description !== "string" || !Array.isArray(item.tags)) {
              return null;
            }

            return (
              <FeedCard
                key={`${index}-${item.title}-${item.tags}`}
                postID={item.post_id}
                userID={item.user}
                title={item.title}
                body={item.description}
                tags={item.tags}
                searchType="Feed"
              />
            );
          }}

          estimatedItemSize={400}

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
          // Honestly don't know why 15 works but it does
          onEndReachedThreshold={15}
          onRefresh={ () => {
            setRefreshing(true);
            updateFeed()
            setRefreshing(false);
            setLoadNewData(true)
          }}
          refreshing={refreshing}
        />
     </View>
     </View>
  );
}
