import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProfilePhoto from '@/components/ProfilePhoto'
import TextField from "@/components/TextField";
import EditButton from "@/components/EditButton";

// fake data
// should be replaced by function that obtains data from the relevant endpoints
let DATA = new Map([
  ["name", "Bob"],
  ["email", "billybob@gmail.com"],
  ["website", "billybob.com"]
])

// map between data entries and designated labels
const labelDataMap = {
  "name": "Name",
  "email": "Email",
  "website": "Website"
}

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

  return (
      <SafeAreaProvider
        style={{
          padding: 5,
        }}
      >
        <View style={{justifyContent:"center", alignItems: "center"}}>
          <ProfilePhoto style={styles.image}/>
        </View>

        <SafeAreaView>
          {Object.entries(labelDataMap).map(([dataKey, label]) => (
            <TextField
              key={label}
              label={label}
              dataKey={dataKey}
              editMode={editMode}
              data={data}
              updateData={changeData}
              style={styles.textbox}
            />
          ))}
        </SafeAreaView>

        <EditButton editMode={editMode} changeEditMode={changeEditMode}/>

      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2
  },
  textbox: {
    height: 40,
    width: "auto",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
})


// const Square = () => {
//   return <SafeAreaView style={styles.square} />
// }

// const styles = StyleSheet.create({
//   square: {
//     width: 100,
//     height: 100,
//     backgroundColor: "red",
//   },
// });
