import { View } from "react-native";
import ProfileCard from "@/components/ProfileCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
// import fetchData from '../../utils/fetchdata';
import * as Device from 'expo-device'

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

// will update for production
async function fetchProfiles(): Promise<UserProfile[]> {
  // return await fetchData("http://127.0.0.1:8080/ccserver/users", "GET", {})
  // return mock data
  return userProfiles;
}

export default function Directory() {
    // set data
    const [data, setData] = useState<UserProfile[]>([]);

    useEffect(() => {
      async function fetchDirectory() {
        if (Device.deviceType === Device.DeviceType.DESKTOP) {
          const profiles = await fetchProfiles();
          setData(profiles);
        } else {
          // mock data
          setData(userProfiles);
        }
      }
      fetchDirectory();
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

// Asked chatGPT to give my fake data
const userProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Alex Johnson",
    city: "Chicago",
    state: "Illinois",
    country: "USA",
    job_title: "Data Scientist",
    company: "City of Chicago",
    tags: ["Data Science", "Python", "Urban Policy","Policy Analysis", "Research", "Housing", "React", "JavaScript", "Civic Tech","UX Design", "User Research", "Accessibility"]
  },
  {
    id: "2",
    name: "Morgan Smith",
    city: "Washington",
    state: "DC",
    country: "USA",
    job_title: "Policy Analyst",
    company: "Urban Institute",
    tags: ["Policy Analysis", "Research", "Housing"]
  },
  {
    id: "3",
    name: "Jamie Williams",
    city: "San Francisco",
    state: "California",
    country: "USA",
    job_title: "Software Engineer",
    company: "Civic Tech Solutions",
    tags: ["React", "JavaScript", "Civic Tech"]
  },
  {
    id: "4",
    name: "Taylor Rodriguez",
    city: "New York",
    state: "New York",
    country: "USA",
    job_title: "GIS Specialist",
    company: "Environmental Defense Fund",
    tags: ["GIS", "Mapping", "Climate"]
  },
  {
    id: "5",
    name: "Casey Kim",
    city: "Chicago",
    state: "Illinois",
    country: "USA",
    job_title: "UX Researcher",
    company: "Smart Chicago Collaborative",
    tags: ["UX Design", "User Research", "Accessibility"]
  },
  {
    id: "6",
    name: "Jordan Patel",
    city: "Oakland",
    state: "California",
    country: "USA",
    job_title: "Program Manager",
    company: "Code for America",
    tags: ["Program Management", "Civic Engagement", "Community"]
  },
  {
    id: "7",
    name: "Avery Martinez",
    city: "Boston",
    state: "Massachusetts",
    country: "USA",
    job_title: "Policy Director",
    company: "Tech Equity Collaborative",
    tags: ["Policy", "Advocacy", "Equity"]
  },
  {
    id: "8",
    name: "Riley Thompson",
    city: "Chicago",
    state: "Illinois",
    country: "USA",
    job_title: "Data Engineer",
    company: "Urban Data Analytics",
    tags: ["Data Engineering", "Big Data", "Infrastructure"]
  },
  {
    id: "9",
    name: "Quinn Foster",
    city: "Philadelphia",
    state: "Pennsylvania",
    country: "USA",
    job_title: "Community Organizer",
    company: "Digital Justice Initiative",
    tags: ["Community Organizing", "Digital Rights", "Activism"]
  },
  {
    id: "10",
    name: "Cameron Davis",
    city: "Seattle",
    state: "Washington",
    country: "USA",
    job_title: "ML Engineer",
    company: "Public Benefit Analytics",
    tags: ["Machine Learning", "AI Ethics", "Python"]
  }
];
