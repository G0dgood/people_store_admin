"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminThemeContextProps {
  isAdminDark: boolean;
  toggleAdminTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextProps | undefined>(undefined);

export const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdminDark, setIsAdminDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "dark") {
      setIsAdminDark(true);
    }
  }, []);

  const toggleAdminTheme = () => {
    setIsAdminDark((prev) => {
      const next = !prev;
      localStorage.setItem("adminTheme", next ? "dark" : "light");
      return next;
    });
  };

  // Prevent hydration mismatch by not rendering until mounted if needed, 
  // but we can just render false initially to match SSR
  if (!mounted) {
    return (
      <AdminThemeContext.Provider value={{ isAdminDark: false, toggleAdminTheme }}>
        {children}
      </AdminThemeContext.Provider>
    );
  }

  return (
    <AdminThemeContext.Provider value={{ isAdminDark, toggleAdminTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    return { isAdminDark: false, toggleAdminTheme: () => {} };
  }
  return context;
};
