import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { Containers, Colors } from "@/themes";
import TagIcon from "./TagIcon";
import createTagColorMapper from "@/utils/tagColorMapper";

type Props = {
  title: string;
  description: string;
  links: string;
  tags: string[]
};

export default function ResourceCard({ title, description, links, tags }: Props) {
  // create Tag color mapper:
  const getColorForTag = createTagColorMapper();

  return (
    <View style={[Containers.cards, styles.card, {flexDirection: "column", minHeight: 200}]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>
        {description || "No description available"}
      </Text>
      {links && (
        <TouchableOpacity onPress={() => Linking.openURL(links)}>
          <Text style={styles.link}>Visit Resource</Text>
        </TouchableOpacity>
      )}
      <View style={{
          flex:1,
          flexDirection:"row",
          position:"absolute",
          bottom:10,
          flexWrap: 'wrap',
          marginTop: 10
          }}
      >
          {tags.map((tag, index) => (
              <TagIcon key={index} tag={tag} color={getColorForTag(tag)} style={{}} deletable={false} searchType={"Resources"}/>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  link: {
    fontSize: 16,
    color: Colors.tertiary,
    textDecorationLine: "underline",
    marginBottom: 4,
  },
});
