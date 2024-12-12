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
  const [loading, setloading] = useState(null);

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
      url: import.meta.env.VITE_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkstatus(token);
        }, 2000);
        return;
      } else {
        setloading(false);
        setoutput(response.data);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setloading(false);
    }
  };
  const handleCompile = () => {
    setloading(true);
    const userdata = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(input),
    };
    const options = {
      method: "POST",
      url: import.meta.env.VITE_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
      },
      data: userdata,
    };
    axios
      .request(options)
      .then((res) => {
        console.log(res.data);
        const token = res.data.token;
        checkstatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);
          alert("100 request per day is completed!");
        }
        setloading(false);
        console.log("catch block...", error);
      });
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
            <button
              onClick={handleCompile}
              className="border p-3 pt-2 pl-5 pr-5 pb-2 rounded-lg bg-green-500  text-white"
            >
              {loading ? "loading" : "Run"}
            </button>
          </div>
        </div>

        {/* editor */}
        <div className="md:flex space-x-4">
          <div className="w-fit  md:w-2/3 h-full ml-5">
            <CodeEditor
              code={code}
              onChange={oncodechange}
              language={language?.value}
            />
          </div>

          <div className="flex flex-shrink-0 w-[30%] flex-col">
            <Output outputdetails={output} />
            <div className="flex flex-col mt-28">
              <div className="">
                <h1 className="text-xl font-mono mb-2">Input</h1>
                <textarea
                  rows={5}
                  onChange={(e) => setinput(e.target.value)}
                  placeholder="Give Input here"
                  className="focus:outline-none border-black  px-4 py-2 border-[1.5px] rounded-md  w-full hover: shadow transition duration-200 bg-white "
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
