import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfilePhoto from '@/components/ProfilePhoto';
import EditButton from "@/components/EditButton";
import BoxSection from '@/components/BoxSections';
import TagCarousel from '@/components/TagCarousel';
import * as Device from 'expo-device';
import { Colors, Containers } from "@/themes";
import createTagColorMapper from "@/utils/tagColorMapper";
import ProfileDeleteButton from "@/components/ProfileDelete";
import LogoutButton from "@/components/LogoutButton";

// fake data
// should be replaced by function that obtains data from the relevant endpoints
let DATA = new Map([
  // basic info
  ["name", "Bob"],
  // bio
  ["bio", "Software engineer"],
  ["tags", "Python"],
  // info
  ["city", "Chicago"],
  ["state", "Illinois"],
  ["country", "USA"],
  ["employment_status", "Full-time"],
  ["job_title", "Software Engineer"],
  ["company", "Department of Education"],
  //websites
  ["linkedin_username", "bob-developer"],
  ["github_username", "billybob"],
  ["personal_site", "billybob.com"],
  //contact
  ["phone_number", "555-123-4567"],
  ["slack_url", "@billybob"]
])

// map between data entries and designated labels
const labelDataMap = {
  // basic info
  "name": "Name",
  // bio
  "bio": "",
  "tags": "Tags",
  // info
  "city": "City",
  "state": "State",
  "country": "Country",
  "employment_status": "Employment Status",
  "job_title": "Job Title",
  "company": "Company",
  // websites
  "linkedin_username": "LinkedIn",
  "github_username": "GitHub",
  "personal_site": "Website",
  //contact
  "phone_number": "Phone",
  "slack_url": "Slack Message"
}

// grouping -- removed some
const bioFields = ["bio"];
const infoFields = ["city", "state", "country", "employment_status"]
const websiteFields = ["linkedin_username", "github_username", "personal_site"]
const contactFields = ["phone_number", "slack_url"]

export default function Profile() {
  const [editMode, changeEditMode] = useState(false)
  const [data, changeData] = useState(DATA)

  // a listener to identify when the user presses the save button
  // needs to be updated to send a POST request to the database
  // TO BE UPDATED
  useEffect(() => {
    if (!editMode && DATA != data) {
      console.log(data)
      DATA = data
    }
  }, [editMode])

  // tag carousel
  const getColorForTag = createTagColorMapper();
  const tagsString = data.get("tags") || "";
  const tagsArray = tagsString.split(", ").filter(tag => tag.length > 0);
  const tagObjects = tagsArray.map(tag => ({
    name: tag,
    color: getColorForTag(tag)
  }));

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile */}
        <View style={styles.headerSection}>
          <View style={styles.profileHeader}>
            <ProfilePhoto style={styles.profilePhoto}/>

            <View style={styles.headerInfo}>
              <Text style={styles.nameText}>{data.get("name")}</Text>
              <Text style={styles.positionText}>
                {data.get("job_title")} | {data.get("company")}
              </Text>
            </View>

            <EditButton editMode={editMode} changeEditMode={changeEditMode}/>
          </View>

          {/* Tags Carousel */}
          <View style={styles.tagsContainer}>
            <TagCarousel tags={tagObjects} />
          </View>
        </View>

        {/* Bio section */}
        <BoxSection
          title="Biography"
          fields={bioFields}
          labelDataMap={labelDataMap}
          data={data}
          editMode={editMode}
          updateData={changeData}
          style={styles.fullBox}
        />

        {/* Other info */}
        <View style={{flex: 1, flexDirection: "row"}}>
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

          {/* Action-Alert Buttons */}
          <View style={styles.actionButtons}>
            <LogoutButton />
            <ProfileDeleteButton username={data.get("name")} />
          </View>
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
  infoSections: {
    flex: 1,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
}
);
