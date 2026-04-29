"use client";

import { useEffect } from "react";
import { useGetCurrentUserQuery } from "@/lib/redux/services/authApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

export const AuthPersistence = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isSuccess, isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && data?.success && data?.data) {
      dispatch(setCredentials({
        user: data.data,
        accessToken: "" // Handled by cookies
      }));
    }
  }, [isSuccess, data, dispatch]);

  // Prevent flicker on refresh by waiting for the initial fetch to complete
  if (isLoading || isFetching) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Animated Outer Rings */}
            <div className="absolute inset-0 rounded-full border border-brand-gold/20 animate-ping" />
            <div className="absolute -inset-2 rounded-full border border-brand-gold/10 animate-pulse" />
            
            {/* Logo Container */}
            <div className="relative w-20 h-20 rounded-full bg-white border-[0.5px] border-brand-gold/30 shadow-xl flex items-center justify-center overflow-hidden p-4">
              <img 
                src="/brand_logo/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain animate-pulse" 
              />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-black text-brand-charcoal uppercase tracking-[0.3em] animate-pulse">
              Bloom & Mist
            </p>
            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest opacity-60">
              Securing Your Session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
