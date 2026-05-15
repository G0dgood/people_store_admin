"use client";

import React, { useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/Form/Inputs";
import { Label } from "@/app/components/Form/Field";
import { Button } from "@/app/components/Button/Button";
import { useLoginMutation } from "@/lib/redux/services/authApi";
import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { toast } from "sonner";
import { SVGLoaderFetch } from "@/app/components/Options";
import { Logo } from "@/app/components/Logo";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineShieldCheck } from "react-icons/hi2";

function OfficeStaffLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { staffLogin: setAuthData } = useOfficeLocationInfo();
  const [login, { isLoading }] = useLoginMutation();

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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      const { user, token } = response.data;

      setAuthData(user, {
        accessToken: token
      });

      toast.success(`Welcome back, ${user.fullName}. Authorized access granted.`);

      // Redirect to admin dashboard
      router.push("/officelocation/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "Authentication failed. Authorized personnel only.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Branding */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Logo variant="on-dark" size="md" />
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <HiOutlineShieldCheck className="text-brand-gold" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Staff Portal</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Authorized Access</h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Sign in with your branch credentials to manage inventory and operations for
              <span className="text-gray-900 font-bold ml-1">
                {office?.name || "this location"}
              </span>.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Staff Email</Label>
                <Input
                  type="email"
                  placeholder="staff@bloomandmist.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  shape="rounded-sm"
                />
              </div>
              <div className="space-y-1">
                <Label>Secure Key</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    shape="rounded-sm"
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

            <Button
              type="submit"
              size="lg"
              className="h-14 bg-brand-charcoal hover:bg-black font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-black/10"
              disabled={isLoading}
            >
              {isLoading ? <SVGLoaderFetch text="" /> : "Authenticate Portal"}
            </Button>
          </form>

          <div className="pt-4 text-center">
            <Link
              href={`/officelocation?subdomain/${subdomain}`}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-gold transition-colors"
            >
              Back to Branch View
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[9px] text-white/40 font-bold uppercase tracking-[0.3em]">
          Security Protocol Enabled • IP Logged
        </p>
      </div>
    </div>
  );
}

export default function OfficeStaffLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-charcoal flex items-center justify-center"><SVGLoaderFetch text="Securing connection..." /></div>}>
      <OfficeStaffLoginPageContent />
    </Suspense>
  );
}
