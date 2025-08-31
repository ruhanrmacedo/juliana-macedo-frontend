import { createContext, useContext } from "react";

export interface User {
  id: number; name: string; email: string; role: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);
