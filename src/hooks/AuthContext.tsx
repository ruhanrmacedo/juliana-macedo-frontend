import { useEffect, useState } from "react";
import api from "@/lib/api";
import { AuthContext, User } from "./auth-core";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => { fetchUser(); }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};