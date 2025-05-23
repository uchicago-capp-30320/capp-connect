import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import * as Device from 'expo-device';
import ProfilePhoto from "./ProfilePhoto";
import createTagColorMapper from "../utils/tagColorMapper";
import { useRouter } from "expo-router";
import TagCarousel from "./TagCarousel";
import { Colors, Containers} from "@/themes";

// create conditional styling for desktop vs mobile
const PROFILE_PHOTO_SIZE = Device.deviceType === Device.DeviceType.DESKTOP ? 90 : 60;

interface ProfileCardProps {
  name: string
  city: string
  state: string
  country: string
  job_title: string
  company: string
  tags: Array<string>
  user: string
}

// create Tag color mapper
const getColorForTag = createTagColorMapper();

export default function ProfileCard(props: ProfileCardProps) {
  const router = useRouter();

  const location = [props.city, props.state, props.country]
    .filter(item => item)
    .join(", ");

  const tagObjects = props.tags.map(tag => ({
    name: tag,
    color: getColorForTag(tag)
  }));

  return (
    <TouchableHighlight
      onPress={() => router.push(`/profile?id=${encodeURIComponent(props.user)}`)}
      activeOpacity={0.6}
      underlayColor={Colors.background}
      style={[Containers.container, styles.compactContainer]} // change height
    >
      <View style={[Containers.cards, styles.cardBackground]}>
        {/* Profile Image */}
        <View style={styles.imageWrapper}>
          <ProfilePhoto style={styles.image} />
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.jobTitle}>{props.job_title}</Text>
          <Text style={styles.company}>{props.company}</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <TagCarousel tags={tagObjects} />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    height: Device.deviceType === Device.DeviceType.DESKTOP ? 210 : 160,
  },
  cardBackground: {
    flexDirection: "row",
    alignItems: "center",
    padding: Device.deviceType === Device.DeviceType.DESKTOP ? 12 : 8
  },
  imageWrapper: {
    paddingRight: 10
  },
  image: {
    width: PROFILE_PHOTO_SIZE,
    height: PROFILE_PHOTO_SIZE,
    borderRadius: PROFILE_PHOTO_SIZE / 2,
    borderWidth: 1
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center"
  },
  name: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 10 : 16,
    fontWeight: "bold",
    marginBottom: 2
  },
  location: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 14 : 12,
    color: "#555",
    marginBottom: 4
  },
  jobTitle: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 16 : 14,
    marginBottom: 2
  },
  company: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 14 : 12,
    color: "#555",
    marginBottom: 6
  },
  tagsContainer: {
    marginTop: 5,
    width: "100%"
  }
});
