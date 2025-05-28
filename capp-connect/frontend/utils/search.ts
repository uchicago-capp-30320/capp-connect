import { setCachedData } from "./caching";
import fetchData from "./fetchdata";
import {useRouter} from 'expo-router'
import { API_BASE_URL } from "./constants";

const SearchTypeMap = {
    Directory: "profiles",
    Resources: "resources",
    Feed: "posts"
}

export default async function Search(tags: string[], searchType: keyof typeof SearchTypeMap) {
    const resp = await fetchData(
                        `${API_BASE_URL}/${SearchTypeMap[searchType]}/search/`,
                        "GET",
                        {tags: tags}
                    )
    await setCachedData(`search_${searchType}`, resp)

    const router = useRouter()
    // Map search_type to allowed static route strings
    switch (searchType) {
        case "Directory":
            router.push(
                `/(tabs)/directory?searchTags=${encodeURIComponent(tags.join(','))}`
            )
            break
        case "Resources":
            router.push(
                `/(tabs)/resources?searchTags=${encodeURIComponent(tags.join(','))}`
            )
            break
        case "Feed":
            router.push(
                `/(tabs)/feed?searchTags=${encodeURIComponent(tags.join(','))}`
            )
    }
}
