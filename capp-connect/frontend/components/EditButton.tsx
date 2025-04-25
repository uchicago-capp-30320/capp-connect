import { Button } from "react-native";
import { useState } from "react";

// The text box should take a key/label for the text box, as well as a current value
interface EditButtonProps {
    editMode: boolean
    changeEditMode: Function
}

export default function EditButton({editMode, changeEditMode}: EditButtonProps) {
    // create edit button that is togglable between edit and save

    const [buttonText, changeButtonText] = useState("Edit")

    return (
        <Button 
            title={buttonText}
            onPress={
                () => {
                    !editMode ? changeButtonText("Save") : changeButtonText("Edit")
                    changeEditMode(!editMode)
                }} 
        />
    )
}