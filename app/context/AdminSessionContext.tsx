"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Modal, ModalBody, ModalFooter } from "../components/Modal";
import { Button } from "../components/Button";
import { HiExclamationTriangle } from "react-icons/hi2";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutMutation as useLogoutAdminMutation } from "@/lib/redux/services/authApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated, logOut } from "@/lib/redux/features/authSlice";
import { clearPrivileges } from "@/lib/redux/features/privilegeSlice";
import { baseApi } from "@/lib/redux/baseApi";

interface AdminSessionContextType {
  isSessionExpired: boolean;
  triggerSessionExpired: () => void;
}

const AdminSessionContext = createContext<AdminSessionContextType | undefined>(undefined);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const pathname = usePathname();
  const [logoutAdmin, { isLoading: isLoggingOut }] = useLogoutAdminMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Only handle sessions for admin paths
  const isAdminPath = pathname !== "/";

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
      const isAuthPage = pathname?.includes("/login") || pathname === "/";
      // Only show if user is authenticated, not on auth page, and IS on admin path
      if (!isAuthPage && isAuthenticated && isAdminPath) {
        setIsSessionExpired(true);
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [pathname, isAuthenticated, isAdminPath]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      (window as any)._isLoggingOut = true;
    }
    try {
      await logoutAdmin(undefined).unwrap();
    } catch (e) {
      // Ignore API errors
    } finally {
      dispatch(logOut());
      dispatch(clearPrivileges());
      dispatch(baseApi.util.resetApiState());
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setIsSessionExpired(false);
      window.location.href = "/";
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
