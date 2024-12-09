/* eslint-disable react/prop-types */
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
const CodeEditor = ({ language, code, onchange }) => {
  const [content, setcontent] = useState(code || "");
  const handleEditorcode = (value) => {
    setcontent(value);
    onchange("code", value);
    console.log(value);
  };
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full ">
      <Editor
        height="80vh"
        width={"100%"}
        language={language || "java"}
        value={content}
        defaultValue="// Type/Paste your code here"
        onchange={handleEditorcode}
      ></Editor>
    </div>
  );
};

export default CodeEditor;
