"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { CustomerLoginForm } from "@/app/components/CustomerAuth/CustomerLoginForm";
import { CustomerRegisterForm } from "@/app/components/CustomerAuth/CustomerRegisterForm";
import { motion, AnimatePresence } from "framer-motion";

export default function StoreAuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-inter">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md relative">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <CustomerLoginForm onToggleToRegister={() => setMode("register")} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <CustomerRegisterForm onToggleToLogin={() => setMode("login")} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative background elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -z-10" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
