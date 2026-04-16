"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  userImage: string | null;
  setUserImage: (image: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userImage, setUserImage] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userImage, setUserImage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
