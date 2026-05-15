"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials, logOut as logOutStaff } from "@/lib/redux/features/authSlice";

interface StoreContext {
  officeName?: any;
  subdomain: string | null;
  officeId: string | null;
}

interface OfficeLocationContextType {
  storeContext: StoreContext;
  officelocation: any;
  updateStoreContext: (context: Partial<StoreContext>) => void;
  loginCustomer: (customer: any, tokens: { accessToken: string; refresh_token?: string }) => void;
  staffLogin: (user: any, tokens: { accessToken: string; refresh_token?: string }) => void;
  logoutStaff: () => void;
  logoutAll: () => Promise<void>;
}

const OfficeLocationContext = createContext<OfficeLocationContextType | undefined>(undefined);

export function OfficeLocationProvider({ children }: { children: ReactNode }) {
  const [storeContext, setStoreContext] = useState<StoreContext>({
    subdomain: null,
    officeId: null,
  });

  const { customer, setCustomerData, logout: logoutCustomer } = useCustomerAuth();
  const dispatch = useAppDispatch();

  const updateStoreContext = (context: Partial<StoreContext>) => {
    setStoreContext((prev) => ({ ...prev, ...context }));
  };

  const loginCustomer = (customer: any, tokens: { accessToken: string; refresh_token?: string }) => {
    setCustomerData(customer);
  };

  const staffLogin = (user: any, tokens: { accessToken: string; refresh_token?: string }) => {
    dispatch(setCredentials({
      user,
      accessToken: tokens.accessToken
    }));
  };

  const logoutStaff = () => {
    dispatch(logOutStaff());
  };

  const logoutAll = async () => {
    await logoutCustomer();
    dispatch(logOutStaff());
  };

  return (
    <OfficeLocationContext.Provider value={{
      storeContext,
      officelocation: customer,
      updateStoreContext,
      loginCustomer,
      staffLogin,
      logoutStaff,
      logoutAll
    }}>
      {children}
    </OfficeLocationContext.Provider>
  );
}

export function useOfficeLocationInfo() {
  const context = useContext(OfficeLocationContext);
  if (context === undefined) {
    throw new Error("useOfficeLocationInfo must be used within an OfficeLocationProvider");
  }
  return context;
}
