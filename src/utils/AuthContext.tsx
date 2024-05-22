"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextProps {
  user: userInterface;
  reload: boolean;
  login: (user_name: string) => void;
  logout: () => void;
  reloading: () => void;
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
  const [reload, setReload] = useState(true);

  const login = (user_name: string) => {
    setUser({
      isAuth: true,
      user_name,
    });
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    setUser({
      isAuth: false,
      user_name: "",
    });
  };

  const reloading = () => {
    setReload(!reload);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, reload, reloading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自訂 Hook 以方便存取 Context
export function useAuth() {
  return useContext(AuthContext);
}
