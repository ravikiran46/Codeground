import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import Language from "./Language";
import { languageoptions } from "../constants/languageoptions";
import Output from "./Output";
import axios from "axios";

const Home = () => {
  const [code, setcode] = useState(languageoptions[0].bpc);
  const [language, setlanguage] = useState(languageoptions[0]);
  const [output, setoutput] = useState(null);
  const [input, setinput] = useState(null);
  const [loading, setloading] = useState(false);

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

  useEffect(() => {}, [code]);

  const onSelectChange = (lang) => {
    setlanguage(lang);
    setcode(lang.bpc);
  };

  const checkstatus = async (token) => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_RAPID_API_URL}/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
    };
    try {
      const response = await axios.request(options);
      const statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkstatus(token);
        }, 2000);
      } else {
        setloading(false);
        setoutput(response.data);
      }
    } catch (err) {
      console.error("Error fetching status:", err);
      setloading(false);
    }
  };

  const handleCompile = () => {
    setloading(true);
    const userdata = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(input || ""),
    };
    const options = {
      method: "POST",
      url: import.meta.env.VITE_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
      data: userdata,
    };
    axios
      .request(options)
      .then((res) => {
        const token = res.data.token;
        checkstatus(token);
      })
      .catch((err) => {
        const error = err.response ? err.response.data : err;
        if (err.response?.status === 429) {
          alert("100 request per day limit reached!");
        }
        setloading(false);
        console.error("Error during compilation:", error);
      });
  };

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button className="p-2 transition duration-200 border rounded-lg border-zinc-300 hover:shadow">
          Save
        </button>
        <Language onSelectChange={onSelectChange} />
        <button
          onClick={handleCompile}
          className={
            loading
              ? "animate-pulse p-3  text-white transition duration-200 bg-green-500 border rounded-lg  hover:bg-green-600"
              : "p-3   text-white transition duration-200 bg-green-500 border rounded-lg  hover:bg-green-600"
          }
        >
          Run
        </button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full overflow-hidden border rounded md:w-2/3 h-80 md:h-full">
          <CodeEditor
            code={code}
            onChange={oncodechange}
            language={language?.value}
          />
        </div>

        <div className="flex flex-row w-full gap-4 space-y-0 md:flex-col md:space-y-4 md:w-1/3 ">
          <div className="flex flex-col">
            <h1 className="mb-1 font-mono text-lg">Input</h1>
            <textarea
              rows={5}
              onChange={(e) => setinput(e.target.value)}
              placeholder="Provide input here"
              className="px-4 py-2 transition duration-200 bg-white border border-black rounded-md focus:outline-none hover:shadow"
            ></textarea>
          </div>

          <div>
            <Output outputdetails={output} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
