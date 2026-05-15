"use client";

import React, { useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/app/components/Form/Inputs";
import { Label } from "@/app/components/Form/Field";
import { Button } from "@/app/components/Button/Button";
import { useForgotPasswordMutation } from "@/lib/redux/services/authApi";
import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import { toast } from "sonner";
import { SVGLoaderFetch } from "@/app/components/Options";
import { Logo } from "@/app/components/Logo";
import { HiOutlineShieldCheck, HiOutlineEnvelope } from "react-icons/hi2";

function OfficeStaffForgotPasswordPageContent() {
  const searchParams = useSearchParams();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

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

  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setIsSent(true);
      toast.success("Security protocol initiated. Reset link sent.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initiate reset. Please contact system admin.");
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Security Portal</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl space-y-8">
          {!isSent ? (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Recover Access</h2>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Enter your registered staff email for
                  <span className="text-gray-900 font-bold ml-1">
                    {office?.name || "this location"}
                  </span>. We&apos;ll send a secure reset key.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <Label>Authorized Email</Label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="staff@bloomandmist.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-11"
                    />
                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-14 bg-brand-charcoal hover:bg-black font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-black/10"
                  disabled={isLoading}
                >
                  {isLoading ? <SVGLoaderFetch text="" /> : "Send Reset Key"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <HiOutlineEnvelope size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Transmission Sent</h2>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  If <span className="text-gray-900 font-bold">{email}</span> is authorized, you will receive a reset link shortly. Please check your secure inbox.
                </p>
              </div>
              <Button
                onClick={() => setIsSent(false)}
                variant="outline"
                className="h-12 border-gray-200 text-[10px] font-black uppercase tracking-widest"
              >
                Try Another Email
              </Button>
            </div>
          )}

          <div className="pt-4 text-center">
            <Link
              href={`/officelocation/stafflogin${subdomain ? `?subdomain/${subdomain}` : ""}`}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-gold transition-colors"
            >
              Back to Portal Login
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[9px] text-white/40 font-bold uppercase tracking-[0.3em]">
          End-to-End Encryption Active • System ID: {subdomain?.toUpperCase() || "GLOBAL"}
        </p>
      </div>
    </div>
  );
}

export default function OfficeStaffForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-charcoal flex items-center justify-center"><SVGLoaderFetch text="Connecting to vault..." /></div>}>
      <OfficeStaffForgotPasswordPageContent />
    </Suspense>
  );
}
