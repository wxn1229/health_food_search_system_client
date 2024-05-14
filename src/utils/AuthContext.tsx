"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextProps {
  user: userInterface;
  login: (user_name: string) => void;
  logout: () => void;
}

// 創建 Context 物件
const AuthContext = createContext<AuthContextProps>(null!);

interface userInterface {
  isAuth: boolean;
  user_name: string;
}

// 創建一個 Provider 組件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<userInterface>({
    isAuth: false,
    user_name: "",
  });

  const login = (user_name: string) => {
    setUser({
      isAuth: true,
      user_name,
    });
  };

  const logout = () => {
    setUser({
      isAuth: false,
      user_name: "",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自訂 Hook 以方便存取 Context
export function useAuth() {
  return useContext(AuthContext);
}
