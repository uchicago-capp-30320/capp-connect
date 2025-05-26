import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfilePhoto from "@/components/ProfilePhoto";
import EditButton from "@/components/EditButton";
import BoxSection from "@/components/BoxSections";
import TagCarousel from "@/components/TagCarousel";
import * as Device from "expo-device";
import { Colors, Containers } from "@/themes";
import createTagColorMapper from "@/utils/tagColorMapper";
import fetchData from "@/utils/fetchdata";
import { useLocalSearchParams } from "expo-router";

const labelDataMap = {
  name: "Name",
  bio: "",
  tags: "Tags",
  city: "City",
  state: "State",
  country: "Country",
  employment_status: "Employment Status",
  job_title: "Job Title",
  company: "Company",
  linkedin_username: "LinkedIn",
  github_username: "GitHub",
  personal_site: "Website",
  phone_number: "Phone",
  slack_url: "Slack Message",
};

const bioFields = ["bio"];
const infoFields = ["city", "state", "country", "employment_status"];
const websiteFields = ["linkedin_username", "github_username", "personal_site"];
const contactFields = ["phone_number", "slack_url"];

export default function UserProfile() {
  const { username } = useLocalSearchParams();
  const [editMode, changeEditMode] = useState(false);
  const [data, changeData] = useState(new Map<string, string>());

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;
      const profile = await fetchData(`http://127.0.0.1:8080/ccserver/profile/${username}/`, "GET");
      const map = new Map<string, string>();
      Object.entries(profile).forEach(([key, value]) => {
        map.set(key, typeof value === "string" ? value : Array.isArray(value) ? value.join(", ") : "");
      });
      changeData(map);
    }

    fetchProfile();
  }, [username]);

  const getColorForTag = createTagColorMapper();
  const tagsString = data.get("tags") || "";
  const tagsArray = tagsString.split(", ").filter(tag => tag.length > 0);
  const tagObjects = tagsArray.map(tag => ({
    name: tag,
    color: getColorForTag(tag),
  }));

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile */}
        <View style={styles.headerSection}>
          <View style={styles.profileHeader}>
            <ProfilePhoto style={styles.profilePhoto} />
            <View style={styles.headerInfo}>
              <Text style={styles.nameText}>{data.get("name")}</Text>
              <Text style={styles.positionText}>
                {data.get("job_title")} | {data.get("company")}
              </Text>
            </View>
            <EditButton editMode={editMode} changeEditMode={changeEditMode} />
          </View>

          <View style={styles.tagsContainer}>
            <TagCarousel tags={tagObjects} />
          </View>
        </View>

        {/* Save Button */}
        {editMode && (
          <View style={{ marginBottom: 20 }}>
            <Text
              onPress={async () => {
                const updatedProfile = Object.fromEntries(data.entries());
                try {
                  await fetchData(`http://127.0.0.1:8080/ccserver/profile/${username}/`, "PUT", updatedProfile);
                  changeEditMode(false);
                  console.log("Profile updated!");
                } catch (err) {
                  console.error("Error updating profile:", err);
                }
              }}
              style={styles.saveButton}
            >
              Save
            </Text>
          </View>
        )}

        {/* Sections */}
        <BoxSection
          title="Biography"
          fields={bioFields}
          labelDataMap={labelDataMap}
          data={data}
          editMode={editMode}
          updateData={changeData}
          style={styles.fullBox}
        />

        <View style={{ flex: 1, flexDirection: "row" }}>
            <BoxSection
              title="Info"
              fields={infoFields}
              labelDataMap={labelDataMap}
              data={data}
              editMode={editMode}
              updateData={changeData}
              style={styles.halfBox}
            />

          <View style={{ flex: 1 }} />

          <BoxSection
              title="Contact"
              fields={contactFields}
              labelDataMap={labelDataMap}
              data={data}
              editMode={editMode}
              updateData={changeData}
              style={styles.halfBox}
          />
        </View>

        <View style={{ height: 10 }} />

        <BoxSection
            title="Websites"
            fields={websiteFields}
            labelDataMap={labelDataMap}
            data={data}
            editMode={editMode}
            updateData={changeData}
            style={styles.fullBox}
        />
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
  bioSection: {
    ...Containers.cards,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 22,
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfBox: {
    width: "48%",
    ...Containers.cards,
  },
  fullBox: {
    width: "100%",
    marginBottom: 15,
    ...Containers.cards,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "bold",
    alignSelf: "center",
  },
});
