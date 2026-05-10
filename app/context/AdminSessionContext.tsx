"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Modal, ModalBody, ModalFooter } from "../components/Modal";
import { Button } from "../components/Button";
import { HiExclamationTriangle } from "react-icons/hi2";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutMutation as useLogoutAdminMutation } from "@/lib/redux/services/authApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/features/authSlice";

interface AdminSessionContextType {
  isSessionExpired: boolean;
  triggerSessionExpired: () => void;
}

const AdminSessionContext = createContext<AdminSessionContextType | undefined>(undefined);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const pathname = usePathname();
  const [logoutAdmin, { isLoading: isLoggingOut }] = useLogoutAdminMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Only handle sessions for admin paths
  const isAdminPath = pathname?.startsWith("/admin");

  const triggerSessionExpired = () => {
    if (isAuthenticated && isAdminPath) {
      setIsSessionExpired(true);
    }
  };

  useEffect(() => {
    const isAuthPage = pathname?.includes("/login") || pathname === "/";
    if (isAuthPage && isSessionExpired) {
      setIsSessionExpired(false);
    }
  }, [pathname, isSessionExpired]);

  useEffect(() => {
    const handleSessionExpired = () => {
      const isAuthPage = pathname?.includes("/login");
      // Only show if user is authenticated, not on auth page, and IS on admin path
      if (!isAuthPage && isAuthenticated && isAdminPath) {
        setIsSessionExpired(true);
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [pathname, isAuthenticated, isAdminPath]);

  const handleLogout = async () => {
    try {
      try {
        await logoutAdmin(undefined).unwrap();
      } catch (e) {
        // Ignore errors
      }

      // Clear local storage and cookies manually
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setIsSessionExpired(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Admin logout failed during session expiration:", error);
      window.location.href = "/login";
    }
  };

  return (
    <AdminSessionContext.Provider value={{ isSessionExpired, triggerSessionExpired }}>
      {children}
      
      <Modal
        isOpen={isSessionExpired && !pathname?.includes("/login") && pathname !== "/"}
        onClose={() => {}} // Prevent closing without clicking OK
        title="Admin Session Expired"
        size="sm"
        showCloseButton={false}
      >
        <ModalBody className="py-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
            <HiExclamationTriangle className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black text-[#121212]">Administrative Access Expired</h3>
            <p className="text-sm text-gray-500 font-medium px-4">
              Your secure administrative session has timed out. For security, you must log in again to manage the store.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-50/50">
          <Button 
            shape="rounded-sm" 
            variant="primary"
            className="w-full font-bold py-3"
            onClick={handleLogout}
            isLoading={isLoggingOut}
          >
            Return to Admin Login
          </Button>
        </ModalFooter>
      </Modal>
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (context === undefined) {
    throw new Error("useAdminSession must be used within an AdminSessionProvider");
  }
  return context;
}
