import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState, useRef } from "react";
import fetchData from '../../utils/fetchdata';
import * as Device from 'expo-device'
import ResourceCard from "@/components/ResourceCard";
import { API_BASE_URL } from "@/utils/constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCachedData } from "@/utils/caching";
import TagSearch from "@/components/TagSearch";
import TagIcon from "@/components/TagIcon";

const TAG_LIMIT = 5

type Resource = {
  title: string;
  description: string;
  poster_name: string;
  links: string;
  tags: string[]
};

export default function Resources() {
  const [data, setData] = useState<Resource[]>([]);

  const [searched, setSearched] = useState(false);
  const params = useLocalSearchParams()
  const wasSearched = useRef(false)

  useEffect(() => { setSearched(Object.keys(params).length > 0) }, [params])

  useEffect(() => {
    const fetchResources = async () => {
      if (wasSearched.current) {
        const router = useRouter()
        router.navigate("/(tabs)/resources")
      }

      if (Device.deviceType === Device.DeviceType.DESKTOP) {
        try {
          const response = await fetchData(
            `${API_BASE_URL}/resources/`,
            "GET",
            { format: "json" }
          );
          setData(response);
        } catch (err) {
          console.error("Failed to fetch resources", err);
        }

        wasSearched.current = false
      }
    };

    async function getSearchResults() {
        const results = await getCachedData(`search_Resources`);
        console.log("Fetched profiles from search:", results);
        setData(results || []);

        wasSearched.current = true
    }

    if (!searched) {
      fetchResources();
    } else {
      getSearchResults();
    }

  }, [searched]);

  return (
    <>
      <View style={{flex: 1, width:"100%"}}>
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
              <TagSearch searchType={"Resources"} search limit={TAG_LIMIT} />

          </View>
        <FlashList
          data={data}
          estimatedItemSize={500}
          renderItem={({ item }: { item: Resource }) => (
            <ResourceCard
                title={item.title}
                description={item.description}
                links={item.links}
                tags={item.tags}
              />
          )}
        />
      </View>
    </>
  );
}
