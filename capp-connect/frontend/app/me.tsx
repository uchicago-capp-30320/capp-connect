import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfilePhoto from "@/components/ProfilePhoto";
// import EditButton from "@/components/EditButton"; // Commented out
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
  {/* const [editMode, changeEditMode] = useState(false); */}
  const [profile, setProfile] = useState<UserProfile | null>(null);
  {/* const [formData, setFormData] = useState<Map<string, string>>(new Map()); */}

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data: UserProfile = await fetchData(`${API_BASE_URL}/auth/`, "GET", {});
        setProfile(data);

        {/*
        const initData = new Map<string, string>();
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "string" || value === null) {
            initData.set(key, value ?? "");
          }
        });
        setFormData(initData);
        */}
      } catch (err) {
        console.error("Failed to fetch current user profile:", err);
      }
    }

    fetchProfile();
  }, []);

  const display = (value: string | null) => value?.trim() || "N/A";

  {/*
  const handleChange = (key: string, value: string) => {
    const newForm = new Map(formData);
    newForm.set(key, value);
    setFormData(newForm);
  };

  const handleSave = async () => {
    const dataObj: Record<string, string> = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    try {
      const updated = await fetchData(`${API_BASE_URL}/auth/`, "PUT", dataObj);
      setProfile(updated);
      changeEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };
  */}

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
                  {/* {editMode ? (
                    <TextInput
                      style={styles.nameText}
                      value={formData.get("slack_username") || ""}
                      onChangeText={(text) => handleChange("slack_username", text)}
                    />
                  ) : ( */}
                    <Text style={styles.nameText}>{display(profile.slack_username)}</Text>
                  {/* )} */}
                  <Text style={styles.positionText}>
                    {/* {editMode ? (
                      <>
                        <TextInput
                          style={styles.input}
                          value={formData.get("job_title") || ""}
                          onChangeText={(text) => handleChange("job_title", text)}
                          placeholder="Job Title"
                        />
                        <Text> | </Text>
                        <TextInput
                          style={styles.input}
                          value={formData.get("company") || ""}
                          onChangeText={(text) => handleChange("company", text)}
                          placeholder="Company"
                        />
                      </>
                    ) : ( */}
                      `${display(profile.job_title)} | ${display(profile.company)}`
                    {/* )} */}
                  </Text>
                </View>
                {/* <EditButton editMode={editMode} changeEditMode={changeEditMode} /> */}
              </View>

              <View style={styles.tagsContainer}>
                {tagObjects.length > 0 ? (
                  <TagCarousel tags={tagObjects} searchType="Directory" />
                ) : (
                  <Text style={{ color: "#888" }}>No tags listed</Text>
                )}
              </View>
            </View>

            {/* Bio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bio</Text>
              {/* {editMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.get("bio") || ""}
                  onChangeText={(text) => handleChange("bio", text)}
                  multiline
                />
              ) : ( */}
                <Text>{display(profile.bio)}</Text>
              {/* )} */}
            </View>

            {/* Location Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              {["city", "state", "country"].map((key) => (
                <Text key={key}>
                  {key[0].toUpperCase() + key.slice(1)}:{" "}
                  {/* {editMode ? (
                    <TextInput
                      style={styles.input}
                      value={formData.get(key) || ""}
                      onChangeText={(text) => handleChange(key, text)}
                    />
                  ) : ( */}
                    display(profile[key as keyof UserProfile] as string | null)
                  {/* )} */}
                </Text>
              ))}
            </View>

            {/* Employment Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Employment</Text>
              <Text>
                Status:{" "}
                {/* {editMode ? (
                  <TextInput
                    style={styles.input}
                    value={formData.get("employment_status") || ""}
                    onChangeText={(text) => handleChange("employment_status", text)}
                  />
                ) : ( */}
                  display(profile.employment_status)
                {/* )} */}
              </Text>
              <Text>Job Title: {display(profile.job_title)}</Text>
              <Text>Company: {display(profile.company)}</Text>
            </View>

            {/* Contact Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              {["phone_number", "slack_username"].map((key) => (
                <Text key={key}>
                  {key === "phone_number" ? "Phone" : "Slack"}:{" "}
                  {/* {editMode ? (
                    <TextInput
                      style={styles.input}
                      value={formData.get(key) || ""}
                      onChangeText={(text) => handleChange(key, text)}
                    />
                  ) : ( */}
                    display(profile[key as keyof UserProfile] as string | null)
                  {/* )} */}
                </Text>
              ))}
            </View>

            {/* Websites Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Websites</Text>
              {["linkedin_url", "github_url", "personal_site"].map((key) => (
                <View key={key}>
                  {/* {editMode ? (
                    <TextInput
                      style={styles.input}
                      value={formData.get(key) || ""}
                      onChangeText={(text) => handleChange(key, text)}
                      placeholder={key}
                    />
                  ) : ( */}
                    {profile[key as keyof UserProfile] ? (
                      <TouchableOpacity onPress={() => Linking.openURL(profile[key as keyof UserProfile] as string)}>
                        <Text style={styles.link}>{profile[key as keyof UserProfile]}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text>{`${key.replace("_url", "").replace("_", " ")}: N/A`}</Text>
                    )}
                  {/* )} */}
                </View>
              ))}
            </View>

            {/*
            {editMode && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
            */}
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
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    fontSize: 16,
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  link: {
    color: Colors.primary,
    textDecorationLine: "underline",
    marginBottom: 4,
  },
});
