"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextProps {
  userInitials: string | null;
  userName: string | null;
  setUserInitials: (initials: string | null) => void;
  setUserName: (name: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userInitials, userName, setUserInitials, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};