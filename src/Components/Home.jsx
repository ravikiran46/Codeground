import { useEffect, useMemo, useState } from "react";
import CodeEditor from "./CodeEditor";
import Language from "./Language";
import { languageoptions } from "../constants/languageoptions";
import Output from "./Output";
import axios from "axios";
import { Link, useSearchParams } from "react-router";
import Title from "./Title";
import api from "../Api/api_instance";

import useAuth from "../Context/useAuth";
import toast from "react-hot-toast";

const Home = () => {
  const [code, setcode] = useState(languageoptions[0].bpc);
  const [language, setlanguage] = useState(languageoptions[0]);
  const [output, setoutput] = useState(null);
  const [input, setinput] = useState(null);
  const [loading, setloading] = useState(false);
  const [title, settitle] = useState("title1");
  const [searchParams, setsearchParams] = useSearchParams();
  const { token } = useAuth();
  const savedCode = useMemo(() => ({}), []);

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

  const handleSave = async () => {
    if (!token) {
      toast("Login to save", {
        icon: "🙂",
      });
      return;
    }

    const id = searchParams.get("id");
    const endpoint = id ? `/codes/?id=${id}` : "/codes/";

    const method = id ? "PUT" : "POST";
    const savereq = api({
      method: method,
      url: endpoint,
      data: {
        title: title,
        code: code,
        lang: language.id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(savereq);

    try {
      const res = await toast.promise(savereq, {
        loading: "Saving",
        success: (res) => {
          setsearchParams({ id: res.data.id });
          return res.data.message;
        },
        error: (err) => {
          if (err.response?.status === 409) {
            return "The title already exists, please use a new title";
          } else {
            console.error(err);
            return "An error occurred while saving";
          }
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // fetch initial code
  useEffect(() => {
    if (!token) return;
    const id = searchParams.get("id");
    if (!id) {
      console.log("new entry");
      return;
    }
    const handledata = async () => {
      if (!token) return;
      try {
        const res = await api.get(`codes/?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          const fetchedLanguageId = res.data?.content.lang;
          const fetchedCode = res.data?.content.code;
          const title = res.data?.content.title;

          const matchingLanguage = languageoptions.find(
            (lang) => lang.id === fetchedLanguageId
          );
          if (matchingLanguage) {
            setlanguage(matchingLanguage);
            settitle(title);
            const saved = fetchedCode || matchingLanguage.bpc;
            savedCode[fetchedLanguageId] = saved;
            setcode(saved);
          }
        }
      } catch (error) {
        if (error.response?.status === 400) {
          console.log("No existing documents ");
        } else {
          console.log("error fecting code", error);
        }
      }
    };
    handledata();
  }, [searchParams, token]);

  const onSelectChange = async (lang) => {
    setloading(true);
    if (savedCode[lang.id]) {
      setcode(savedCode[lang.id]);
      setlanguage(lang);
      setloading(false);
      return;
    }
    setlanguage(lang);
    setcode(lang.bpc);
    setloading(false);
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
    <div className="flex flex-col w-full p-4 space-y-4 font-mono">
      <div className="flex flex-wrap items-center gap-6">
        <Title title={title} settitle={settitle} />
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleSave}
            className="p-2 border rounded-lg border-zinc-300 hover:shadow"
          >
            Save
          </button>
          <div className="w-fit sm:w-auto">
            <Language onSelectChange={onSelectChange} defaultvalue={language} />
          </div>
          <button
            onClick={handleCompile}
            className={`pl-5 pr-5 pt-2 pb-2  text-white transition duration-200 bg-green-500 border rounded-lg  hover:shadow
              ${loading ? "animate-pulse" : ""} `}
          >
            Run
          </button>
          {token ? (
            <Link
              to={"/mycodes"}
              className="pt-2 pb-2 pl-4 pr-4 text-xl border-2 rounded-lg"
              title="Home"
            >
              ⇽
            </Link>
          ) : (
            <Link
              className="p-3 text-sm border text-zinc-700 hover:text-zinc-900 rounded-xl border-zinc-300 hover:shadow"
              to={"/login"}
            >
              SignUp/SignIn
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full overflow-hidden border rounded md:w-2/3 h-80 md:h-full">
          <CodeEditor
            code={code}
            onChange={oncodechange}
            language={language?.value}
          />
        </div>

        <div className="flex flex-col gap-4 space-y-0 md:space-y-4 md:w-1/3 ">
          <div className="flex flex-col">
            <h1 className="mb-1 font-mono text-lg">Input</h1>
            <textarea
              rows={5}
              onChange={(e) => setinput(e.target.value)}
              placeholder="Provide input here"
              className="px-4 py-2 bg-white border border-black rounded-md focus:outline-none hover:shadow"
            ></textarea>
          </div>

          <div>
            <Output outputdetails={output} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
