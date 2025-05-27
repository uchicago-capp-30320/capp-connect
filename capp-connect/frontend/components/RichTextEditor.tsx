import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, ViewStyle, TouchableHighlight } from 'react-native';
// import MarkdownEditor from '@uiw/react-markdown-editor';
import { RichText, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import { Colors, Containers } from '@/themes';

export default function RichTextEditor({style, editable, saveText}: {style?: ViewStyle, editable: boolean, saveText: (text: string) => void}) {
const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    editable: editable,
    dynamicHeight: true
  });

  const content = useEditorContent(editor, {type: "html"})
  useEffect(() => {
    // Will render each time content is updated and call onSave
    content && saveText(content);
    }, [content]);

  const addBorder = editable ? {borderWidth: 2, marginTop: 15} : null

  return (
    <View style={[{ alignItems: "center", height: 300}, style]}>
        <View style={[{ width: "95%", padding: 10, height: "100%"}, addBorder]}>
            {editable ? <Toolbar editor={editor} /> : null}
            <RichText editor={editor} />
        </View>
    </View>
  );
};