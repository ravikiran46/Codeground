/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const Authcontext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_details");
    setToken(null);
  };

  return (
    <Authcontext.Provider value={{ token, login, logout }}>
      {children}
    </Authcontext.Provider>
  );
}
