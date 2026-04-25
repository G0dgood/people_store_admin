"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGetCurrentCustomerQuery, useLogoutCustomerMutation } from "@/lib/redux/services/customerApi";

interface Customer {
  _id: string;
  email: string;
  fullName: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  isVerified?: boolean;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCustomerData: (data: Customer | null) => void;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// Simple cookie helper
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string) => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Use the query to sync with backend session
  const { data: customerResponse, isLoading, isSuccess } = useGetCurrentCustomerQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutCustomerMutation();

  const setCustomerData = (data: Customer | null) => {
    setCustomer(data);
    setIsAuthenticated(!!data);
    if (data) {
      setCookie("customer_info", JSON.stringify(data));
    } else {
      deleteCookie("customer_info");
    }
  };

  // Sync state when query succeeds
  useEffect(() => {
    if (isSuccess && customerResponse?.data) {
      setCustomerData(customerResponse.data);
    }
  }, [isSuccess, customerResponse]);

  // Initial sync from cookie for immediate UI response
  useEffect(() => {
    const savedCustomer = getCookie("customer_info");
    if (savedCustomer && !customer) {
      try {
        const parsed = JSON.parse(savedCustomer);
        setCustomer(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse customer cookie", e);
      }
    }
  }, []);

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (e) {
      console.error("Logout mutation failed", e);
    } finally {
      setCustomer(null);
      setIsAuthenticated(false);
      deleteCookie("customer_info");
    }
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, isAuthenticated, isLoading, setCustomerData, logout, isLoggingOut }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
