"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { Logo } from "../Logo";
import { LuEye, LuEyeOff, LuCamera, LuUser } from "react-icons/lu";
import { useRegisterMutation } from "@/lib/redux/services/authApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisterFormProps {
 onToggleToLogin: () => void;
}

export const RegisterForm = ({ onToggleToLogin }: RegisterFormProps) => {
 const router = useRouter();
 const dispatch = useAppDispatch();
 const [register, { isLoading }] = useRegisterMutation();

 const [fullName, setFullName] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [avatar, setAvatar] = useState<File | null>(null);
 const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   setAvatar(file);
   const reader = new FileReader();
   reader.onloadend = () => {
    setAvatarPreview(reader.result as string);
   };
   reader.readAsDataURL(file);
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!avatar) {
   toast.error("Avatar Required", {
    description: "Please upload a profile picture to complete your registration."
   });
   return;
  }

  try {
   const response = await register({ fullName, email, password, avatar }).unwrap();

   if (response?.success && response?.data) {
    // Automatically log in after registration if the API returns tokens
    dispatch(setCredentials({
     user: response.data,
     accessToken: response.data.accessToken || "" // Adjust based on backend response
    }));

    toast.success("Account Created", {
     description: "Welcome to the boutique! Your account is now active."
    });

    router.push("/admin"); // Or to the shop
   }
  } catch (err: any) {
   toast.error("Registration Failed", {
    description: err?.data?.message || "Could not create account. Please try again."
   });
  }
 };

 return (
  <motion.div
   initial={{ opacity: 0, x: 30 }}
   animate={{ opacity: 1, x: 0 }}
   transition={{ duration: 0.8, ease: "easeOut" }}
   className="relative z-10 w-full max-w-[420px] bg-white/70 backdrop-blur-xl rounded-[6px] border border-white/40 shadow-[0_32px_80px_rgba(0,0,0,0.1)] overflow-hidden lg:ml-12"
  >
   <div className="p-8 sm:p-10 flex flex-col gap-6">
    {/* Form Logo & Header */}
    <div className="flex flex-col items-center gap-2 text-center">
     <Logo size="md" variant="on-light" type="cms" />
     <h2 className="text-xl font-black text-brand-charcoal tracking-tight">Join the Boutique</h2>
     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Create your account to start shopping</p>
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
     {/* Avatar Upload */}
     <div className="flex flex-col items-center gap-3 mb-2">
      <div
       className="w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative group cursor-pointer overflow-hidden transition-all hover:border-brand-gold"
       onClick={() => fileInputRef.current?.click()}
      >
       {avatarPreview ? (
        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover transition-all group-hover:scale-110" />
       ) : (
        <LuUser className="text-gray-300 w-8 h-8" />
       )}
       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <LuCamera className="text-white w-6 h-6" />
       </div>
       <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarChange}
       />
      </div>
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Upload Profile Picture</span>
     </div>

     <div className="flex flex-col gap-1">
      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
      <Input
       shape="rounded-sm"
       placeholder="John Doe"
       className="bg-white/50 border-white/40 h-10 text-sm"
       value={fullName}
       onChange={(e) => setFullName(e.target.value)}
       required
      />
     </div>

     <div className="flex flex-col gap-1">
      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
      <Input
       shape="rounded-sm"
       type="email"
       placeholder="john@example.com"
       className="bg-white/50 border-white/40 h-10 text-sm"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       required
      />
     </div>

     <div className="flex flex-col gap-1">
      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
      <Input
       shape="rounded-sm"
       type={showPassword ? "text" : "password"}
       placeholder="••••••••••••"
       className="bg-white/50 border-white/40 h-10 text-sm pr-10"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       required
       suffixElement={
        <button
         type="button"
         onClick={() => setShowPassword(!showPassword)}
         className="text-gray-400 hover:text-brand-gold transition-colors focus:outline-none mr-2"
        >
         {showPassword ? <LuEyeOff size={14} /> : <LuEye size={14} />}
        </button>
       }
      />
     </div>

     <Button
      shape="rounded-sm"
      type="submit"
      variant="primary"
      className="h-11 text-[10px] font-black uppercase tracking-[0.15em] mt-2 shadow-xl shadow-brand-gold/20 hover:bg-brand-gold-light transition-all"
      isLoading={isLoading}
     >
      Create Account
     </Button>
    </form>

    {/* Footer */}
    <p className="text-center text-xs font-medium text-gray-400 mt-2">
     Already have an account? <br />
     <button
      onClick={onToggleToLogin}
      className="text-brand-gold font-black uppercase tracking-widest text-[10px] ml-1 hover:underline"
     >
      Login to Account
     </button>
    </p>
   </div>
  </motion.div>
 );
};
