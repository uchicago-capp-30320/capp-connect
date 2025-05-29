import { View } from "react-native";
import ProfileCard from "@/components/ProfileCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState, useRef } from "react";
import fetchData from '../../utils/fetchdata';
import { API_BASE_URL } from "@/utils/constants";
import TagIcon from "@/components/TagIcon";
import TagSearch from "@/components/TagSearch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCachedData } from "@/utils/caching";

const TAG_LIMIT = 5

type UserProfile = {
  user: string;
  city: string | null;
  state: string | null;
  country: string | null;
  job_title: string | null;
  company: string | null;
  tags: string[];
  photo_url: string | null;
  employment_status: string | null;
};

export default function Directory() {
  const [data, setData] = useState<UserProfile[]>([]);
  const [searched, setSearched] = useState(false);

  const params = useLocalSearchParams()
  const wasSearched = useRef(false)

  useEffect(() => { setSearched(Object.keys(params).length > 0) }, [params])

  useEffect(() => {
    async function fetchProfiles() {
        if (wasSearched.current) {
          // route back to original page once done
          const router = useRouter()
          router.navigate("/(tabs)/directory")
        }

        const profiles = await fetchData(
          `${API_BASE_URL}/profiles/`,
          "GET",
          { format: "json" }
        );
        console.log("Fetched profiles:", profiles);
        setData(profiles);

        wasSearched.current = false
    }

    async function getSearchResults() {
        const results = await getCachedData(`search_Directory`);
        console.log("Fetched profiles from search:", results);
        setData(results || []);

        wasSearched.current = true
    }

    if (!searched) {
      fetchProfiles();
    } else {
      getSearchResults();
    }

  }, [searched]);

    return (
      <>
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
              <TagSearch searchType={"Directory"} search limit={TAG_LIMIT} />

          </View>

        <View style={{flex: 1, width:"100%"}}>
          <FlashList
            data={data}
            estimatedItemSize={100}
            keyExtractor={(item) => item.user}
            renderItem={({ item }) => {
                return (
                  <ProfileCard
                    name={item.user}
                    city={item.city ?? ""}
                    state={item.state ?? ""}
                    country={item.country ?? ""}
                    job_title={item.job_title ?? "No job title"}
                    company={item.company ?? "No company"}
                    tags={item.tags ?? []}
                    user={item.user}
                    imageURL={item.photo_url ?? ""}
                  />
                );
            }}
          />
        </View>
      </>
    );
  }
