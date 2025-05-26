import { setCachedData, getCachedData } from "@/utils/caching";
import fetchData from "@/utils/fetchdata"
import * as Device from 'expo-device';


export async function updateFeed() {
    let cachedData = await getCachedData("feed");
    if (cachedData && cachedData.fullResults) {
        let currentData = cachedData.fullResults    

        if (Device.deviceType === Device.DeviceType.DESKTOP) {
            if (currentData.nextPage === 1) {
                
                const resp = await fetchData(
                    "http://127.0.0.1:8080/ccserver/posts/", 
                    "GET",
                    {format: "json"}
                )
                currentData.nextPage = resp.next_page === null ? 0 : resp.next_page

                const posts = resp.posts
                // without semi colon, JS tries to call it as a function of resp.posts
                ;(["General", "Event", "Job", "Project"]).forEach((element: string) => {
                    currentData[element] = [...currentData[element], ...posts[element]];
                });

                currentData["All"] = combineAndSortByUpdatedAt(currentData)
                cachedData["fullResults"] = currentData

                setCachedData("feed", cachedData)
                return cachedData
            
            } else if (currentData.nextPage > 1) {
                const resp = await fetchData(
                    "http://127.0.0.1:8080/ccserver/posts/", 
                    "GET", 
                    {page: currentData.nextPage}
                )
                // nextPage.current = resp.next_page === null ? 0 : resp.next_page
                currentData.nextPage = resp.next_page === null ? 0 : resp.next_page
                
                const posts = resp.posts
                ;(["General", "Event", "Job", "Project"]).forEach((element: string) => {
                    currentData[element] = [...currentData[element], ...posts[element]];
                });

                currentData["All"] = combineAndSortByUpdatedAt(currentData)
                cachedData["fullResults"] = currentData

                setCachedData("feed", cachedData)
                return cachedData
            }
        }
    }
}


// used chatgpt to help me sort and add the posts together for "all"
type Post = {
  post_id: number;
  user: string;
  title: string;
  description: string;
  links: string;
  location: string;
  post_type: string;
  start_time: string;
  tags: string[];
  updated_at: string; // ISO 8601 string
  created_at: string; // ISO 8601 string
};

type Feed = {
  [category: string]: Post[];
};

function combineAndSortByUpdatedAt(feedObj: Feed): Post[] {
  const combined: Post[] = [];

  for (const key in feedObj) {
    if (key !== 'All' && Array.isArray(feedObj[key])) {
      combined.push(...feedObj[key]);
    }
  }

  combined.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return combined;
}
