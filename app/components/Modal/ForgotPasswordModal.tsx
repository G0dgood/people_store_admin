"use client";

import React from "react";
import Modal from "./Modal";
import { FloatingInput } from "../Form";
import { Button } from "../Button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Reset Password"
    >
      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
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
          className="w-full h-12 font-bold" 
          size="lg"
          onClick={() => {
            // Logic for sending reset link would go here
            console.log("Reset link sent");
          }}
        >
          Send Reset Link
        </Button>

        {onBackToLogin && (
          <p className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <button
              onClick={onBackToLogin}
              className="text-brand-blue font-bold hover:underline cursor-pointer"
            >
              Back to Login
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
};
