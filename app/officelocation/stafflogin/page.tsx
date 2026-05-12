"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Checkbox from "@/app/components/Checkbox";
import { IoGrid } from "react-icons/io5";
import { useUserLoginMutation } from "@/lib/redux/services/userAuthApi";
import { toast } from "sonner";
import { SVGLoader } from "@/app/components/SVGLoader";
import { useApiError } from "@/app/hooks/useApiError";
import { useAuth } from "@/app/contexts/AuthContext";
import { useUserInfo } from "@/app/contexts/UserInfoContext";
import { getStoreUrl, parseStoreContextFromUrl } from "@/app/utils/storeUtils";

function StaffSigninPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { storeContext, updateStoreContext } = useUserInfo();
  const auth = useAuth();
  const [login, { isLoading, isError, error }] = useUserLoginMutation();

  const [business, setBusiness] = useState<import("@/lib/redux/services/businessesApi").Business | null>(null);

  useEffect(() => {
    if (storeContext?.subdomain) {
      const savedBusiness = localStorage.getItem(`tecnova_business_${storeContext.subdomain}`);
      if (savedBusiness) {
        setBusiness(JSON.parse(savedBusiness));
      }
    }
  }, [storeContext]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberPassword, setRememberPassword] = useState(false);

  useEffect(() => {
    const searchString = window.location.search.substring(1);
    const context = parseStoreContextFromUrl(searchParams, searchString);
    if (context) {
      updateStoreContext(context);
    }
  }, [searchParams, updateStoreContext]);

  useApiError(isError, error, "Failed to login");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      const { user, token, refresh_token } = response.data;

      auth.login(user, {
        accessToken: token,
        refresh_token: refresh_token
      });

      toast.success("Login successful!");

      const targetUrl = getStoreUrl(storeContext?.subdomain);

      router.push(targetUrl);
    } catch (err: unknown) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-2 text-neutral-500">
          <IoGrid className="text-tecnova-blue h-6 w-6" />
          <span className="text-sm font-medium">Powered by Tecnovo</span>
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#156BB6] sm:text-4xl">
            Welcome to <br />
            <span className="text-[#3E4347]">{business?.name || ""}</span>
          </h1>
          <p className="mt-2 text-base text-neutral-500">
            Sign up to continue shopping or place an order
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
              disabled={isLoading}
            />
            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="Enter here"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                fullWidth
                showPasswordToggle
                disabled={isLoading}
              />
              <Link
                href="/customer/forgot-password"
                className="absolute right-0 top-0 text-xs font-medium text-[#156BB6] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              checked={rememberPassword}
              onChange={setRememberPassword}
              label="Remember Password"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? <SVGLoader width="24px" height="24px" color="#fff" /> : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffSigninPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <StaffSigninPageContent />
    </Suspense>
  );
}
