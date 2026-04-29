"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "../Form/Inputs";
import { Button } from "../Button";
import { Logo } from "../Logo";
import { LuEye, LuEyeOff, LuCamera, LuUser } from "react-icons/lu";
import { useRegisterCustomerMutation } from "@/lib/redux/services/customerApi";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useApiError } from "@/app/hooks/useApiError";
import { toast } from "sonner";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import Checkbox from "../Checkbox";
import { TermsModal } from "../Modal/TermsModal";
import imageCompression from "browser-image-compression";

interface CustomerRegisterFormProps {
  onToggleToLogin: () => void;
}

export const CustomerRegisterForm = ({ onToggleToLogin }: CustomerRegisterFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading, isError, error }] = useRegisterCustomerMutation();
  const [isCompressing, setIsCompressing] = useState(false);

  useApiError(isError, error, "Account Creation Failed");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        
        // Convert to File object if it's a Blob
        const finalFile = new File([compressedFile], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        setAvatar(finalFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(finalFile);
      } catch (error) {
        console.error("Compression error:", error);
        toast.error("Image processing failed");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await register({ fullName, email, password, avatar }).unwrap();

      if (response?.success && response?.data) {
        dispatch(setCredentials({
          user: response.data,
          accessToken: response.data.accessToken || ""
        }));

        toast.success("Account Created!", {
          description: "Welcome to our boutique family."
        });

        router.push("/"); // Go to home/shop
      }
    } catch (err) {
      // Error handled by useApiError hook
    }
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
          <h2 className="text-2xl font-black text-brand-charcoal">Create Account</h2>
          <p className="text-sm text-gray-400 font-medium">Join our exclusive boutique community</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2 h-12">
            <FaGoogle className="text-rose-500" />
            <span className="text-xs font-bold">Google</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 h-12">
            <FaFacebook className="text-blue-600" />
            <span className="text-xs font-bold">Facebook</span>
          </Button>
        </div>

        <div className="w-full relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest">Or email signup</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* High-Fidelity Avatar Upload */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div 
              className="w-24 h-24 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center relative group cursor-pointer overflow-hidden transition-all hover:border-brand-blue"
              onClick={() => !isCompressing && fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              ) : (
                <LuUser className="text-gray-300 w-10 h-10" />
              )}
              
              {isCompressing ? (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                  <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mb-1"></div>
                  <span className="text-[8px] font-black text-brand-blue uppercase tracking-widest">Compressing</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <LuCamera className="text-white w-6 h-6" />
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                disabled={isCompressing}
              />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {isCompressing ? "Optimizing..." : "Upload Profile Photo"}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
            <Input
              placeholder="John Doe"
              className="h-12"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
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

          <div className="flex flex-col gap-3 px-1">
            <Checkbox
              id="terms"
              checked={isAgreed}
              onChange={setIsAgreed}
              label={
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  I agree to the <button type="button" onClick={() => setIsTermsOpen(true)} className="text-brand-blue hover:underline">Terms & Conditions</button>
                </span>
              }
              required
            />
          </div>

          <Button
            type="submit"
            className="h-12 bg-brand-charcoal text-white font-bold rounded-xl mt-2 shadow-lg shadow-gray-200 hover:scale-[1.02] transition-transform"
            isLoading={isLoading}
          >
            Create Your Account
          </Button>
        </form>

        <TermsModal 
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          onAccept={() => setIsAgreed(true)}
        />

        <p className="text-sm text-gray-500">
          Already a member?{" "}
          <button onClick={onToggleToLogin} className="text-brand-blue font-black hover:underline ml-1">
            Login Now
          </button>
        </p>
      </div>
    </motion.div>
  );
};
