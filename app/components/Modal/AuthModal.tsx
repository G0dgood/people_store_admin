"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ModalHeader, ModalBody } from "./Modal";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { FloatingInput, Checkbox } from "../Form";
import { Button } from "../Button";
import { Icon } from "../Icon";

const AuthModal = () => {
  const { isOpen, view, closeModal, setView } = useAuthModal();

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="normal">
      <AnimatePresence mode="wait">
        {view === "login" ? (
          <LoginForm key="login" onSwitch={() => setView("register")} onClose={closeModal} />
        ) : view === "register" ? (
          <RegisterForm key="register" onSwitch={() => setView("login")} onClose={closeModal} />
        ) : (
          <ForgotPasswordForm key="forgot" onBack={() => setView("login")} onClose={closeModal} />
        )}
      </AnimatePresence>
    </Modal>
  );
};

const LoginForm = ({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <ModalHeader title="Sign in" onClose={onClose} />
      <ModalBody className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <FloatingInput
            label="Username or Email"
            placeholder="Email or username"
          />

          <div className="flex flex-col gap-1">
            <FloatingInput
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Password"
              suffixElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-brand-blue transition-colors cursor-pointer"
                >
                  <Icon name={showPassword ? "visibility_off" : "visibility"} size="xs" />
                </button>
              }
            />
            <div className="flex justify-end px-1">
              <button 
                onClick={() => useAuthModal().setView("forgotPassword")}
                className="text-[10px] font-bold text-brand-blue hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>

        <Checkbox label="Remember me" id="remember" />

        <Button
          className="w-full h-12 font-bold"
          size="lg"
        >
          Log In
        </Button>

        <div className="relative flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="secondary"
            className="w-full h-11 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100"
            iconLeft={
              <div className="w-5 h-5 flex items-center justify-center bg-[#EA4335] text-white text-[10px] font-bold rounded-full">G</div>
            }
          >
            Continue with Google
          </Button>
          <Button
            variant="secondary"
            className="w-full h-11 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100"
            iconLeft={<Icon name="social/facebook" size="sm" className="text-[#1877F2]" />}
          >
            Continue with Facebook
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-2">
          Don’t have an account?{" "}
          <button onClick={onSwitch} className="text-brand-blue font-bold hover:underline cursor-pointer">Register now</button>
        </p>
      </ModalBody>
    </motion.div>
  );
};

const RegisterForm = ({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ModalHeader title="Create Account" onClose={onClose} />
      <ModalBody className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <FloatingInput label="First Name" placeholder="John" />
          <FloatingInput label="Last Name" placeholder="Doe" />
        </div>

        <div className="flex flex-col gap-4">
          <FloatingInput type="email" label="Email" placeholder="example@gmail.com" />
          <FloatingInput
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="At least 6 characters"
            suffixElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-brand-blue transition-colors cursor-pointer"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} size="xs" />
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-3 px-1">
          <Checkbox
            id="terms"
            label={
              <span className="text-xs text-gray-500 font-medium">
                I agree with <button className="text-brand-blue hover:underline cursor-pointer">Terms and Conditions</button>
              </span>
            }
          />
        </div>

        <Button
          className="w-full h-12 font-bold"
          size="lg"
        >
          Create Account
        </Button>

        <div className="relative flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <Button
          variant="secondary"
          className="w-full h-11 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100"
          iconLeft={
            <div className="w-5 h-5 flex items-center justify-center bg-[#EA4335] text-white text-[10px] font-bold rounded-full">G</div>
          }
        >
          Register with Google
        </Button>

        <p className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-brand-blue font-bold hover:underline cursor-pointer">Log In</button>
        </p>
      </ModalBody>
    </motion.div>
  );
};

const ForgotPasswordForm = ({ onBack, onClose }: { onBack: () => void; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    <ModalHeader title="Reset Password" onClose={onClose} />
    <ModalBody className="flex flex-col gap-6 py-6 p-10">
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm text-gray-500">
          Enter your email address and we'll send you a link to reset your password.
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
      >
        Send Reset Link
      </Button>

      <p className="text-center text-sm text-gray-500 mt-2">
        Remember your password?{" "}
        <button onClick={onBack} className="text-brand-blue font-bold hover:underline cursor-pointer">Back to Login</button>
      </p>
    </ModalBody>
  </motion.div>
);

export { AuthModal };
