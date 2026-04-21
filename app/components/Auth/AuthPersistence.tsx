"use client";

import { useEffect } from "react";
import { useGetCurrentUserQuery } from "@/lib/redux/services/authApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

export const AuthPersistence = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isSuccess, error } = useGetCurrentUserQuery(undefined, {
    // Avoid refetching if we already have it, but do check on mount if state is empty
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && data?.success && data?.data) {
      // The API returns new ApiResponse(200, req.user, "...")
      // and login data is { user, accessToken, refreshToken }
      // So we map the returned user to the state.
      // Note: accessToken might be handled by cookies, but for Redux state:
      dispatch(setCredentials({
        user: data.data,
        accessToken: "" // Access token is in cookies, we just need the user object
      }));
    }
  }, [isSuccess, data, dispatch]);

  // If there's an error (e.g., 401 Unauthorized), we just don't set credentials.
  // The app will remain in "unauthenticated" state.

  return <>{children}</>;
};
