import { View } from "react-native";
import FeedCard from "@/components/FeedCard";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import SearchBar from '../../components/SearchBar';
import fetchData from '../../utils/fetchdata';
import * as Device from 'expo-device'
import FeedTypeButton from '../../components/FeedTypeButton'

// const BODY = "The gentle hum of the city faded as the sun dipped below the skyline, casting long shadows across the quiet park. Leaves rustled in the evening breeze, swirling in small, playful circles around the old wooden bench. Somewhere nearby, laughter echoed-brief and bright-before dissolving into the soft chorus of distant traffic. In that moment, time seemed to slow, and the world paused to breathe, wrapped in the golden glow of twilight."

type Post = {
  title: string;
  description: string;
  poster_name: string;
  post_type: string;
  tags: Array<string>;
};

// will update for production
async function updateFeed(): Promise<Post[]> {
  return await fetchData("http://127.0.0.1:8080/ccserver/posts", "GET", {})
}

// const TYPES = ["All", "General", "Events", "Jobs", "Projects"]


// function filterData(raw_data: Array<{ [key: string]: any }>, data_setter: Function) {

//   let data_type_mapper: Record<string, any> = {
//     "All": raw_data
//   }

//   // skip "All"
//   // filter data for type
//   TYPES.slice(1).forEach((type) => {
//     let arr = new Array
//     for (let i = 0; i < raw_data.length; i++) {
//       if (raw_data[i][type] || raw_data[i][type.toLocaleLowerCase()]) {
//         arr.push(raw_data[i])
//         console.log(type, raw_data[i])
//       }
//     }
//     data_type_mapper[type] = arr
//   })

//   return function(filter_term: string) {
//     data_setter(data_type_mapper[filter_term])
//   }
// }


export default function Feed() {
  // set data
  const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchFeed() {
      if (Device.deviceType === Device.DeviceType.DESKTOP) {
        const posts = await updateFeed();
        setData(posts);
      } else {
        setData(posts);
      }
    }
    fetchFeed();
  }, []);

  // set button (feed type)
  const [feedType, setFeedType] = useState("all")
  // keep record of the parsed data
  const [filteredData, setFilteredData] = useState<Post[]>([]);

  useEffect(() => {
    // Filter data whenever data or feedType changes
    let filtered = data;
    if (feedType !== "all") {
      filtered = data.filter(item => (item.post_type.toLowerCase() === feedType.toLowerCase()));
    }
    setFilteredData(filtered);
  }, [data, feedType]);

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
      <FeedTypeButton label="All" name="all" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="General" name="general" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="Events" name="event" feedButtonPressed={feedType} setButton={setFeedType}  />
      <FeedTypeButton label="Jobs" name="job" feedButtonPressed={feedType} setButton={setFeedType}/>
      <FeedTypeButton label="Projects" name="project" feedButtonPressed={feedType} setButton={setFeedType} />
    </View>
    <View style={{flex: 1, width:"100%"}}>
        <FlashList
          renderItem={({item}) => {
            return <FeedCard title={item.title} body={item.description} tags={item.tags} />
          }}

          data={filteredData}
          estimatedItemSize={500}

          // will use for loading more data
          // onEndReached={() => {updateFeed()}}
          // onEndReachedThreshold={.3}

        />
     </View>
     </>
  );
}

