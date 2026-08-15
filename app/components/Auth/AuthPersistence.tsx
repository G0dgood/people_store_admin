"use client";

import { useEffect } from "react";
import { useGetCurrentUserQuery } from "@/lib/redux/services/authApi";
import { useGetCurrentCustomerQuery } from "@/lib/redux/services/customerApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/features/authSlice";
import { usePathname } from "next/navigation";

export const AuthPersistence = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const isAdminPath = pathname !== "/";

  // Attempt to restore admin session
  const {
    data: adminData,
    isSuccess: isAdminSuccess,
    isLoading: isAdminLoading,
    isFetching: isAdminFetching
  } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAdminPath || isAuthenticated, // Skip if not on admin path OR already authenticated
  });

  // Attempt to restore customer session (boutique side)
  const {
    data: customerData,
    isSuccess: isCustomerSuccess,
    isLoading: isCustomerLoading,
    isFetching: isCustomerFetching
  } = useGetCurrentCustomerQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: isAdminPath || isAuthenticated, // Skip if on admin path OR already authenticated
  });

  // Restore Admin Credentials
  useEffect(() => {
    if (isAdminSuccess && adminData?.success && adminData?.data) {
      // Only set credentials if not already authenticated to avoid wiping existing token
      if (!isAuthenticated) {
        dispatch(setCredentials({
          user: adminData.data,
          accessToken: "" // Handled by cookies on refresh
        }));
      }
    }
  }, [isAdminSuccess, adminData, dispatch, isAuthenticated]);

  // Restore Customer Credentials
  useEffect(() => {
    if (isCustomerSuccess && customerData?.success && customerData?.data) {
      // Only set credentials if not already authenticated
      if (!isAuthenticated) {
        dispatch(setCredentials({
          user: customerData.data,
          accessToken: "" // Handled by cookies on refresh
        }));
      }
    }
  }, [isCustomerSuccess, customerData, dispatch, isAuthenticated]);

  const isLoading = isAdminPath
    ? (isAdminLoading || isAdminFetching)
    : (isCustomerLoading || isCustomerFetching);

  // Prevent flicker on refresh by waiting for the relevant fetch to complete
  if (!isAuthenticated && isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border border-brand-gold/20 animate-ping" />
            <div className="absolute -inset-2 rounded-full border border-brand-gold/10 animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-white border-[0.5px] border-brand-gold/30 flex items-center justify-center overflow-hidden p-4">
              <img
                src="/brand_logo/icon.svg"
                alt="Logo"
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
