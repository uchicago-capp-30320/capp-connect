import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProfilePhoto from '@/components/ProfilePhoto'
import EditButton from "@/components/EditButton";
import BoxSection from '@/components/BoxSections';

// fake data
// should be replaced by function that obtains data from the relevant endpoints
let DATA = new Map([
  // basic info
  ["name", "Bob"], 
  // bio 
  ["bio", "Software engineer"],
  ["tags", "Python"],
  // info
  ["city", "Chicago"],
  ["state", "Illinois"],
  ["country", "USA"],
  ["employment_status", "Full-time"],
  ["job_title", "Software Engineer"],
  ["company", "Department of Education"],
  //websites
  ["linkedin_username", "bob-developer"],
  ["github_username", "billybob"],
  ["personal_site", "billybob.com"],
  //contact
  ["phone_number", "555-123-4567"],
  ["slack_url", "@billybob"]
])

// map between data entries and designated labels
const labelDataMap = {
  // basic info
  "name": "Name",
  // bio
  "bio": "Biography",
  "tags": "Tags",
  // info
  "city": "City",
  "state": "State",
  "country": "Country",
  "employment_status": "Employment Status",
  "job_title": "Job Title",
  "company": "Company",
  // websites
  "linkedin_username": "LinkedIn",
  "github_username": "GitHub",
  "personal_site": "Website",
  //contact 
  "phone_number": "Phone",
  "slack_url": "Slack Message"
}

// grouping 
const bioFields = ["bio", "tags"]
const infoFields = ["city", "state", "country", "employment_status", "job_title", "company"]
const websiteFields = ["linkedin_username", "github_username", "personal_site"]
const contactFields = ["phone_number", "slack_url"]

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

  // dimentions for layout
  const windowWidth = Dimensions.get('window').width
  const boxWidth = windowWidth / 2 - 15
  
  return (
    <SafeAreaProvider
      style={{
        padding: 10,
        flex: 1,
      }}
    >
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15}}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <ProfilePhoto style={styles.ProfilePhoto}/>
          <Text style={{fontSize: 40, fontWeight: "bold", marginLeft: 15}}>{data.get("name")}</Text>
        </View>
        <EditButton editMode={editMode} changeEditMode={changeEditMode}/>
      </View>
      
      <SafeAreaView style={{flex: 1}}>
        <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
          <BoxSection 
            title="Biography" 
            fields={bioFields} 
            labelDataMap={labelDataMap} 
            data={data} 
            editMode={editMode} 
            updateData={changeData}
            style={{width: boxWidth}}
          />
          <BoxSection 
            title="Info" 
            fields={infoFields} 
            labelDataMap={labelDataMap} 
            data={data} 
            editMode={editMode} 
            updateData={changeData}
            style={{width: boxWidth}}
          />
        </View>
        
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <BoxSection 
            title="Websites" 
            fields={websiteFields} 
            labelDataMap={labelDataMap} 
            data={data} 
            editMode={editMode} 
            updateData={changeData}
            style={{width: boxWidth}}
          />
          <BoxSection
            title="Contact" 
            fields={contactFields} 
            labelDataMap={labelDataMap} 
            data={data} 
            editMode={editMode} 
            updateData={changeData}
            style={{width: boxWidth}}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  ProfilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2
  }
})
