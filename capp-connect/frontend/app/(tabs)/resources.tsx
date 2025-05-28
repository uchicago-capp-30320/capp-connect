import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import fetchData from '../../utils/fetchdata';
import * as Device from 'expo-device'
import ResourceCard from "@/components/ResourceCard";
import { API_BASE_URL } from "@/utils/constants";

type Resource = {
  title: string;
  description: string;
  poster_name: string;
  links: string;
};

export default function Resources() {
  const [data, setData] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
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
      }
    };
    fetchResources();
  }, []);

  return (
    <>
      <View style={{flex: 1, width:"100%"}}>
        <FlashList
          data={data}
          estimatedItemSize={500}
          renderItem={({ item }: { item: Resource }) => (
            <ResourceCard
                title={item.title}
                description={item.description}
                links={item.links}
              />
          )}
        />
      </View>
    </>
  );
}