const posts: Post[] = [
  {
    title: "Hackathon: Building Tools for Urban Resilience",
    description: "Join us for a weekend hackathon focused on developing open-source tools to help cities adapt to climate change. Teams will tackle challenges in urban policy, data visualization, and environmental monitoring.",
    post_type: "event",
    poster_name: "Ava Patel",
    tags: ["Civic Tech", "Climate Change", "Urban Policy", "Data Science", "Open Source"]
  },
  {
    title: "Research Opportunity: ML for Housing Policy",
    description: "Looking for collaborators on a project using machine learning to analyze housing affordability trends in major US cities. Ideal for students interested in data science and public policy.",
    post_type: "project",
    poster_name: "Liam Chen",
    tags: ["ML", "Housing", "Data Science", "Public Policy", "Civic Tech"]
  },
  {
    title: "Internship: Civic Data Analyst at City Hall",
    description: "The City of Chicago is seeking interns to support data-driven decision-making in urban planning. Work with real civic datasets and help shape local policy.",
    post_type: "job",
    poster_name: "Sophia Martinez",
    tags: ["Civic Tech", "Urban Policy", "Data Science", "Internship", "Chicago"]
  },
  {
    title: "General Discussion: AI Ethics in Public Policy",
    description: "Let’s discuss the ethical implications of using AI in government services. How can we ensure transparency, fairness, and accountability in civic tech?",
    post_type: "general",
    poster_name: "Noah Williams",
    tags: ["AI", "Civic Tech", "Ethics", "Public Policy", "ML"]
  },
  {
    title: "Workshop: Data Visualization for Climate Action",
    description: "Sign up for our hands-on workshop on using Python and Tableau to visualize climate change data. Open to all skill levels.",
    post_type: "event",
    poster_name: "Emily Nguyen",
    tags: ["Climate Change", "Data Science", "Visualization", "Civic Tech", "Python"]
  },
  {
    title: "Volunteer Project: Mapping Food Deserts",
    description: "We're seeking volunteers to help map food deserts in Chicago using GIS and public data. No experience required-just a passion for food justice and civic tech!",
    post_type: "project",
    poster_name: "Jamal Robinson",
    tags: ["Civic Tech", "GIS", "Urban Policy", "Data Science", "Chicago"]
  },
  {
    title: "Panel: The Future of Smart Cities",
    description: "Join our expert panel to discuss how IoT and big data are transforming urban environments. What are the policy implications?",
    post_type: "event",
    poster_name: "Priya Singh",
    tags: ["Smart Cities", "IoT", "Urban Policy", "Civic Tech", "Big Data"]
  },
  {
    title: "Job Opening: Policy Analyst with Data Skills",
    description: "Nonprofit seeks a policy analyst with experience in R or Python for data-driven advocacy on affordable housing.",
    post_type: "job",
    poster_name: "Michael Johnson",
    tags: ["Housing", "Data Science", "Public Policy", "R", "Python"]
  },
  {
    title: "General: Open Source Tools for Civic Engagement",
    description: "What are your favorite open-source platforms for increasing civic participation? Share your experiences and recommendations.",
    post_type: "general",
    poster_name: "Sara Kim",
    tags: ["Open Source", "Civic Tech", "Engagement", "Public Policy", "Platforms"]
  },
  {
    title: "Project: Predictive Analytics for Public Transit",
    description: "Seeking students to join a predictive analytics project aimed at improving public transit efficiency using machine learning.",
    post_type: "project",
    poster_name: "David Lee",
    tags: ["ML", "Public Transit", "Urban Policy", "Data Science", "Civic Tech"]
  },
  {
    title: "Event: Civic Tech Meetup - Spring 2025",
    description: "Network with fellow civic tech enthusiasts and learn about ongoing projects in Chicago.",
    post_type: "event",
    poster_name: "Olivia Garcia",
    tags: ["Civic Tech", "Networking", "Chicago", "Projects", "Meetup"]
  },
  {
    title: "Job: Data Visualization Intern for Climate Policy",
    description: "Work with a policy think tank to create compelling data visualizations for climate change advocacy.",
    post_type: "job",
    poster_name: "Benjamin Clark",
    tags: ["Climate Change", "Data Visualization", "Internship", "Policy", "Advocacy"]
  },
  {
    title: "General: Civic Tech Book Club",
    description: "Join our monthly book club! This month: 'Automating Inequality' by Virginia Eubanks.",
    post_type: "general",
    poster_name: "Isabella Torres",
    tags: ["Civic Tech", "Book Club", "Inequality", "Public Policy", "Discussion"]
  },
  {
    title: "Workshop: Intro to Geospatial Analysis",
    description: "Learn the basics of GIS and its applications in urban planning and public policy.",
    post_type: "event",
    poster_name: "Ethan Murphy",
    tags: ["GIS", "Urban Policy", "Civic Tech", "Geospatial", "Workshop"]
  },
  {
    title: "Project: Open Data for Air Quality Monitoring",
    description: "Collaborate on a project to collect and analyze open air quality data for local policy recommendations.",
    post_type: "project",
    poster_name: "Charlotte Evans",
    tags: ["Open Data", "Air Quality", "Climate Change", "Civic Tech", "Policy"]
  },
  {
    title: "Job: ML Engineer for Nonprofit Analytics",
    description: "Nonprofit seeks ML engineer to help analyze data for social impact projects. Experience with Python preferred.",
    post_type: "job",
    poster_name: "William Smith",
    tags: ["ML", "Nonprofit", "Data Science", "Python", "Social Impact"]
  },
  {
    title: "General: Tech for Voter Engagement",
    description: "Share your ideas and tools for improving voter turnout with technology.",
    post_type: "general",
    poster_name: "Mia Brown",
    tags: ["Civic Tech", "Voter Engagement", "Public Policy", "Tech", "Participation"]
  },
  {
    title: "Event: Data Science for Good Symposium",
    description: "Attend talks and workshops on how data science is being used to address social and public policy issues.",
    post_type: "event",
    poster_name: "Lucas Wilson",
    tags: ["Data Science", "Social Good", "Public Policy", "Civic Tech", "Symposium"]
  },
  {
    title: "Project: Algorithmic Fairness in Social Services",
    description: "Join our research group studying algorithmic bias in public benefits eligibility systems.",
    post_type: "project",
    poster_name: "Amelia Martinez",
    tags: ["Algorithmic Fairness", "Civic Tech", "Public Policy", "Bias", "ML"]
  },
  {
    title: "Job: Urban Data Fellow",
    description: "The Urban Data Lab is hiring fellows to work on open data projects related to transportation and housing.",
    post_type: "job",
    poster_name: "Henry Thompson",
    tags: ["Urban Policy", "Open Data", "Transportation", "Housing", "Fellowship"]
  },
  {
    title: "General: Crowdsourcing Solutions for Homelessness",
    description: "What tech solutions could help address homelessness in urban areas? Share your thoughts and resources.",
    post_type: "general",
    poster_name: "Grace Lee",
    tags: ["Homelessness", "Civic Tech", "Urban Policy", "Housing", "Crowdsourcing"]
  },
  {
    title: "Event: Civic Tech Demo Night",
    description: "Showcase your civic tech projects and get feedback from peers and local leaders.",
    post_type: "event",
    poster_name: "Jack White",
    tags: ["Civic Tech", "Demo", "Projects", "Networking", "Chicago"]
  },
  {
    title: "Project: Blockchain for Transparent Governance",
    description: "Explore how blockchain can improve transparency and accountability in government processes.",
    post_type: "project",
    poster_name: "Ella Green",
    tags: ["Blockchain", "Transparency", "Civic Tech", "Governance", "Policy"]
  },
  {
    title: "Job: Data Scientist for Urban Mobility",
    description: "Startup seeks data scientist to analyze mobility data and recommend policy interventions for congestion.",
    post_type: "job",
    poster_name: "James Harris",
    tags: ["Urban Mobility", "Data Science", "Policy", "Congestion", "Startup"]
  },
  {
    title: "General: Open Data Sources for Policy Research",
    description: "Share your favorite open data sources for public policy and civic tech research.",
    post_type: "general",
    poster_name: "Chloe Adams",
    tags: ["Open Data", "Policy Research", "Civic Tech", "Resources", "Data Science"]
  },
  {
    title: "Event: Machine Learning in Public Health",
    description: "Panel discussion on how ML is transforming public health policy and practice.",
    post_type: "event",
    poster_name: "Matthew Scott",
    tags: ["ML", "Public Health", "Policy", "Civic Tech", "Panel"]
  },
  {
    title: "Project: Sentiment Analysis for City Feedback",
    description: "Help build a sentiment analysis tool to analyze citizen feedback on city services.",
    post_type: "project",
    poster_name: "Sofia Lewis",
    tags: ["Sentiment Analysis", "Civic Tech", "ML", "Urban Policy", "Feedback"]
  },
  {
    title: "Job: Policy Tech Consultant",
    description: "Consulting firm seeks tech-savvy policy students for digital transformation projects with government clients.",
    post_type: "job",
    poster_name: "Daniel Walker",
    tags: ["Policy", "Consulting", "Civic Tech", "Digital Transformation", "Government"]
  },
  {
    title: "General: Women in Civic Tech",
    description: "Celebrating women leaders in civic tech. Share your stories and role models!",
    post_type: "general",
    poster_name: "Zoe Young",
    tags: ["Civic Tech", "Women", "Leadership", "Diversity", "Inspiration"]
  },
  {
    title: "Event: Data Ethics Workshop",
    description: "Hands-on workshop on ethical data use in policy and civic tech applications.",
    post_type: "event",
    poster_name: "Mason King",
    tags: ["Data Ethics", "Civic Tech", "Policy", "Workshop", "Ethics"]
  },
  {
    title: "Project: Visualizing Income Inequality",
    description: "Join a project team to create interactive visualizations of income inequality in Chicago.",
    post_type: "project",
    poster_name: "Harper Allen",
    tags: ["Income Inequality", "Visualization", "Chicago", "Civic Tech", "Data Science"]
  },
  {
    title: "Job: Data Engineer for Civic Apps",
    description: "Help build scalable civic applications as a data engineer at a fast-growing startup.",
    post_type: "job",
    poster_name: "Logan Perez",
    tags: ["Data Engineer", "Civic Tech", "Apps", "Startup", "Scalable"]
  },
  {
    title: "General: Tech Policy Podcast Recommendations",
    description: "Share your favorite podcasts on technology and public policy.",
    post_type: "general",
    poster_name: "Layla Rivera",
    tags: ["Tech Policy", "Podcasts", "Civic Tech", "Recommendations", "Media"]
  },
  {
    title: "Event: Hack for Housing",
    description: "Collaborate on tech solutions for affordable housing at our annual hackathon.",
    post_type: "event",
    poster_name: "Wyatt Bennett",
    tags: ["Housing", "Hackathon", "Civic Tech", "Collaboration", "Affordable"]
  },
  {
    title: "Project: Open Source Voting Platform",
    description: "Seeking contributors for an open source, secure online voting platform for local elections.",
    post_type: "project",
    poster_name: "Scarlett Ross",
    tags: ["Open Source", "Voting", "Civic Tech", "Security", "Elections"]
  },
  {
    title: "Job: Data Policy Intern",
    description: "Support data governance and privacy initiatives as an intern at a major policy institute.",
    post_type: "job",
    poster_name: "Julian Foster",
    tags: ["Data Policy", "Intern", "Governance", "Privacy", "Institute"]
  },
  {
    title: "General: Civic Tech in Education",
    description: "How can civic tech improve educational outcomes? Share your ideas and projects.",
    post_type: "general",
    poster_name: "Aurora Simmons",
    tags: ["Civic Tech", "Education", "Policy", "Ideas", "Projects"]
  },
  {
    title: "Event: Smart Sensors for Safer Cities",
    description: "Learn about the latest in smart sensors and their applications for urban safety and policy.",
    post_type: "event",
    poster_name: "Sebastian Bailey",
    tags: ["Smart Sensors", "Urban Policy", "Safety", "Civic Tech", "Event"]
  },
  {
    title: "Project: Digital Divide Mapping",
    description: "Help us map and analyze the digital divide in Chicago neighborhoods using public data.",
    post_type: "project",
    poster_name: "Penelope Morris",
    tags: ["Digital Divide", "Mapping", "Chicago", "Civic Tech", "Data Science"]
  },
  {
    title: "Job: Public Policy Data Analyst",
    description: "Join a think tank as a data analyst focusing on public policy research and impact evaluation.",
    post_type: "job",
    poster_name: "Nathaniel Reed",
    tags: ["Public Policy", "Data Analyst", "Think Tank", "Impact", "Research"]
  },
  {
    title: "General: Civic Tech and Accessibility",
    description: "Discuss best practices for making civic tech tools accessible to all users.",
    post_type: "general",
    poster_name: "Ellie Cooper",
    tags: ["Civic Tech", "Accessibility", "Best Practices", "Inclusion", "Tools"]
  },
  {
    title: "Event: Urban Mobility Data Challenge",
    description: "Compete in our data challenge to solve real-world urban mobility issues with data science.",
    post_type: "event",
    poster_name: "Leo Bell",
    tags: ["Urban Mobility", "Data Challenge", "Data Science", "Civic Tech", "Competition"]
  },
  {
    title: "Project: Civic Chatbot for City Services",
    description: "Develop a chatbot to help residents navigate city services and resources.",
    post_type: "project",
    poster_name: "Violet Brooks",
    tags: ["Chatbot", "City Services", "Civic Tech", "AI", "Resources"]
  },
  {
    title: "Job: Environmental Policy Tech Lead",
    description: "Lead the tech team at an environmental policy nonprofit focused on climate data analysis.",
    post_type: "job",
    poster_name: "Hudson Gray",
    tags: ["Environmental Policy", "Tech Lead", "Climate Data", "Nonprofit", "Analysis"]
  },
  {
    title: "General: Data Privacy in Civic Tech",
    description: "What are the biggest privacy challenges in civic tech? Let’s discuss solutions and frameworks.",
    post_type: "general",
    poster_name: "Hazel Stewart",
    tags: ["Data Privacy", "Civic Tech", "Challenges", "Solutions", "Frameworks"]
  },
  {
    title: "Event: Civic Tech Career Fair",
    description: "Meet employers and discover job opportunities in civic tech and public policy.",
    post_type: "event",
    poster_name: "Elijah Parker",
    tags: ["Civic Tech", "Career Fair", "Jobs", "Public Policy", "Employers"]
  },
  {
    title: "Project: Predictive Policing Analysis",
    description: "Analyze the impact and ethics of predictive policing algorithms in urban areas.",
    post_type: "project",
    poster_name: "Madison Rivera",
    tags: ["Predictive Policing", "Ethics", "Urban Policy", "Civic Tech", "ML"]
  },
  {
    title: "Job: Tech Policy Research Assistant",
    description: "Assist with research on the intersection of technology and policy at a leading university.",
    post_type: "job",
    poster_name: "Gabriel Barnes",
    tags: ["Tech Policy", "Research Assistant", "University", "Technology", "Policy"]
  },
  {
    title: "General: Civic Tech and Mental Health",
    description: "How can technology improve access to mental health resources? Share your thoughts.",
    post_type: "general",
    poster_name: "Savannah Ward",
    tags: ["Civic Tech", "Mental Health", "Resources", "Access", "Technology"]
  },
  {
    title: "Event: Open Data Day Chicago",
    description: "Celebrate open data with workshops, talks, and networking in Chicago.",
    post_type: "event",
    poster_name: "Carter Hall",
    tags: ["Open Data", "Chicago", "Workshops", "Networking", "Civic Tech"]
  },
  {
    title: "Project: ML for Disaster Response",
    description: "Collaborate on machine learning models to improve disaster response and resource allocation.",
    post_type: "project",
    poster_name: "Stella James",
    tags: ["ML", "Disaster Response", "Resource Allocation", "Civic Tech", "Collaboration"]
  },
  {
    title: "Job: Urban Policy Data Visualization Specialist",
    description: "Create impactful visualizations to support urban policy research and advocacy.",
    post_type: "job",
    poster_name: "Easton Rogers",
    tags: ["Urban Policy", "Data Visualization", "Advocacy", "Research", "Specialist"]
  },
  {
    title: "General: Favorite Civic Tech APIs",
    description: "What APIs do you use for civic tech projects? Share your recommendations.",
    post_type: "general",
    poster_name: "Brooklyn Griffin",
    tags: ["Civic Tech", "APIs", "Projects", "Recommendations", "Tools"]
  },
  {
    title: "Event: Public Policy Data Hack",
    description: "Join our hackathon to tackle pressing public policy issues with data-driven solutions.",
    post_type: "event",
    poster_name: "Lincoln Hayes",
    tags: ["Public Policy", "Hackathon", "Data Science", "Civic Tech", "Solutions"]
  },
  {
    title: "Project: Civic Tech for Clean Energy",
    description: "Work on open-source tools to promote clean energy adoption in local communities.",
    post_type: "project",
    poster_name: "Mila Butler",
    tags: ["Civic Tech", "Clean Energy", "Open Source", "Community", "Tools"]
  },
  {
    title: "Job: Data Science Tutor for Policy Students",
    description: "Help public policy students learn data science skills as a peer tutor.",
    post_type: "job",
    poster_name: "Ryder Cox",
    tags: ["Data Science", "Tutor", "Policy Students", "Skills", "Peer"]
  },
  {
    title: "General: Civic Tech and Digital Literacy",
    description: "Discuss strategies for improving digital literacy through civic tech initiatives.",
    post_type: "general",
    poster_name: "Peyton Diaz",
    tags: ["Civic Tech", "Digital Literacy", "Strategies", "Initiatives", "Discussion"]
  },
  {
    title: "Event: AI for Social Impact Conference",
    description: "Attend talks and panels on how AI is driving positive change in society.",
    post_type: "event",
    poster_name: "Aaliyah Myers",
    tags: ["AI", "Social Impact", "Conference", "Panels", "Civic Tech"]
  },
  {
    title: "Project: Housing Data Dashboard",
    description: "Help build an interactive dashboard to track housing affordability metrics in Chicago.",
    post_type: "project",
    poster_name: "Colton Jenkins",
    tags: ["Housing", "Dashboard", "Chicago", "Data Science", "Civic Tech"]
  },
  {
    title: "Job: Public Health Data Analyst",
    description: "Work with public health officials to analyze and visualize health data for policy decisions.",
    post_type: "job",
    poster_name: "Ariana Torres",
    tags: ["Public Health", "Data Analyst", "Visualization", "Policy", "Health"]
  },
  {
    title: "General: Tech for Environmental Justice",
    description: "How can technology promote environmental justice? Share your ideas and case studies.",
    post_type: "general",
    poster_name: "Eli Powell",
    tags: ["Technology", "Environmental Justice", "Civic Tech", "Ideas", "Case Studies"]
  },
  {
    title: "Event: Civic Tech Lightning Talks",
    description: "Sign up to give a five-minute lightning talk on your latest civic tech project.",
    post_type: "event",
    poster_name: "Gianna Flores",
    tags: ["Civic Tech", "Lightning Talks", "Projects", "Event", "Presentation"]
  },
  {
    title: "Project: Data Science for Water Quality",
    description: "Join a team analyzing water quality data to inform local environmental policy.",
    post_type: "project",
    poster_name: "Miles Simmons",
    tags: ["Data Science", "Water Quality", "Environmental Policy", "Civic Tech", "Analysis"]
  },
  {
    title: "Job: Policy Communications Intern",
    description: "Assist with communications and outreach for a policy-focused civic tech nonprofit.",
    post_type: "job",
    poster_name: "Vivian Kim",
    tags: ["Policy", "Communications", "Intern", "Civic Tech", "Outreach"]
  },
  {
    title: "General: Open Source for Social Good",
    description: "Discuss the impact of open source projects on social and public policy issues.",
    post_type: "general",
    poster_name: "Roman Perry",
    tags: ["Open Source", "Social Good", "Public Policy", "Civic Tech", "Discussion"]
  },
  {
    title: "Event: Data Science for Democracy",
    description: "Explore how data science can strengthen democratic institutions and processes.",
    post_type: "event",
    poster_name: "Madeline Morgan",
    tags: ["Data Science", "Democracy", "Institutions", "Processes", "Civic Tech"]
  },
  {
    title: "Project: Urban Heat Mapping",
    description: "Help map urban heat islands in Chicago to inform climate adaptation strategies.",
    post_type: "project",
    poster_name: "Jace Hughes",
    tags: ["Urban Heat", "Mapping", "Chicago", "Climate Change", "Civic Tech"]
  },
  {
    title: "Job: Data Policy Advocate",
    description: "Advocate for responsible data practices in public policy at a leading nonprofit.",
    post_type: "job",
    poster_name: "Genevieve Bennett",
    tags: ["Data Policy", "Advocate", "Responsible Data", "Nonprofit", "Public Policy"]
  },
  {
    title: "General: Civic Tech and Urban Design",
    description: "Share examples of how technology is shaping urban design and planning.",
    post_type: "general",
    poster_name: "Jasper Mitchell",
    tags: ["Civic Tech", "Urban Design", "Planning", "Technology", "Examples"]
  },
  {
    title: "Event: Civic Tech for Accessibility",
    description: "Workshop on designing accessible civic tech tools for all users.",
    post_type: "event",
    poster_name: "Rylee Ramirez",
    tags: ["Civic Tech", "Accessibility", "Workshop", "Design", "Tools"]
  },
  {
    title: "Project: ML for Public Safety",
    description: "Develop machine learning solutions to improve public safety outcomes in urban areas.",
    post_type: "project",
    poster_name: "Beau Carter",
    tags: ["ML", "Public Safety", "Urban Areas", "Civic Tech", "Solutions"]
  },
  {
    title: "Job: Researcher - Tech & Urban Policy",
    description: "Conduct research on the intersection of emerging technologies and urban policy.",
    post_type: "job",
    poster_name: "Valentina Bailey",
    tags: ["Research", "Tech", "Urban Policy", "Emerging Tech", "Policy"]
  },
  {
    title: "General: Data Science Learning Resources",
    description: "Share your favorite resources for learning data science in a policy context.",
    post_type: "general",
    poster_name: "Cameron Foster",
    tags: ["Data Science", "Learning", "Resources", "Policy", "Education"]
  },
  {
    title: "Event: Civic Tech Open House",
    description: "Tour our civic tech lab and meet project teams working on public interest technology.",
    post_type: "event",
    poster_name: "Aubrey Price",
    tags: ["Civic Tech", "Open House", "Lab", "Projects", "Public Interest"]
  },
  {
    title: "Project: Data-Driven Public Art",
    description: "Collaborate on a public art project that uses data to tell stories about community issues.",
    post_type: "project",
    poster_name: "Sawyer Long",
    tags: ["Public Art", "Data", "Community", "Civic Tech", "Storytelling"]
  },
  {
    title: "Job: Civic Tech UX Designer",
    description: "Design user-friendly interfaces for civic engagement platforms.",
    post_type: "job",
    poster_name: "Mackenzie Sanders",
    tags: ["Civic Tech", "UX", "Design", "Engagement", "Platforms"]
  },
  {
    title: "General: Policy Hackathon Ideas",
    description: "What challenges would you like to see at our next policy hackathon?",
    post_type: "general",
    poster_name: "Finn Hawkins",
    tags: ["Policy", "Hackathon", "Ideas", "Civic Tech", "Challenges"]
  },
  {
    title: "Event: Civic Tech Film Night",
    description: "Watch and discuss documentaries on technology and society.",
    post_type: "event",
    poster_name: "Maya Sullivan",
    tags: ["Civic Tech", "Film", "Documentaries", "Society", "Discussion"]
  },
  {
    title: "Project: Data Science for Transit Equity",
    description: "Analyze transit data to identify and address inequities in public transportation.",
    post_type: "project",
    poster_name: "Bryson Webb",
    tags: ["Data Science", "Transit Equity", "Public Transportation", "Civic Tech", "Analysis"]
  },
  {
    title: "Job: Tech Policy Writer",
    description: "Write policy briefs and blog posts on technology issues for a civic tech organization.",
    post_type: "job",
    poster_name: "Lila Patterson",
    tags: ["Tech Policy", "Writer", "Policy Briefs", "Civic Tech", "Blog"]
  },
  {
    title: "General: Civic Tech and Rural Communities",
    description: "How can civic tech address the unique needs of rural communities?",
    post_type: "general",
    poster_name: "Oscar Armstrong",
    tags: ["Civic Tech", "Rural", "Communities", "Needs", "Discussion"]
  },
  {
    title: "Event: ML for Social Policy Seminar",
    description: "Seminar on applying machine learning to social policy challenges.",
    post_type: "event",
    poster_name: "Sienna Matthews",
    tags: ["ML", "Social Policy", "Seminar", "Civic Tech", "Challenges"]
  },
  {
    title: "Project: Civic Tech for Emergency Alerts",
    description: "Help develop a real-time emergency alert system for local governments.",
    post_type: "project",
    poster_name: "Graham Ford",
    tags: ["Civic Tech", "Emergency Alerts", "Real-Time", "Local Government", "System"]
  },
  {
    title: "Job: Data Visualization Specialist - Climate",
    description: "Create interactive climate data visualizations for a public policy nonprofit.",
    post_type: "job",
    poster_name: "Paisley Bishop",
    tags: ["Data Visualization", "Climate", "Nonprofit", "Public Policy", "Interactive"]
  },
  {
    title: "General: Civic Tech and Youth Engagement",
    description: "Discuss ways to engage youth in civic tech initiatives.",
    post_type: "general",
    poster_name: "Charlie Cross",
    tags: ["Civic Tech", "Youth", "Engagement", "Initiatives", "Discussion"]
  },
  {
    title: "Event: Policy Data Visualization Night",
    description: "Showcase your policy data visualizations and get feedback from experts.",
    post_type: "event",
    poster_name: "Jordyn Peters",
    tags: ["Policy", "Data Visualization", "Showcase", "Experts", "Feedback"]
  },
  {
    title: "Project: Civic Tech for Language Access",
    description: "Develop tools to improve language access in city services.",
    post_type: "project",
    poster_name: "Kayden Bryant",
    tags: ["Civic Tech", "Language Access", "City Services", "Tools", "Inclusion"]
  },
  {
    title: "Job: Urban Policy Research Fellow",
    description: "Research urban policy issues and support data-driven advocacy.",
    post_type: "job",
    poster_name: "Isabelle Doyle",
    tags: ["Urban Policy", "Research", "Fellow", "Advocacy", "Data-Driven"]
  },
  {
    title: "General: Civic Tech and Public Safety",
    description: "Share examples of civic tech improving public safety in your community.",
    post_type: "general",
    poster_name: "Everett Barker",
    tags: ["Civic Tech", "Public Safety", "Community", "Examples", "Discussion"]
  }
];
