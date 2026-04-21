"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { Checkbox } from "../Form/Checkbox";

import { useLoginMutation } from "@/lib/redux/services/authApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await login({ email, password }).unwrap();
      
      // The API response matches ApiResponse(200, { user, accessToken, refreshToken }, "...")
      if (response?.success && response?.data) {
        dispatch(setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken
        }));
        
        toast.success("Log-in Successful", {
          description: "Welcome to the Administrative Portal."
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
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center p-2 shadow-lg shadow-brand-gold/20"
          >
            <img src="/dashboardIcon/dashboardLogo.svg" alt="Logo" className="brightness-0 invert w-full h-full object-contain" />
          </motion.div>


        </div>

        {/* Login Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Administrative Email</label>
            <Input
              type="email"
              placeholder="mark@dealport.com"
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
              type="password"
              placeholder="••••••••••••"
              className="bg-white/50 border-white/40 h-11 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        {/* Footer */}
        <p className="text-center text-xs font-medium text-gray-400 mt-4">
          Don't have an administrative account? <br />
          <Link href="#" className="text-brand-gold font-black uppercase tracking-widest text-[10px] ml-1 hover:underline">Contact System Admin</Link>
        </p>
      </div>


    </motion.div>
  );
};
