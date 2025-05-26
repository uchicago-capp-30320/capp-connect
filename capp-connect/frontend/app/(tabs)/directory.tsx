import { View } from "react-native";
import ProfileCard from "@/components/ProfileCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import fetchData from '../../utils/fetchdata';

type UserProfile = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  job_title: string;
  company: string;
  tags: Array<string>;
};

export default function Directory() {
  const [data, setData] = useState<UserProfile[]>([]);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const profiles = await fetchData("http://127.0.0.1:8080/ccserver/profiles/", "GET");
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
            renderItem={({item}) => {
              return <ProfileCard
                name={item.name}
                city={item.city}
                state={item.state}
                country={item.country}
                job_title={item.job_title}
                company={item.company}
                tags={item.tags}
                user={item.id}
              />
            }}
            data={data}
            estimatedItemSize={200}
          />
        </View>
      </>
    );
  }
