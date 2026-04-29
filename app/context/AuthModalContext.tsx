"use client";

import React, { createContext, useContext, useState } from "react";

type AuthView = "login" | "register" | "forgotPassword";

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthView;
  openLogin: () => void;
  openRegister: () => void;
  openForgotPassword: () => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");

  const openLogin = () => {
    setView("login");
    setIsOpen(true);
  };

  const openRegister = () => {
    setView("register");
    setIsOpen(true);
  };

  const openForgotPassword = () => {
    setView("forgotPassword");
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider 
      value={{ 
        isOpen, 
        view, 
        openLogin, 
        openRegister, 
        openForgotPassword,
        closeModal, 
        setView 
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
