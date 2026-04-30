"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Modal, ModalBody, ModalFooter } from "../components/Modal";
import { Button } from "../components/Button";
import { HiExclamationTriangle } from "react-icons/hi2";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutCustomerMutation } from "@/lib/redux/services/customerApi";
import { useLogoutMutation as useLogoutAdminMutation } from "@/lib/redux/services/authApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/features/authSlice";

interface SessionContextType {
  isSessionExpired: boolean;
  triggerSessionExpired: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [logoutCustomer, { isLoading: isLoggingOutCustomer }] = useLogoutCustomerMutation();
  const [logoutAdmin, { isLoading: isLoggingOutAdmin }] = useLogoutAdminMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const isLoggingOut = isLoggingOutCustomer || isLoggingOutAdmin;

  const triggerSessionExpired = () => {
    if (isAuthenticated) {
      setIsSessionExpired(true);
    }
  };

  useEffect(() => {
    const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");
    if (isAuthPage && isSessionExpired) {
      setIsSessionExpired(false);
    }
  }, [pathname, isSessionExpired]);

  useEffect(() => {
    const handleSessionExpired = () => {
      const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");
      // Only show the modal if the user was previously authenticated and is NOT on an auth page
      if (!isAuthPage && isAuthenticated) {
        setIsSessionExpired(true);
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [pathname, isAuthenticated]);

  const handleLogout = async () => {
    try {
      const isAdminPath = pathname?.startsWith("/admin");
      
      // Attempt both backend logouts to be sure all cookies are cleared
      try {
        await Promise.allSettled([
          logoutCustomer(undefined).unwrap(),
          logoutAdmin(undefined).unwrap()
        ]);
      } catch (e) {
        // Ignore logout errors during session expiration
      }

      // Clear all local storage and cookies manually as a fallback
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setIsSessionExpired(false);
      
      // Absolute navigation based on context
      if (isAdminPath) {
        window.location.href = "/login";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed during session expiration:", error);
      window.location.href = "/";
    }
  };

  const isAdminPath = pathname?.startsWith("/admin");
  const modalTheme = isAdminPath 
    ? {
        title: "Admin Session Expired",
        header: "Administrative Access Expired",
        description: "Your secure administrative session has timed out. For security, you must log in again to manage the store.",
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
        buttonText: "Return to Admin Login"
      }
    : {
        title: "Session Expired",
        header: "Your session has expired",
        description: "For your security, you have been logged out due to inactivity or your token has expired.",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-500",
        buttonText: "Log Me Out"
      };

  return (
    <SessionContext.Provider value={{ isSessionExpired, triggerSessionExpired }}>
      {children}
      
      <Modal
        isOpen={isSessionExpired}
        onClose={() => {}} // Prevent closing without clicking OK
        title={modalTheme.title}
        size="sm"
        showCloseButton={false}
      >
        <ModalBody className="py-8 flex flex-col items-center text-center gap-4">
          <div className={`w-16 h-16 ${modalTheme.iconBg} rounded-full flex items-center justify-center ${modalTheme.iconColor} mb-2`}>
            <HiExclamationTriangle className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black text-[#1D3557]">{modalTheme.header}</h3>
            <p className="text-sm text-gray-500 font-medium px-4">
              {modalTheme.description}
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50/50">
          <Button 
            shape="rounded-sm" 
            variant={isAdminPath ? "primary" : "primary"} // Keep consistent branding
            className="w-full font-bold py-3"
            onClick={handleLogout}
            isLoading={isLoggingOut}
          >
            {modalTheme.buttonText}
          </Button>
        </ModalFooter>
      </Modal>
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
