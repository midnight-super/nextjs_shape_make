import React from "react";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function RichTextEditor({ text, setText }) {
  return (
    <div className="editor">
      <Editor
        toolbar={{
          options: [
            "inline",
            // "blockType",
            "fontSize",
            // "fontFamily",
            "list",
            "textAlign",

            // 'colorPicker'
            // "link",
            // "embedded",
            // "emoji",
            // "image",
            // "remove",
            // "history",
          ],
        }}
        editorState={text}
        onEditorStateChange={(editorState) => setText(editorState)}
        toolbarClassName=""
        editorClassName="mt-4 p-6 bg-white shadow-md"
      />
    </div>
  );
}
