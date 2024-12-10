import { useState } from "react";
import CodeEditor from "./CodeEditor";
import Language from "./Language";
import { languageoptions } from "../constants/languageoptions";
const Home = () => {
  const [code, setcode] = useState("");
  const [language, setlanguage] = useState(languageoptions[0]);
  const [output, setoutput] = useState(null);
  const [input, setinput] = useState(null);

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

  const onSelectChange = (lang) => {
    setlanguage(lang);
  };

  return (
    <>
      <div className="">
        {/* select language */}
        <div className="w-full flex  flex-row ml-10">
          <div className="px-5 py-4">
            <button className="border-zinc-300 border p-1.5 rounded-lg">
              Save
            </button>
          </div>
          <div className="px-5 py-4">
            <Language onSelectChange={onSelectChange} />
          </div>
          <div className="px-5 py-4">
            <button className="border p-3 pt-2 pl-5 pr-5 pb-2 rounded-lg bg-green-500  text-white">
              Run
            </button>
          </div>
        </div>

        {/* editor */}
        <div className="md:flex space-x-4">
          <div className="w-fit  md:w-2/3 h-full ml-5">
            <CodeEditor
              code={code}
              onchange={oncodechange}
              language={language?.value}
            />
          </div>

          <div className="flex flex-shrink-0 w-[30%] flex-col">
            <div>output</div>

            <div className="flex flex-col">
              <div>input</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
