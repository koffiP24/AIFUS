import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import {
  AUTH_STORAGE_KEY,
  clearInvalidStoredAuth,
  clearStoredAuth,
  getAuthMode,
  getStoredAuth,
  saveAuthToken,
} from "../utils/authStorage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyAuthorizationHeader = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const { token } = getStoredAuth();
    if (token) {
      applyAuthorizationHeader(token);
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          clearInvalidStoredAuth();
          applyAuthorizationHeader(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorage = async (event) => {
      if (event.key !== AUTH_STORAGE_KEY || getAuthMode() !== "local") {
        return;
      }

      if (!event.newValue) {
        clearStoredAuth();
        applyAuthorizationHeader(null);
        setUser(null);
        return;
      }

      applyAuthorizationHeader(event.newValue);

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (_error) {
        clearInvalidStoredAuth();
        applyAuthorizationHeader(null);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const login = async (email, password, options = {}) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, ...userData } = res.data;
    saveAuthToken(token, options.remember === true);
    applyAuthorizationHeader(token);
    setUser(userData);
    return userData;
  };

  const register = async (data, options = {}) => {
    const res = await api.post("/auth/register", data);
    const { token, ...userData } = res.data;
    saveAuthToken(token, options.remember === true);
    applyAuthorizationHeader(token);
    setUser(userData);
    return userData;
  };

  const googleLogin = async (idToken, options = {}) => {
    const res = await api.post("/auth/google", { idToken });
    const { token, ...userData } = res.data;
    saveAuthToken(token, options.remember === true);
    applyAuthorizationHeader(token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    clearStoredAuth();
    applyAuthorizationHeader(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, googleLogin, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
