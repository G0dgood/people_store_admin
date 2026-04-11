"use client";

import React from "react";
import { useMobileMenu } from "@/app/context/MobileMenuContext";

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, closeMenu } = useMobileMenu();

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Backdrop for mobile menu */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
      />
      
      {/* Pushed content wrapper */}
      <div 
        className={`
          flex flex-col min-h-screen transition-transform duration-300 ease-in-out bg-[#F7FAFC]
          ${isOpen ? "translate-x-[280px]" : "translate-x-0"}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export { PageWrapper };
