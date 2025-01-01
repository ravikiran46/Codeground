import { Outlet } from "react-router";
import useAuth from "../Context/useAuth";

const ProtectedRoutes = () => {
  const { token } = useAuth();
  return token ? (
    <Outlet />
  ) : (
    <div className="w-screen h-screen text-xl text-center">
      Permission denied
    </div>
  );
};

export default ProtectedRoutes;
