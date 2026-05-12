"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoGrid } from "react-icons/io5";
import { useCustomerRegisterMutation } from "@/lib/redux/services/customerAuthApi";
import { toast } from "sonner";
import { SVGLoader } from "@/app/components/SVGLoader";
import { useApiError } from "@/app/hooks/useApiError";
import { useUserInfo } from "@/app/contexts/UserInfoContext";
import { getStoreUrl, parseStoreContextFromUrl } from "@/app/utils/storeUtils";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Checkbox from "@/app/components/Checkbox";
import { useGetBusinessFiltersQuery } from "@/lib/redux/services/businessesApi";
import { AuthPageSkeleton } from "@/app/components/Skeleton/AuthPageSkeleton";

function CustomerSignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { storeContext, updateStoreContext } = useUserInfo();
  const [register, { isLoading, isError, error }] = useCustomerRegisterMutation();

  const [business, setBusiness] = useState<import("@/lib/redux/services/businessesApi").Business | null>(null);

  const { data: filtersResponse, isLoading: isLoadingFilters } = useGetBusinessFiltersQuery(
    storeContext?.subdomain || "",
    { skip: !storeContext?.subdomain }
  );

  const apiBusiness = filtersResponse?.data?.business;

  useEffect(() => {
    if (storeContext?.subdomain) {
      const savedBusiness = localStorage.getItem(`tecnova_business_${storeContext.subdomain}`);
      if (savedBusiness && !business) {
        setBusiness(JSON.parse(savedBusiness));
      }
    }
  }, [storeContext, business]);

  // Sync API business to local state for persistence
  useEffect(() => {
    if (apiBusiness && storeContext?.subdomain) {
      setBusiness(apiBusiness);
      localStorage.setItem(`tecnova_business_${storeContext.subdomain}`, JSON.stringify(apiBusiness));
    }
  }, [apiBusiness, storeContext?.subdomain]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
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

  useApiError(isError, error, "Failed to create account");

  const getCustomParams = () => {
    if (!storeContext?.subdomain) return "";
    return `?subdomain/${storeContext.subdomain}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      toast.success("Account created successfully!");
      const targetUrl = getStoreUrl(storeContext?.subdomain);
      router.push(targetUrl);
    } catch (err: unknown) {
      console.error("Signup failed:", err);
    }
  };

  if (isLoadingFilters && !apiBusiness && !business) {
    return <AuthPageSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-2 text-neutral-500">
          <IoGrid className="text-tecnova-blue h-6 w-6" />
          <span className="text-sm font-medium">Powered by Tecnova</span>
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#156BB6] sm:text-4xl">
            Welcome to <br />
            <span className="text-[#3E4347]">{apiBusiness?.name || business?.name || ""}</span>
          </h1>
          <p className="mt-2 text-base text-neutral-500">
            Sign up to continue shopping or place an order
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="First Name"
              placeholder="Enter here"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              fullWidth
              disabled={isLoading}
            />
            <Input
              label="Last Name"
              placeholder="Enter here"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              fullWidth
              disabled={isLoading}
            />
            <Input
              label="Phone Number"
              placeholder="+2348144699332"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
              fullWidth
              disabled={isLoading}
            />
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
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              checked={rememberPassword}
              onChange={setRememberPassword}
              label="Remember Password"
            />
            <Link
              href={`/customer/signin${getCustomParams()}`}
              className="text-sm font-medium text-[#156BB6] hover:underline"
            >
              Already have an account? Sign In
            </Link>
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? <SVGLoader width="24px" height="24px" color="#fff" /> : "Sign Up"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomerSignupPage() {
  return (
    <Suspense fallback={<div>Loading signup...</div>}>
      <CustomerSignupPageContent />
    </Suspense>
  );
}
