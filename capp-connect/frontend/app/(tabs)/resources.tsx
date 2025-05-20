import { View } from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import fetchData from '../../utils/fetchdata';
import * as Device from 'expo-device'

type Resource = {
  title: string;
  description: string;
  poster_name: string;
  tags: Array<string>;
};

// update still needed 
async function updateResources(): Promise<Resource[]> {
  // return await fetchData("http://127.0.0.1:8080/ccserver/resources", "GET", {})
  return resources;
}

export default function Resources() {
  // set data
  const [data, setData] = useState<Resource[]>([]);
  
  useEffect(() => {
    async function fetchResources() {
      if (Device.deviceType === Device.DeviceType.DESKTOP) {
        const resources = await updateResources();
        setData(resources);
      } else {
        setData([]);
      }
    }
    fetchResources();
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
            return <FeedCard title={item.title} body={item.description} tags={item.tags} />
          }}
          data={data}
          estimatedItemSize={500}
          // To enable loading more data when reaching end of list
          // onEndReached={() => {updateResources()}}
          // onEndReachedThreshold={.3}
        />
      </View>
    </>
  );
}


// asked chatGPT: Generate me something simliar to feed for Resources (with only title, description, poster_name, and tags)
const resources: Resource[] = [
  {
    title: "Intro to Civic Tech",
    description: "A comprehensive guide to understanding civic technology and its impact on local government and communities.",
    poster_name: "Jamie Wilson",
    tags: ["Civic Tech", "Guide", "Introduction", "Government"]
  },
  {
    title: "Policy Analysis Toolkit",
    description: "A collection of frameworks, methodologies, and tools for conducting effective policy analysis in urban contexts.",
    poster_name: "Samantha Lee",
    tags: ["Policy", "Analysis", "Tools", "Methods", "Urban"]
  },
  {
    title: "Data Visualization for Policy Makers",
    description: "Learn how to create compelling data visualizations that effectively communicate policy insights to decision makers.",
    poster_name: "Marcus Johnson",
    tags: ["Data Visualization", "Policy", "Communication", "Design"]
  },
  {
    title: "Chicago Open Data Portal Guide",
    description: "How to effectively use Chicago's Open Data Portal for research, analysis, and civic applications.",
    poster_name: "Elena Rodriguez",
    tags: ["Chicago", "Open Data", "Tutorial", "Research"]
  },
  {
    title: "R for Public Policy Analysis",
    description: "A step-by-step tutorial on using R programming language for public policy data analysis and visualization.",
    poster_name: "David Chen",
    tags: ["R", "Programming", "Data Analysis", "Public Policy", "Tutorial"]
  },
  {
    title: "Ethics in Algorithm-Driven Policy",
    description: "Examining ethical considerations when using algorithms and AI in public policy decision-making.",
    poster_name: "Aisha Washington",
    tags: ["Ethics", "AI", "Algorithms", "Policy", "Decision-making"]
  },
  {
    title: "Urban Planning Data Resources",
    description: "A curated list of datasets, tools, and platforms specifically useful for urban planning research and practice.",
    poster_name: "Carlos Mendez",
    tags: ["Urban Planning", "Data", "Resources", "Tools", "Research"]
  },
  {
    title: "Policy Brief Writing Guide",
    description: "Best practices for writing effective policy briefs that capture attention and drive action.",
    poster_name: "Nadia Ahmed",
    tags: ["Writing", "Policy Brief", "Communication", "Advocacy"]
  },
  {
    title: "Getting Started with GIS for Policy",
    description: "A beginner's guide to Geographic Information Systems (GIS) and their applications in policy analysis.",
    poster_name: "Tyler Roberts",
    tags: ["GIS", "Mapping", "Spatial Analysis", "Policy", "Beginner"]
  },
  {
    title: "Community Engagement Frameworks",
    description: "Models and strategies for effective community engagement in civic tech and policy initiatives.",
    poster_name: "Maya Patel",
    tags: ["Community Engagement", "Participation", "Frameworks", "Civic Tech"]
  },
  {
    title: "Environmental Justice Data Sources",
    description: "Comprehensive list of data sources and tools for researching and addressing environmental justice issues.",
    poster_name: "Jordan Taylor",
    tags: ["Environmental Justice", "Data", "Research", "Equity"]
  },
  {
    title: "Python for Public Sector Data Analysis",
    description: "Learn how to use Python for analyzing public sector data, from basic statistics to machine learning applications.",
    poster_name: "Miguel Santos",
    tags: ["Python", "Data Analysis", "Public Sector", "Programming", "Tutorial"]
  },
  {
    title: "Impact Evaluation Methods",
    description: "An overview of qualitative and quantitative methods for evaluating the impact of policy interventions.",
    poster_name: "Rebecca Lin",
    tags: ["Impact Evaluation", "Methods", "Assessment", "Policy", "Research"]
  },
  {
    title: "Smart Cities Technology Guide",
    description: "Exploring technologies that power smart cities, from IoT sensors to data analytics platforms.",
    poster_name: "Omar Hassan",
    tags: ["Smart Cities", "Technology", "IoT", "Urban Tech", "Infrastructure"]
  },
  {
    title: "Public Budgeting Resources",
    description: "Tools and guides for understanding, analyzing, and visualizing public budgets at local and state levels.",
    poster_name: "Sophia Williams",
    tags: ["Budgeting", "Finance", "Government", "Fiscal Policy", "Analysis"]
  }
];