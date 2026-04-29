"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { Checkbox } from "../Form/Checkbox";
import { Logo } from "../Logo";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useLoginCustomerMutation, useSocialLoginCustomerMutation } from "@/lib/redux/services/customerApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useApiError } from "@/app/hooks/useApiError";
import { toast } from "sonner";

interface CustomerLoginFormProps {
  onToggleToRegister: () => void;
}

export const CustomerLoginForm = ({ onToggleToRegister }: CustomerLoginFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, isError, error }] = useLoginCustomerMutation();
  const [socialLogin] = useSocialLoginCustomerMutation();

  useApiError(isError, error, "Login Failed");

  const { setCustomerData } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, password, rememberMe }).unwrap();

      if (response?.success && response?.data) {
        // Update Redux
        dispatch(setCredentials({
          user: response.data.customer,
          accessToken: response.data.accessToken
        }));

        // Update Context (Cookies)
        setCustomerData(response.data.customer);

        toast.success("Welcome back!", {
          description: "Happy shopping at the boutique."
        });

        router.push("/"); // Redirect to home/shop
      }
    } catch (err) {
      // Error handled by useApiError hook
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // This would normally involve OAuth redirect
    // For now, we'll simulate the call
    toast.info(`${provider} login starting...`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="flex flex-col items-center gap-6">
        <Logo size="md" />
        <div className="text-center">
          <h2 className="text-2xl font-black text-brand-charcoal">Customer Login</h2>
          <p className="text-sm text-gray-400 font-medium">Log in to manage your orders and profile</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => handleSocialLogin("Google")} className="flex items-center justify-center gap-2 h-12">
            <FaGoogle className="text-rose-500" />
            <span className="text-xs font-bold">Google</span>
          </Button>
          <Button variant="outline" onClick={() => handleSocialLogin("Facebook")} className="flex items-center justify-center gap-2 h-12">
            <FaFacebook className="text-blue-600" />
            <span className="text-xs font-bold">Facebook</span>
          </Button>
        </div>

        <div className="w-full relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest">Or email login</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              className="h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[10px] font-black text-brand-blue uppercase hover:underline">Forgot?</Link>
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suffixElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-brand-blue mr-3"
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <Checkbox 
              id="rememberMe" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              label={<span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Remember me</span>} 
            />
          </div>

          <Button
            type="submit"
            className="h-12 bg-brand-charcoal text-white font-bold rounded-xl mt-2 shadow-lg shadow-gray-200"
            isLoading={isLoading}
          >
            Login to Account
          </Button>
        </form>

        <p className="text-sm text-gray-500">
          New to the boutique?{" "}
          <Button
            shape="rounded-sm"
            variant="ghost"
            className="text-brand-blue font-black hover:underline ml-1"
            onClick={onToggleToRegister}
          >
            Create Account
          </Button>
        </p>
      </div>
    </motion.div>
  );
};
