"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserContextProps {
  userInitials: string | null;
  userName: string | null;
  userEmail: string | null;
  setUserInitials: (initials: string | null) => void;
  setUserName: (name: string | null) => void;
  setUserEmail: (email: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Dohvaćanje e-maila korisnika iz localStorage pri pokretanju
    const email = localStorage.getItem("user_email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInitials, userName, userEmail, setUserInitials, setUserName, setUserEmail }}>
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