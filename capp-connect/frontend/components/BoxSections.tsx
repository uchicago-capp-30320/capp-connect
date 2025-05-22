import { View, Text, StyleSheet, SafeAreaView, StyleProp, ViewStyle } from "react-native";
import TextField from "@/components/TextField";
import { Colors, Containers } from "@/themes";

interface BoxSectionProps {
  title: string
  fields: string[]
  labelDataMap: {[key: string]: string}
  data: Map<string, string>
  updateData: Function
  editMode: boolean
  style: StyleProp<ViewStyle>
}

export default function BoxSection(props: BoxSectionProps) {
    // grouped sections
    return (
      <View style={[styles.box, props.style]}>
        <Text style={styles.boxTitle}>{props.title}</Text>

        {props.fields.map(field => (
          <TextField
            key={field}
            label={props.labelDataMap[field]}
            dataKey={field}
            data={props.data}
            updateData={props.updateData}
            editMode={props.editMode}
            style={styles.textField}
          />
        ))}
      </View>
    )
  }

  const styles = StyleSheet.create({
    box: {},
    boxTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: Colors.primary,
      marginBottom: 10,
    },
    textField: {
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "#ccccc",
      padding: 5,
    }
  });
