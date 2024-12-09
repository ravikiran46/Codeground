import { useState } from "react";
import CodeEditor from "./CodeEditor";
const Home = () => {
  const [code, setcode] = useState("");
  const [language, setlanguage] = useState("java");
  const oncodechange = (action, data) => {
    switch (action) {
      case "code": {
        setcode(data);
        break;
      }
      default: {
        console.log("cannot handle", action, data);
      }
    }
  };
  return (
    <>
      <div>
        <CodeEditor code={code} onchange={oncodechange} language={language} />
      </div>
    </>
  );
};

export default Home;
