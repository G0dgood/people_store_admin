"use client";

import React, { useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/Form/Inputs";
import { Label } from "@/app/components/Form/Field";
import { Button } from "@/app/components/Button/Button";
import { Checkbox } from "@/app/components/Form/Checkbox";
import { useLoginCustomerMutation } from "@/lib/redux/services/customerApi";
import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import { toast } from "sonner";
import { SVGLoaderFetch } from "@/app/components/Options";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { Logo } from "@/app/components/Logo";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { getShopUrl } from "../utils/storeUtils";

function OfficeLocationSigninPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginCustomer: setAuthData } = useOfficeLocationInfo();
  const [login, { isLoading }] = useLoginCustomerMutation();

  // Extract subdomain
  const subdomain = useMemo(() => {
    const rawParams = searchParams.toString();
    if (rawParams.includes("subdomain/")) {
      return rawParams.split("subdomain/")[1].split("&")[0];
    }
    return searchParams.get("subdomain");
  }, [searchParams]);

  const { data: officeRes } = useGetOfficeBySubdomainQuery(subdomain || "", {
    skip: !subdomain
  });
  const office = officeRes?.data;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      const { customer, token, refresh_token } = response.data;

      setAuthData(customer, {
        accessToken: token,
        refresh_token: refresh_token
      });

      toast.success("Welcome back to Bloom & Mist");

      // Redirect back to office landing or home
      const targetUrl = subdomain ? `/officelocation?subdomain/${subdomain}` : "/";
      router.push(targetUrl);
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left: Branding & Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-charcoal text-white relative overflow-hidden">
        <div className="relative z-10">
          <Logo variant="on-dark" size="md" />
          <div className="mt-20 space-y-6 max-w-md">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Luxury <br />
              Redefined.
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed">
              Experience the finest collection of fragrances and skincare, curated for those who appreciate the extraordinary.
            </p>
          </div>
        </div>

        {office && (
          <div className="relative z-10 p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Official Partner</span>
              <h3 className="text-lg font-black uppercase">{office.name}</h3>
              <p className="text-xs text-gray-400">{office.address}</p>
            </div>
          </div>
        )}

        {/* Decorative element */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center px-8 md:px-20 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-2">
            <div className="lg:hidden mb-8">
              <Logo size="sm" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Sign In</h2>
            <p className="text-sm text-gray-500 font-medium">Access your personalized collection and orders.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <HiOutlineEyeSlash size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link
                    href={getShopUrl("/forgot-password", subdomain, office?._id)}
                    className="text-xs font-bold text-brand-gold hover:underline uppercase tracking-widest"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Checkbox
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                label="Remember my preferences"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/10"
              disabled={isLoading}
            >
              {isLoading ? <SVGLoaderFetch text="" /> : "Enter Showroom"}
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 font-medium">
              New to the collection?{" "}
              <Link
                href={`/officelocation/signup${subdomain ? `?subdomain/${subdomain}` : ""}`}
                className="text-brand-gold font-black hover:underline uppercase tracking-widest ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OfficeLocationSigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><SVGLoaderFetch text="Preparing showroom..." /></div>}>
      <OfficeLocationSigninPageContent />
    </Suspense>
  );
}
