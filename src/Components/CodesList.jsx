import { Link } from "react-router";
import useAuth from "../Context/useAuth";
import Nav from "./Nav";
import { useEffect, useState } from "react";
import api from "../Api/api_instance";

const CodesList = () => {
  const { token } = useAuth();
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/codes/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCodes(res.data.codes);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  const handleDelete = async (code) => {
    const userConfirmation = prompt(
      `Please type the name of the code "${code.title}" to confirm deletion:`
    );
    if (userConfirmation !== code.title) {
      alert("The name entered does not match. Deletion cancelled.");
      return;
    }
    try {
      await api.delete(`/codes/${code._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Code deleted successfully.");
      setCodes(codes.filter((item) => item.id !== code._id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="container px-4 py-8 mx-auto">
        <Link to={"/"} className="">
          <div className="flex flex-col items-center justify-center w-32 h-24 m-5 border-4 border-gray-500 border-dotted rounded-xl p-14 hover:border-gray-800 md:mx-auto">
            ➕
          </div>
        </Link>
        <div className="mt-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : codes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {codes.map((code) => (
                <div
                  key={code._id}
                  className="p-4 transition duration-200 bg-white border-2 rounded-lg shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/?id=${code._id}`}
                      className="text-lg font-semibold"
                    >
                      {code.title}
                    </Link>
                    <button
                      onClick={() => handleDelete(code)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Code"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No codes available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodesList;
