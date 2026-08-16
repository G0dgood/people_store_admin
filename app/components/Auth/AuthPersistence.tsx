"use client";

import { useEffect } from "react";
import { useGetCurrentUserQuery } from "@/lib/redux/services/authApi";
import { setCredentials, logOut } from "@/lib/redux/features/authSlice";
import { clearPrivileges } from "@/lib/redux/features/privilegeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/features/authSlice";
import { usePathname } from "next/navigation";

export const AuthPersistence = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // In the admin app, only check staff/admin authentication
  const {
    data: adminData,
    isSuccess: isAdminSuccess,
    isError: isAdminError,
    isLoading: isAdminLoading,
    isFetching: isAdminFetching,
  } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: isAuthenticated, // Skip if already authenticated in Redux
  });

  // Restore Admin Credentials or clear on failure
  useEffect(() => {
    if (isAdminSuccess && adminData?.success && adminData?.data) {
      if (!isAuthenticated) {
        dispatch(
          setCredentials({
            user: adminData.data,
            accessToken: "", // Managed via HTTPOnly cookies
          })
        );
      }
    } else if (isAdminError) {
      dispatch(logOut());
      dispatch(clearPrivileges());
    }
  }, [isAdminSuccess, isAdminError, adminData, dispatch, isAuthenticated]);

  const isAuthPage = pathname === "/" || pathname?.includes("/login");
  const isLoading = isAdminLoading || isAdminFetching;

  // Prevent flicker on protected pages by waiting for the fetch to complete
  if (!isAuthenticated && isLoading && !isAuthPage) {
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
