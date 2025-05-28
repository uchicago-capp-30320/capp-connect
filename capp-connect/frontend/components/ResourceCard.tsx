import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { Containers, Colors } from "@/themes";

type Props = {
  title: string;
  description: string;
  links: string;
};

export default function ResourceCard({ title, description, links }: Props) {
  return (
    <View style={[Containers.cards, styles.card]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>
        {description || "No description available"}
      </Text>
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
