import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);



  useEffect(() => {


  }, []);

  const logout = () => {
    setToken(null);
    // navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      logout,
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
