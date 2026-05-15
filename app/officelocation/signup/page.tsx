"use client";

import React, { useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/Form/Inputs";
import { Label } from "@/app/components/Form/Field";
import { Button } from "@/app/components/Button/Button";
import { Checkbox } from "@/app/components/Form/Checkbox";
import { useRegisterCustomerMutation } from "@/lib/redux/services/customerApi";
import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import { toast } from "sonner";
import { SVGLoaderFetch } from "@/app/components/Options";
import { Logo } from "@/app/components/Logo";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { getShopUrl } from "../utils/storeUtils";

function OfficeLocationSignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [register, { isLoading }] = useRegisterCustomerMutation();

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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("Please agree to our terms and conditions.");
      return;
    }

    try {
      await register({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      }).unwrap();

      toast.success("Welcome to Bloom & Mist! Your account is ready.");

      // Redirect to signin
      const targetUrl = subdomain ? `/officelocation/signin?subdomain/${subdomain}` : "/officelocation/signin";
      router.push(targetUrl);
    } catch (err: any) {
      toast.error(err?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left: Branding & Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-charcoal text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
             <Logo variant="on-dark" size="md" />
          </div>
          <div className="mt-20 space-y-6 max-w-md">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-brand-gold">
              Join the <br />
              Collective.
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed">
              Unlock exclusive access to limited drops, personalized fragrance profiles, and early member benefits.
            </p>
          </div>
        </div>

        {office && (
          <div className="relative z-10 p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Registering via</span>
              <h3 className="text-lg font-black uppercase">{office.name}</h3>
              <p className="text-xs text-gray-400">{office.address}</p>
            </div>
          </div>
        )}
        
        {/* Decorative element */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center px-8 md:px-20 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-2">
            <div className="lg:hidden mb-8">
              <Logo size="sm" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Create Account</h2>
            <p className="text-sm text-gray-500 font-medium">Join our global community of luxury enthusiasts.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
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
                    placeholder="Min. 8 characters"
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
              </div>
            </div>

            <div className="flex items-start">
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                label="I agree to the Terms of Service and Privacy Policy"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-gold/10"
              disabled={isLoading}
            >
              {isLoading ? <SVGLoaderFetch text="" /> : "Create Account"}
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link
                href={getShopUrl("/signin", subdomain, office?._id)}
                className="text-brand-gold font-black hover:underline uppercase tracking-widest ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OfficeLocationSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><SVGLoaderFetch text="Opening the vault..." /></div>}>
      <OfficeLocationSignupPageContent />
    </Suspense>
  );
}
