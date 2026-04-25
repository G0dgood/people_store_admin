"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { Checkbox } from "../Form/Checkbox";
import { Logo } from "../Logo";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useLoginMutation } from "@/lib/redux/services/authApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginFormProps {
}

export const LoginForm = ({ }: LoginFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();

      if (response?.success && response?.data) {
        dispatch(setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken
        }));

        toast.success("Log-in Successful", {
          description: "Welcome back to the boutique."
        });

        router.push("/admin");
      }
    } catch (err: any) {
      toast.error("Authentication Failed", {
        description: err?.data?.message || "Invalid credentials or system error."
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 w-full max-w-[380px] bg-white/70 backdrop-blur-xl rounded-[6px] border border-white/40 shadow-[0_32px_80px_rgba(0,0,0,0.1)] overflow-hidden lg:mr-12"
    >
      <div className="p-8 sm:p-10 flex flex-col gap-6">
        {/* Form Logo & Header */}
        <div className="flex flex-col items-start gap-2 text-center">
          <Logo size="md" variant="on-light" type="cms" />
        </div>

        {/* Login Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <Input
              shape="rounded-sm"
              type="email"
              placeholder="mark@example.com"
              className="bg-white/50 border-white/40 h-11 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Access Key</label>
              <Link href="#" className="text-[9px] font-black text-brand-gold uppercase tracking-widest hover:text-brand-charcoal transition-colors">Recovery</Link>
            </div>
            <Input
              shape="rounded-sm"
              type={showAccessKey ? "text" : "password"}
              placeholder="••••••••••••"
              className="bg-white/50 border-white/40 h-11 text-sm pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suffixElement={
                <button
                  type="button"
                  onClick={() => setShowAccessKey(!showAccessKey)}
                  className="text-gray-400 hover:text-brand-gold transition-colors focus:outline-none mr-2"
                >
                  {showAccessKey ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between mt-1 px-1">
            <Checkbox
              label={<span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.1em]">Remember for 30 days</span>}
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            shape="rounded-sm"
            className="h-12 text-[10px] font-black uppercase tracking-[0.15em] mt-1 shadow-xl shadow-brand-gold/20 hover:bg-brand-gold-light transition-all"
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
