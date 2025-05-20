import { Button } from "react-native";
import { useState } from "react";

interface EditButtonProps {
  editMode: boolean;
  changeEditMode: (newValue: boolean) => void;
}

export default function EditButton({ editMode, changeEditMode }: EditButtonProps) {
  const [buttonText, changeButtonText] = useState("Edit");

  return (
    <Button
      title={buttonText}
      onPress={() => {
        if (!editMode) {
          changeButtonText("Save");
        } else {
          changeButtonText("Edit");
        }
        changeEditMode(!editMode);
      }}
    />
  );
}
