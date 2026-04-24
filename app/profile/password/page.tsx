"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form";
import { Icon } from "@/app/components/Icon";
import { ProfileSidebar } from "@/app/components/Profile/ProfileSidebar";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PasswordPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-inter">
      <Header />

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-10 lg:px-16 py-6 md:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "User Dashboard", href: "/profile" },
            { label: "Security", href: "/profile/password" },
            { label: "Change Password" }
          ]}
          className="mb-6 md:mb-8"
        />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Enhanced Sidebar */}
          <ProfileSidebar />

          {/* Main Dashboard Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 w-full flex flex-col gap-6 md:gap-8"
          >
            {/* Forms Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-400 mt-1">Update your account security by changing your password periodically.</p>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-8 max-w-2xl">
                  {/* Current Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                    <div className="relative group">
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-none pr-12"
                      />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors">
                        <Icon name="visibility" size="xs" />
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-none"
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50/50 rounded-xl p-4 md:p-6 border border-gray-200">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Password Requirements:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      {[
                        "At least 8 characters long",
                        "One uppercase character",
                        "One lowercase character",
                        "One numerical digit",
                        "One special character",
                        "No common words"
                      ].map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-sm text-gray-400 italic">
                      <Icon name="lock" size="xs" />
                      Make sure your new password is secure.
                    </div>
                    <div className="flex gap-4">
                      <Button variant="ghost" className="h-11 px-6 font-bold text-gray-500 hover:text-gray-900">
                        Cancel
                      </Button>
                      <Button className="h-11 px-8 bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90 font-bold">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 border border-gray-200 flex items-start gap-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Icon name="warning" className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">Add an extra layer of security to your account by enabling two-factor authentication. This helps protect your account from unauthorized access.</p>
                <button className="text-sm font-bold text-brand-blue hover:underline">Setup 2FA Now</button>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
