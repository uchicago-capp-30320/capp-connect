import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import * as Device from 'expo-device';
import ProfilePhoto from "./ProfilePhoto";
import createTagColorMapper from "../utils/tagColorMapper";
import { useRouter } from "expo-router";
import TagCarousel from "./TagCarousel";

// create conditional styling for desktop vs mobile
const CARD_HEIGHT = Device.deviceType === Device.DeviceType.DESKTOP ? 200 : 120;
const PADDING = Device.deviceType === Device.DeviceType.DESKTOP ? 10 : 6;
const PROFILE_PHOTO_SIZE = Device.deviceType === Device.DeviceType.DESKTOP ? 90 : 60;
const BORDER_RADIUS = 5;

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

// Create profile card component for directory
export default function ProfileCard(props: ProfileCardProps) {
  
  // format location
  const location = [props.city, props.state, props.country]
    .filter(item => item) 
    .join(", ");

  const tagObjects = props.tags.map(tag => ({
    name: tag,
    color: getColorForTag(tag)
  }));
  
  return (
    <TouchableHighlight
      onPress={() => {
        const router = useRouter()  
        router.push(
            `/profile?id=${encodeURIComponent(props.user)}`)
      }}
      activeOpacity={.6}
      underlayColor="#DDDDDD"
      style={styles.container}
    >
      <View style={styles.cardBackground}>
        <ProfilePhoto style={styles.image}/>
        
        {/* profile info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.job_title}>{props.job_title}</Text>
          <Text style={styles.company}>{props.company}</Text>
          
          {/* tags */}
          <View style={styles.tagsContainer}>
            <TagCarousel tags={tagObjects} />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS,
    alignSelf: "center",
    height: CARD_HEIGHT,
    width: "95%",
    padding: PADDING
  },
  cardBackground: {
    height: "100%",
    width: "100%",
    backgroundColor: "grey",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: BORDER_RADIUS,
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: Device.deviceType === Device.DeviceType.DESKTOP ? 15 : 10,
    flexDirection: "row"
  },
  infoContainer: {
    flex: 1,
    marginLeft: Device.deviceType === Device.DeviceType.DESKTOP ? 15 : 10,
    justifyContent: "center"
  },
  name: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 18 : 16,
    fontWeight: "bold",
    marginBottom: 2
  },
  location: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 14 : 12,
    color: "#555",
    marginBottom: Device.deviceType === Device.DeviceType.DESKTOP ? 6 : 4
  },
  job_title: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 16 : 14,
    marginBottom: 2
  },
  company: {
    fontSize: Device.deviceType === Device.DeviceType.DESKTOP ? 14 : 12,
    color: "#555",
    marginBottom: Device.deviceType === Device.DeviceType.DESKTOP ? 10 : 6
  },
  tagsContainer: {
    width: "100%",
    marginTop: Device.deviceType === Device.DeviceType.DESKTOP ? 5 : 3
  },
  image: {
    width: PROFILE_PHOTO_SIZE,
    height: PROFILE_PHOTO_SIZE,
    borderRadius: PROFILE_PHOTO_SIZE / 2,
    borderWidth: 1
  },
});