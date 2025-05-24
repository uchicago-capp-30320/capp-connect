import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import * as Device from 'expo-device';
import ProfilePhoto from "./ProfilePhoto";
import createTagColorMapper from "../utils/tagColorMapper";
import { useRouter } from "expo-router";
import TagCarousel from "./TagCarousel";
<<<<<<< HEAD
import { useState } from "react";

// create conditional styling for desktop vs mobile
// const CARD_HEIGHT = Device.deviceType === Device.DeviceType.DESKTOP ? 200 : 120;
const PADDING = Device.deviceType === Device.DeviceType.DESKTOP ? 10 : 6;
=======
import { Colors, Containers} from "@/themes";

// create conditional styling for desktop vs mobile
>>>>>>> fdd6f2811eecb4d368eeca746daabd795e9c15c0
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
<<<<<<< HEAD
  const [ cardWidth, setCardWidth ] = useState(100)
  const [ profileWidth, setProfileWidth ] = useState(60)

  // format location
=======
  const router = useRouter();

>>>>>>> fdd6f2811eecb4d368eeca746daabd795e9c15c0
  const location = [props.city, props.state, props.country]
    .filter(item => item)
    .join(", ");

  const tagObjects = props.tags.map(tag => ({
    name: tag,
    color: getColorForTag(tag)
  }));

  return (
    <TouchableHighlight
<<<<<<< HEAD
      onPress={() => {
        const router = useRouter()
        router.push(
            `/profile?id=${encodeURIComponent(props.user)}`)
      }}
      activeOpacity={.6}
      underlayColor="#DDDDDD"
      style={styles.container}
      onLayout={(e) => {
        setCardWidth(e.nativeEvent.layout.width)
      }}
    >
      <View style={styles.cardBackground}>
        <View style={{flexDirection: "row"}}>
          <View onLayout={(e) => {
            setProfileWidth(e.nativeEvent.layout.width)
          }}>
           <ProfilePhoto style={styles.image}/>
           {/* create more space */}
           <View style={{height: 50}}></View>
=======
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
>>>>>>> fdd6f2811eecb4d368eeca746daabd795e9c15c0
          </View>
          {/* offset container to the left by the size of the profile photo to be truly centered */}
          <View style={[styles.infoContainer, {marginLeft: -profileWidth}]}>
             {/* profile info */}
           <Text style={[styles.name]}>{props.name}</Text>
            <Text style={styles.job_title}>{props.job_title}</Text>
            <Text style={styles.company}>{props.company}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        {/* tags */}
        <View style={[styles.tagsContainer]}>
          <TagCarousel tags={tagObjects} style={{alignSelf: "center", maxWidth: cardWidth*.95, minWidth: 80, flexShrink: 1}}/>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    borderRadius: BORDER_RADIUS,
    alignSelf: "center",
    height: "auto",
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
    flexDirection: "column"
  },
  infoContainer: {
    flex: 1,
    marginLeft: Device.deviceType === Device.DeviceType.DESKTOP ? 15 : 10,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
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
    marginTop: Device.deviceType === Device.DeviceType.DESKTOP ? 5 : 3,
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
=======
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
>>>>>>> fdd6f2811eecb4d368eeca746daabd795e9c15c0
  },
  image: {
    width: PROFILE_PHOTO_SIZE,
    height: PROFILE_PHOTO_SIZE,
    borderRadius: PROFILE_PHOTO_SIZE / 2,
    borderWidth: 1
  },
<<<<<<< HEAD
=======
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
>>>>>>> fdd6f2811eecb4d368eeca746daabd795e9c15c0
});
