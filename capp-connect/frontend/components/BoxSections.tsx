import { View, Text, StyleSheet, SafeAreaView, StyleProp, ViewStyle } from "react-native";
import TextField from "@/components/TextField";

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
            style={styles.textbox}
          />
        ))}
      </View>
    )
  }

// for now -- I know we have a style sheet coming in PR 
const styles = StyleSheet.create({
  box: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddddd",
    borderRadius: 5,
    backgroundColor: "#fffff"
  },
  boxTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5
  },
  textbox: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccccc",
    padding: 5
  }
})