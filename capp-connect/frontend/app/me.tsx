import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfilePhoto from "@/components/ProfilePhoto";
import EditButton from "@/components/EditButton";
import TagCarousel from "@/components/TagCarousel";
import * as Device from "expo-device";
import { Colors, Containers } from "@/themes";
import createTagColorMapper from "@/utils/tagColorMapper";
import fetchData from "@/utils/fetchdata";
import { API_BASE_URL } from "@/utils/constants";

type UserProfile = {
  user: string;
  slack_username: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  personal_site: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  phone_number: string | null;
  photo_url: string | null;
  employment_status: string | null;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  tags: string[];
};

export default function Me() {
  const [editMode, changeEditMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data: UserProfile = await fetchData(`${API_BASE_URL}/auth/`, "GET", {});
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch current user profile:", err);
      }
    }

    fetchProfile();
  }, []);

  const getColorForTag = createTagColorMapper();
  const tagObjects = profile?.tags.map(tag => ({
    name: tag,
    color: getColorForTag(tag),
  })) ?? [];

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {profile && (
          <>
            <View style={styles.headerSection}>
              <View style={styles.profileHeader}>
                <ProfilePhoto style={styles.profilePhoto} user={profile.user} />
                <View style={styles.headerInfo}>
                  <Text style={styles.nameText}>{profile.slack_username}</Text>
                  <Text style={styles.positionText}>
                    {profile.job_title ?? "No job title"} | {profile.company ?? "No company"}
                  </Text>
                </View>
                <EditButton editMode={editMode} changeEditMode={changeEditMode} />
              </View>

              <View style={styles.tagsContainer}>
                <TagCarousel tags={tagObjects} />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text>{profile.bio ?? "No bio available."}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <Text>Phone: {profile.phone_number ?? "N/A"}</Text>
              <Text>Slack: {profile.slack_username ?? "N/A"}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Websites</Text>
              <Text>LinkedIn: {profile.linkedin_url ?? "N/A"}</Text>
              <Text>GitHub: {profile.github_url ?? "N/A"}</Text>
              <Text>Website: {profile.personal_site ?? "N/A"}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profilePhoto: {
    width: Device.deviceType === Device.DeviceType.DESKTOP ? 100 : 80,
    height: Device.deviceType === Device.DeviceType.DESKTOP ? 100 : 80,
    borderRadius: Device.deviceType === Device.DeviceType.DESKTOP ? 50 : 40,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  nameText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
  },
  positionText: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  tagsContainer: {
    marginTop: 12,
    height: 70,
  },
  section: {
    ...Containers.cards,
    marginBottom: 15,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
});
