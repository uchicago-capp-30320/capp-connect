import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import * as Device from 'expo-device';
import ProfilePhoto from "./ProfilePhoto";
import createTagColorMapper from "../utils/tagColorMapper";
import { useRouter } from "expo-router";
import TagCarousel from "./TagCarousel";
import { useState } from "react";

// create conditional styling for desktop vs mobile
// const CARD_HEIGHT = Device.deviceType === Device.DeviceType.DESKTOP ? 200 : 120;
// const PADDING = Device.deviceType === Device.DeviceType.DESKTOP ? 10 : 6;
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
  imageURL: string
}

// create Tag color mapper
const getColorForTag = createTagColorMapper();

export default function ProfileCard(props: ProfileCardProps) {
  const [ cardWidth, setCardWidth ] = useState(100)
  const [ profileWidth, setProfileWidth ] = useState(60)

  // format location
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
      onPress={() => router.push(`/user?username=${props.user}`)}
      activeOpacity={0.6}
      underlayColor={Colors.background}
      style={[Containers.container, styles.compactContainer]} // change height
      onLayout={(e) => {
        setCardWidth(e.nativeEvent.layout.width)
      }}
    >
      <View style={[Containers.cards, styles.cardBackground]}>
        {/* Profile Image */}
        <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}}>
          <View
            style={styles.imageWrapper}
            onLayout={(e) => {
              setProfileWidth(e.nativeEvent.layout.width)
            }}>
            <ProfilePhoto imageUrl={props.imageURL} style={styles.image} user={props.user} />
          </View>

        {/* Profile Info */}
          {/* offset container to the left by the size of the profile photo to be truly centered */}
          <View style={[styles.infoContainer, {marginLeft: -profileWidth}]}>
            <Text style={styles.name}>{props.name}</Text>
            <Text style={styles.jobTitle}>{props.job_title}</Text>
            <Text style={styles.company}>{props.company}</Text>
            <Text style={styles.location}>{location}</Text>
            {/* tags */}
            <View style={[styles.tagsContainer]}>
              <TagCarousel searchType="Directory" tags={tagObjects} style={{alignSelf: "center", maxWidth: cardWidth*.9, flexShrink: 1}}/>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    flex: 1,
    flexShrink: 1,
    height: "auto"
  },
  cardBackground: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Device.deviceType === Device.DeviceType.DESKTOP ? 12 : 8,
    height: "100%",
    width: "100%"
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
    // marginLeft: Device.deviceType === Device.DeviceType.DESKTOP ? 15 : 10,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  },
  name: {
    fontSize: 16,
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
    marginTop: 20,
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    width: "100%"
  }
});
