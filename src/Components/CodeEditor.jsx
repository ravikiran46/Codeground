/* eslint-disable react/prop-types */
import { Editor, useMonaco } from "@monaco-editor/react";
import { useState } from "react";
import theme from "monaco-themes/themes/GitHub.json";

const CodeEditor = ({ language, code, onchange }) => {
  const [content, setcontent] = useState(code || "");
  const monaco = useMonaco();
  monaco?.editor.defineTheme("githubdark", theme);

  const handleEditorcode = (value) => {
    setcontent(value);
    onchange("code", value);
  };

  return (
    <div className="overlay border-2 overflow-hidden w-full h-full ">
      <Editor
        theme="githubdark"
        height="85vh"
        width={"100%"}
        language={language || "java"}
        value={content}
        defaultValue={"// Type or Paste your code here"}
        onchange={handleEditorcode}
      ></Editor>
    </div>
  );
};

export default CodeEditor;
