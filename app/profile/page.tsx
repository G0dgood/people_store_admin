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
import { useGetCurrentCustomerQuery, useUpdateCustomerProfileMutation } from "@/lib/redux/services/customerApi";
import { toast } from "sonner";
import { ProfileSkeleton } from "@/app/components/Skeleton/ProfileSkeleton";
import { useApiError } from "@/app/hooks/useApiError";

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

export default function ProfilePage() {
  const { data: customerResponse, isLoading: isProfileLoading } = useGetCurrentCustomerQuery();
  const [updateProfile, { isLoading: isUpdating, isError, error }] = useUpdateCustomerProfileMutation();

  useApiError(isError, error, "Failed to update profile");
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: ""
  });

  const customer = (customerResponse as any)?.data;

  React.useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName || "",
        email: customer.email || "",
        phoneNumber: customer.phoneNumber || "",
        address: customer.address || ""
      });
    }
  }, [customer]);

  const handleUpdate = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      // Error handled by hook
    }
  };

  if (isProfileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-inter">
      <Header />

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-10 lg:px-16 py-6 md:py-8">
        <Breadcrumbs
          items={[{ label: "User Dashboard", href: "/profile" }, { label: "Personal Info" }]}
          className="mb-6 md:mb-8"
        />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <ProfileSidebar />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 w-full flex flex-col gap-6 md:gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl   border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-400 mt-1">Update your basic account details and contact information.</p>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <Input
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <Input
                      placeholder="Email address"
                      value={formData.email}
                      disabled
                      className="h-12 bg-gray-50/5 border-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <Input
                      placeholder="Phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Address</label>
                    <Input
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-sm text-gray-400 italic">
                    <Icon name="security" size="xs" />
                    Your personal data is encrypted and secure.
                  </div>
                  <div className="flex gap-4">
                    <Button
                      shape="rounded-sm"
                      variant="outline"
                      className="h-11 px-6 font-bold text-gray-500 hover:text-gray-900"
                      onClick={() => customer && setFormData({
                        fullName: customer.fullName || "",
                        email: customer.email || "",
                        phoneNumber: customer.phoneNumber || "",
                        address: customer.address || ""
                      })}
                    >
                      Discard
                    </Button>
                    <Button
                      shape="rounded-sm"
                      className="h-11 px-8 bg-brand-gold text-white shadow-lg shadow-brand-gold/20 hover:bg-brand-gold/90 font-bold"
                      onClick={handleUpdate}
                      isLoading={isUpdating}
                    >
                      Save Profile
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-r from-brand-gold to-blue-700 p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="z-10 text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">Stay updated on new deals!</h3>
                <p className="opacity-80 text-sm">Subscribe to get the latest news on products and discounts.</p>
              </div>
              <div className="z-10 flex w-full md:w-auto gap-2">
                <input
                  placeholder="Email address"
                  className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-sm placeholder:text-white/60 outline-none focus:bg-white/30 transition-all flex-1 md:w-64"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
                  Join
                </button>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

