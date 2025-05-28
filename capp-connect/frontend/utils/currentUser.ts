import fetchData from "./fetchdata";
import { API_BASE_URL } from "./constants";

export async function 
    getCurrentUser(): Promise<Map<string, string> | null> {
  try {
    const profile = 
        await fetchData(
            `${API_BASE_URL}/auth/`, 
            "GET", 
            { format: "json" });

    const map = new Map<string, string>();
    Object.entries(profile).forEach(([key, value]) => {
      map.set(
          key, 
          typeof value === "string" 
              ? value 
              : Array.isArray(value) 
              ? value.join(", ") 
              : ""
      );
    });

    return map;
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
}

export async function 
    getPhotoUrlUser(username: string): Promise<string | null> {
  try {
    const profiles = 
        await fetchData(
            `${API_BASE_URL}/profiles/`, 
            "GET", 
            { format: "json" });

    const match = profiles.find((p: any) => p.user === username);
    return match?.photo_url || null;
  } catch (err) {
    console.error("Failed to fetch photo_url:", err);
    return null;
  }
}
