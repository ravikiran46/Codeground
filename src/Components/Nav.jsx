import useAuth from "../Context/useAuth";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="p-4 border-b-2 ">
      <div className="flex justify-between ">
        <h1 className="font-mono text-2xl md:ml-28">CodeG</h1>
        <button
          className="font-mono text-xl md:mr-28 hover:cursor-pointer "
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Nav;
