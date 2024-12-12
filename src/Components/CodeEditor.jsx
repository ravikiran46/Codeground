/* eslint-disable react/prop-types */
import { Editor, useMonaco } from "@monaco-editor/react";
import theme from "monaco-themes/themes/GitHub.json";

const CodeEditor = ({ language, code, onChange }) => {
  const monaco = useMonaco();
  monaco?.editor.defineTheme("githubdark", theme);

  const handleEditorcode = (value) => {
    // setcontent(value);
    onChange("code", value);
  };
  return (
    <div className="overlay border-2 overflow-hidden w-full h-full ">
      <Editor
        theme="githubdark"
        height="85vh"
        width={"100%"}
        language={language || "java"}
        value={code}
        defaultValue={code}
        onChange={handleEditorcode}
      ></Editor>
    </div>
  );
};

export default CodeEditor;
