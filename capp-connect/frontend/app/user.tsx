import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfilePhoto from "@/components/ProfilePhoto";
import TagCarousel from "@/components/TagCarousel";
import * as Device from "expo-device";
import { Colors, Containers } from "@/themes";
import createTagColorMapper from "@/utils/tagColorMapper";
import fetchData from "@/utils/fetchdata";
import { useLocalSearchParams } from "expo-router";
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

export default function UserProfilePage() {
  const { username } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;

      try {
        const data: UserProfile = await
        fetchData(
          `${API_BASE_URL}/profile/${username}/`,
          "GET",
          {});
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    }

    fetchProfile();
  }, [username]);

  const display = (value: string | null) => value?.trim() || "N/A";

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
              <ProfilePhoto imageUrl={profile.photo_url ?? ""} style={styles.profilePhoto} user={profile.user} />
              <View style={styles.headerInfo}>
                <Text style={styles.nameText}>{display(profile.slack_username)}</Text>
                <Text style={styles.positionText}>
                  {display(profile.job_title)} | {display(profile.company)}
                </Text>
              </View>
            </View>

            <View style={styles.tagsContainer}>
              {tagObjects.length > 0 ? (
                <TagCarousel searchType="Directory" tags={tagObjects} />
              ) : (
                <Text style={{ color: "#888" }}>No tags listed</Text>
              )}
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text>{display(profile.bio)}</Text>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text>City: {display(profile.city)}</Text>
            <Text>State: {display(profile.state)}</Text>
            <Text>Country: {display(profile.country)}</Text>
          </View>

          {/* Employment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment</Text>
            <Text>Status: {display(profile.employment_status)}</Text>
            <Text>Job Title: {display(profile.job_title)}</Text>
            <Text>Company: {display(profile.company)}</Text>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text>Phone: {display(profile.phone_number)}</Text>
            <Text>Slack: {display(profile.slack_username)}</Text>
          </View>

          {/* Websites Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Websites</Text>
            {profile.linkedin_url ? (
              <TouchableOpacity onPress={() => Linking.openURL(profile.linkedin_url!)}>
                <Text style={styles.link}>{profile.linkedin_url}</Text>
              </TouchableOpacity>
            ) : (
              <Text>LinkedIn: N/A</Text>
            )}
            {profile.github_url ? (
              <TouchableOpacity onPress={() => Linking.openURL(profile.github_url!)}>
                <Text style={styles.link}>{profile.github_url}</Text>
              </TouchableOpacity>
            ) : (
              <Text>GitHub: N/A</Text>
            )}
            {profile.personal_site ? (
              <TouchableOpacity onPress={() => Linking.openURL(profile.personal_site!)}>
                <Text style={styles.link}>{profile.personal_site}</Text>
              </TouchableOpacity>
            ) : (
              <Text>Website: N/A</Text>
            )}
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
  link: {
    color: Colors.primary,
    textDecorationLine: "underline",
    marginBottom: 4,
  },
});
