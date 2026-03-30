import { createContext, useContext, useEffect, useState } from "react";
import { authStorage, getMeRequest, loginRequest } from "../services/authApi";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      const token = authStorage.getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getMeRequest();
        setUser(currentUser);
      } catch (error) {
        authStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrapAuth();
  }, []);

  async function login(username, password) {
    const tokenResponse = await loginRequest({ username, password });
    authStorage.setTokens(tokenResponse);

    try {
      const currentUser = await getMeRequest();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      authStorage.clear();
      setUser(null);
      throw error;
    }
  }

  function logout() {
    authStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user && authStorage.getAccessToken()),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

