"use client";

import React from "react";
import Modal from "./Modal";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { FloatingInput } from "../Form";
import { Icon } from "../Icon";
import { TermsModal } from "./TermsModal";
import Checkbox from "../Checkbox";
import { Button } from "../Button";
import { useLoginCustomerMutation, useRegisterCustomerMutation } from "@/lib/redux/services/customerApi";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { toast } from "sonner";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { LuCamera, LuUser, LuEye, LuEyeOff } from "react-icons/lu";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setView, closeModal } = useAuthModal();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginCustomerMutation();
  const { setCustomerData } = useCustomerAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

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

        toast.success("Welcome back!", { description: "Happy shopping!" });
        closeModal();
      }
    } catch (err: any) {
      toast.error("Login Failed", { description: err?.data?.message || "Invalid credentials." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FloatingInput
          type="email"
          label="Email Address"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1">
          <FloatingInput
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            suffixElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-brand-blue transition-colors cursor-pointer mr-2"
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            }
          />
          <div className="flex justify-end px-1">
            <button
              type="button"
              onClick={() => setView("forgotPassword")}
              className="text-[10px] font-bold text-brand-blue hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>

      <Checkbox 
        label="Remember me" 
        id="remember" 
        checked={rememberMe} 
        onChange={setRememberMe} 
      />

      <Button
        type="submit"
        isLoading={isLoading}
        shape="rounded-sm" className="w-full h-12 font-bold" size="lg">
        Log In
      </Button>

      <div className="relative flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-gray-100"></div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
          OR
        </span>
        <div className="flex-1 h-px bg-gray-100"></div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          shape="rounded-sm"
          variant="secondary"
          className="w-full h-11 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100"
          iconLeft={<FaGoogle className="text-rose-500" />}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          shape="rounded-sm"
          variant="secondary"
          className="w-full h-11 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100"
          iconLeft={<FaFacebook className="text-blue-600" />}
        >
          Continue with Facebook
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-2">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-brand-blue font-bold hover:underline cursor-pointer"
        >
          Register now
        </button>
      </p>
    </form>
  );
};

const RegisterForm = ({
  onSwitch,
}: {
  onSwitch: () => void;
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { closeModal } = useAuthModal();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterCustomerMutation();
  const { setCustomerData } = useCustomerAuth();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register({ fullName, email, password, avatar }).unwrap();
      if (response?.success && response?.data) {
        // Update Redux
        dispatch(setCredentials({
          user: response.data,
          accessToken: response.data.accessToken || ""
        }));

        // Update Context (Cookies)
        setCustomerData(response.data);

        toast.success("Account Created!", { description: "Welcome to our boutique." });
        closeModal();
      }
    } catch (err: any) {
      toast.error("Registration Failed", { description: err?.data?.message || "Something went wrong." });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div
            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center relative group cursor-pointer overflow-hidden transition-all hover:border-brand-blue"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <LuUser className="text-gray-300 w-8 h-8" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <LuCamera className="text-white w-5 h-5" />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Profile Picture</span>
        </div>

        <div className="flex flex-col gap-4">
          <FloatingInput label="Full Name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <FloatingInput type="email" label="Email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <FloatingInput
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            suffixElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-brand-blue transition-colors cursor-pointer mr-2"
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-3 px-1">
          <Checkbox
            size="md"
            id="terms"
            checked={isAgreed}
            onChange={setIsAgreed}
            label={
              <span className="text-xs text-gray-500 font-medium">
                I agree with{" "}
                <button type="button" onClick={() => setIsTermsOpen(true)} className="text-brand-blue hover:underline cursor-pointer">
                  Terms and Conditions
                </button>
              </span>
            }
            required
          />
        </div>

        <Button
          shape="rounded-sm"
          type="submit"
          isLoading={isLoading}
          className="w-full h-12 font-bold" size="lg">
          Create Account
        </Button>
      </form>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => setIsAgreed(true)}
      />

      <p className="text-center text-sm text-gray-500 mt-2">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-brand-blue font-bold hover:underline cursor-pointer">
          Sign In
        </button>
      </p>
    </div>
  );
};

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold text-gray-900">Reset your password</h3>
      <p className="text-sm text-gray-500">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <FloatingInput
        label="Email Address"
        placeholder="example@gmail.com"
        type="email"
      />
    </div>

    <Button
      shape="rounded-sm"
      className="w-full h-12 font-bold" size="lg">
      Send Reset Link
    </Button>

    <p className="text-center text-sm text-gray-500 mt-2">
      Remember your password?{" "}
      <button
        onClick={onBack}
        className="text-brand-blue font-bold hover:underline cursor-pointer"
      >
        Back to Login
      </button>
    </p>
  </div>
);

const AuthModal = () => {
  const { isOpen, view, closeModal, setView } = useAuthModal();

  const titles = {
    login: "Sign in",
    register: "Create Account",
    forgotPassword: "Reset Password",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="sm"
      title={titles[view as keyof typeof titles]}
    >
      {view === "login" ? (
        <LoginForm key="login" onSwitch={() => setView("register")} />
      ) : view === "register" ? (
        <RegisterForm
          key="register"
          onSwitch={() => setView("login")}
        />
      ) : (
        <ForgotPasswordForm key="forgot" onBack={() => setView("login")} />
      )}
    </Modal>
  );
};

export { AuthModal };
