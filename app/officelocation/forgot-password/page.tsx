"use client";

import { useState } from "react";
import Link from "next/link";
import { IoGrid } from "react-icons/io5";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useCustomerForgotPasswordMutation } from "@/lib/redux/services/customerAuthApi";
import { toast } from "sonner";
import { SVGLoader } from "@/app/components/SVGLoader";
import { useApiError } from "@/app/hooks/useApiError";

export default function CustomerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isError, error }] = useCustomerForgotPasswordMutation();

  useApiError(isError, error, "Failed to send reset link");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Password reset link sent to your email!");
    } catch (err: unknown) {
      console.error("Forgot password failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header / Logo */}
        <div className="flex items-center gap-2 text-neutral-500">
          <IoGrid className="text-tecnova-blue h-6 w-6" />
          <span className="text-sm font-medium">Powered by Tecnova</span>
        </div>

        {/* Title Section */}
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#156BB6] sm:text-4xl">
            Forgot Password
          </h1>
          <p className="mt-2 text-base text-neutral-500">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <Link href="/customer/signin" className="text-sm font-medium text-[#156BB6] hover:underline">
              Back to Sign In
            </Link>
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? <SVGLoader width="24px" height="24px" color="#fff" /> : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
