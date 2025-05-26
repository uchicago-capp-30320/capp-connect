import { View,Text } from "react-native";
import ProfileCard from "@/components/ProfileCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import fetchData from '../../utils/fetchdata';

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

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const profiles = await fetchData(
          "http://127.0.0.1:8080/ccserver/profiles/",
          "GET",
          { format: "json" }
        );
        console.log("Fetched profiles:", profiles);
        setData(profiles);

      } catch (error) {
        console.error("Failed to load profiles:", error);
      }
    }

    fetchProfiles();
  }, []);

    return (
      <>
        <SearchBar
          placeholder="Search..."
          style={{
            marginVertical: 10,
            width: "90%",
            alignSelf: "center"
          }}
          color="gray"
        />

        <View style={{flex: 1, width:"100%"}}>
          <FlashList
            data={data}
            estimatedItemSize={100}
            keyExtractor={(item) => item.user}
            renderItem={({ item }) => {
              try {
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
                  />
                );
              } catch (err) {
                console.error("Error rendering profile:", err);
                return <Text>Error rendering card</Text>;
              }
            }}
          />
        </View>
      </>
    );
  }
