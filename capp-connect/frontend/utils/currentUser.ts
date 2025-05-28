import fetchData from "./fetchdata";
import { API_BASE_URL } from "./constants";

export async function
    getCurrentUser(): Promise<Map<string, string> | null> {
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
}

export async function getPhotoUrlUser(username: string): Promise<string | null> {
    try {
      const profile = await fetchData(
        `${API_BASE_URL}/profile/${username}/`,
        "GET",
        { format: "json" }
      );
      return profile?.photo_url || null;
    } catch (err) {
      console.error("[getPhotoUrlUser] Failed to fetch:", err);
      return null;
    }
  }
