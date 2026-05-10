"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Modal, ModalBody, ModalFooter } from "../components/Modal";
import { Button } from "../components/Button";
import { HiExclamationTriangle } from "react-icons/hi2";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutCustomerMutation } from "@/lib/redux/services/customerApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/features/authSlice";

interface CustomerSessionContextType {
  isSessionExpired: boolean;
  triggerSessionExpired: () => void;
}

const CustomerSessionContext = createContext<CustomerSessionContextType | undefined>(undefined);

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const pathname = usePathname();
  const [logoutCustomer, { isLoading: isLoggingOut }] = useLogoutCustomerMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Don't show customer session modal on admin paths
  const isAdminPath = pathname?.startsWith("/admin");

  const triggerSessionExpired = () => {
    if (isAuthenticated && !isAdminPath) {
      setIsSessionExpired(true);
    }
  };

  useEffect(() => {
    const isAuthPage = pathname?.includes("/login") || pathname?.includes("/store-auth");
    if (isAuthPage && isSessionExpired) {
      setIsSessionExpired(false);
    }
  }, [pathname, isSessionExpired]);

  useEffect(() => {
    const handleSessionExpired = () => {
      const isAuthPage = pathname?.includes("/login") || pathname?.includes("/store-auth");
      // Only show if user is authenticated, not on auth page, and NOT on admin path
      if (!isAuthPage && isAuthenticated && !isAdminPath) {
        setIsSessionExpired(true);
      }
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, [pathname, isAuthenticated, isAdminPath]);

  const handleLogout = async () => {
    try {
      try {
        await logoutCustomer(undefined).unwrap();
      } catch (e) {
        // Ignore errors
      }

      // Clear local storage and cookies manually as a fallback
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setIsSessionExpired(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed during session expiration:", error);
      window.location.href = "/";
    }
  };

  return (
    <CustomerSessionContext.Provider value={{ isSessionExpired, triggerSessionExpired }}>
      {children}
      
      <Modal
        isOpen={isSessionExpired}
        onClose={() => {}} // Prevent closing without clicking OK
        title="Session Expired"
        size="sm"
        showCloseButton={false}
      >
        <ModalBody className="py-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-2">
            <HiExclamationTriangle className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black text-[#121212]">Your session has expired</h3>
            <p className="text-sm text-gray-500 font-medium px-4">
              For your security, you have been logged out due to inactivity or your token has expired.
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
            Log Me Out
          </Button>
        </ModalFooter>
      </Modal>
    </CustomerSessionContext.Provider>
  );
}

export function useCustomerSession() {
  const context = useContext(CustomerSessionContext);
  if (context === undefined) {
    throw new Error("useCustomerSession must be used within a CustomerSessionProvider");
  }
  return context;
}
