import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { Containers, Colors } from "@/themes";
import TagCarousel from "./TagCarousel";
import createTagColorMapper from "@/utils/tagColorMapper";

type Props = {
  title: string;
  description: string;
  links: string;
  tags: string[];
};

export default function ResourceCard({ title, description, links, tags }: Props) {
  const getColorForTag = createTagColorMapper();
  const tagObjects = tags.map(tag => ({
    name: tag,
    color: getColorForTag(tag)
  }));

  return (
    <View style={[Containers.cards, styles.card]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>
        {description || "No description available"}
      </Text>
      {tags.length > 0 && (
        <TagCarousel tags={tagObjects} style={{ marginTop: 10 }} />
      )}
      {links && (
        <TouchableOpacity onPress={() => Linking.openURL(links)}>
          <Text style={styles.link}>Visit Resource</Text>
        </TouchableOpacity>
      )}
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
