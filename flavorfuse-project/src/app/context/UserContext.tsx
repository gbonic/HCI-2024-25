"use client";
import { createContext, useContext, useState, ReactNode } from "react";

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
  const [userInitials, setUserInitials] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_initials") || null;
    }
    return null;
  });
  const [userName, setUserName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_name") || null;
    }
    return null;
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_email") || null;
    }
    return null;
  });

  // Sinkronizacija localStorage prilikom promjene stanja
  const setUserInitialsAndStore = (initials: string | null) => {
    setUserInitials(initials);
    if (initials) {
      localStorage.setItem("user_initials", initials);
    } else {
      localStorage.removeItem("user_initials");
    }
  };

  const setUserNameAndStore = (name: string | null) => {
    setUserName(name);
    if (name) {
      localStorage.setItem("user_name", name);
    } else {
      localStorage.removeItem("user_name");
    }
  };

  const setUserEmailAndStore = (email: string | null) => {
    setUserEmail(email);
    if (email) {
      localStorage.setItem("user_email", email);
    } else {
      localStorage.removeItem("user_email");
    }
  };

  return (
    <UserContext.Provider
      value={{
        userInitials,
        userName,
        userEmail,
        setUserInitials: setUserInitialsAndStore,
        setUserName: setUserNameAndStore,
        setUserEmail: setUserEmailAndStore,
      }}
    >
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