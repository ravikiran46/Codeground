/* eslint-disable react/prop-types */
import { Editor, useMonaco } from "@monaco-editor/react";
import theme from "monaco-themes/themes/GitHub.json";

const CodeEditor = ({ language, code, onChange }) => {
  const monaco = useMonaco();
  monaco?.editor.defineTheme("githubdark", theme);

  const handleEditorcode = (value) => {
    onChange("code", value);
  };
  return (
    <div className="w-full h-full overflow-hidden border-2 overlay ">
      <Editor
        theme="githubdark"
        height="80vh"
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
