"use client";

import React, { useState, useEffect } from "react";
import { LoginForm } from "../components/Auth/LoginForm";
import { LoginAdvert } from "../components/Auth/LoginAdvert";
import { LoginBackground } from "../components/Auth/LoginBackground";
import { getAdvertConfig } from "../utils/advertState";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [layout, setLayout] = useState<"left-form" | "right-form">("left-form");
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
    setLayout(getAdvertConfig().layout);

    const handleUpdate = () => {
      setLayout(getAdvertConfig().layout);
    };

    window.addEventListener("advertConfigUpdated", handleUpdate);
    return () => window.removeEventListener("advertConfigUpdated", handleUpdate);
  }, []);

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-12 lg:px-24 xl:px-32 
      ${layout === "right-form" ? "lg:flex-row-reverse" : "lg:flex-row"}
    `}>
      {/* Immersive Background Advert Component */}
      <LoginBackground />

      {/* Floating Login Card */}
      <LoginForm />

      {/* Expanded Advert Details */}
      <LoginAdvert />
    </div>
  );
}
