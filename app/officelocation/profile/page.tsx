"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IoGrid } from "react-icons/io5";
import {
  useGetCurrentCustomerQuery,
  useUpdateCustomerProfileMutation,
  useChangeCustomerPasswordMutation
} from "@/lib/redux/services/customerApi";
import { useGetMyOrdersQuery as useGetCurrentOfficeLocationOrdersQuery } from "@/lib/redux/services/orderApi";
import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { SVGLoader } from "@/app/components/SVGLoader";
import { useApiError } from "@/app/hooks/useApiError";
import { CustomerProfileSkeleton } from "../components/Skeleton/CustomerProfileSkeleton";
import { useCustomerAuth } from "@/app/context/CustomerAuthContext";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { getStoreUrl, parseStoreContextFromUrl, getShopUrl } from "../utils/storeUtils";
import { Input } from "@/app/components/Form/Inputs";
import { CustomerHeader } from "../components/customer-header";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form";

function CustomerProfilePageContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { storeContext, updateStoreContext } = useOfficeLocationInfo();
  const { customer: currentStaff, setCustomerData } = useCustomerAuth();
  const { data: customerResponse, isLoading: isLoadingCustomer } = useGetCurrentCustomerQuery();
  const StaffData = customerResponse?.data;
  const [updateProfile, { isLoading: isUpdatingProfile, isError: isProfileError, error: profileError }] = useUpdateCustomerProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword, isError: isPasswordError, error: passwordError }] = useChangeCustomerPasswordMutation();

  const { data: ordersData, isLoading: isLoadingOrders } = useGetCurrentOfficeLocationOrdersQuery(
    {},
    { skip: !StaffData?._id && !currentStaff?._id }
  );

  const orders = ordersData?.data?.orders || [];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const subdomain = searchParams.get("subdomain") || storeContext?.subdomain;

  const { data: officeRes, isLoading: isLoadingOffice } = useGetOfficeBySubdomainQuery(subdomain || "", {
    skip: !subdomain
  });
  const office = officeRes?.data;

  useEffect(() => {
    const rawParams = searchParams.toString();
    const parsed = parseStoreContextFromUrl(searchParams, rawParams);
    if (parsed) {
      updateStoreContext(parsed);
    }
  }, [searchParams, updateStoreContext]);

  useEffect(() => {
    const data = StaffData || currentStaff;
    if (data) {
      // Handle name splitting if only fullName is available
      let fName = (data as any).firstName || "";
      let lName = (data as any).lastName || "";

      if (!fName && !lName && (data as any).fullName) {
        const parts = (data as any).fullName.split(" ");
        fName = parts[0] || "";
        lName = parts.slice(1).join(" ") || "";
      }

      setFormData({
        firstName: fName,
        lastName: lName,
        phoneNumber: (data as any).phoneNumber || (data as any).phone || "",
        email: data.email || "",
      });
    }
  }, [StaffData, currentStaff]);

  useApiError(isProfileError, profileError, "Failed to update profile");
  useApiError(isPasswordError, passwordError, "Failed to update password");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData).unwrap();
      if (result?.data) {
        setCustomerData(result.data);
      }
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      console.error("Profile update failed:", err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      console.error("Password update failed:", err);
    }
  };

  if (isLoadingCustomer) {
    return <CustomerProfileSkeleton />;
  }

  const recentOrders = orders?.slice(0, 3) || [];
  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader
        businessName={office?.name || "Bloom & Mist"}
        businessDescription={office?.address}
        logoUrl={undefined}
        showSearch={false}
      />

      <div className="flex flex-col items-center px-4 py-8 md:py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500">
              <IoGrid className="text-tecnova-blue h-5 w-5 md:h-6 md:w-6" />
              <span className="text-xs font-medium md:text-sm">Powered by Tecnovo</span>
            </div>
            <Link
              href={getStoreUrl(storeContext?.subdomain, storeContext?.officeId)}
              className="text-xs font-medium text-[#156BB6] hover:underline md:text-sm"
            >
              Back to Home
            </Link>
          </div>

          <div className="mt-4 md:mt-8">
            <h1 className="text-2xl font-semibold tracking-tight text-[#156BB6] sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-neutral-500 md:text-base">
              Manage your account details and security
            </p>
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-medium text-[#3E4347] mb-6">Personal Information</h2>
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <Label>First Name</Label>
                  <Input
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={isUpdatingProfile}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Last Name</Label>
                  <Input
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={isUpdatingProfile}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="+2348144699332"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    disabled={isUpdatingProfile}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={true}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? <SVGLoader width="24px" height="24px" color="#fff" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </section>

          <hr className="my-10 border-neutral-100" />

          <section className="">
            <h2 className="text-xl font-medium text-[#3E4347] mb-6">Security</h2>
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="space-y-1">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  disabled={isUpdatingPassword}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    disabled={isUpdatingPassword}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    disabled={isUpdatingPassword}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" variant="outline" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? <SVGLoader width="24px" height="24px" color="#156BB6" /> : "Update Password"}
                </Button>
              </div>
            </form>
          </section>

          <hr className="my-10 border-neutral-100" />

          <section className="pb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-[#3E4347]">Recent Orders</h2>
              <Link
                href={getShopUrl("/customer/orders", storeContext?.subdomain)}
                className="text-sm font-medium text-[#156BB6] hover:underline"
              >
                View All
              </Link>
            </div>

            {isLoadingOrders ? (
              <div className="flex justify-center py-8">
                <SVGLoader width="32px" height="32px" color="#156BB6" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 py-10 text-center">
                <p className="text-sm text-neutral-500">No orders found yet.</p>
                <Link
                  href={getStoreUrl(storeContext?.subdomain)}
                  className="mt-2 inline-block text-sm font-medium text-[#156BB6] hover:underline"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const firstItem = order.items?.[0]?.product;
                  const orderName = firstItem?.name || order.orderId || "Order";
                  const orderImage = firstItem?.ProductImages?.[0]?.filePath || firstItem?.images?.[0]?.filePath || "/genericProduct.jpg";

                  return (
                    <Link
                      key={order._id}
                      href={getShopUrl(`/orders`, storeContext?.subdomain)}
                      className="flex flex-col gap-3 rounded-xl border border-neutral-100 p-4 transition-colors hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-50 p-1">
                          <Image
                            src={orderImage}
                            alt={orderName}
                            fill
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-medium text-neutral-900">{orderName}</h4>
                          <p className="text-xs text-neutral-500">
                            {new Date(order.createdAt || "").toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-neutral-50 pt-3 sm:block sm:border-none sm:pt-0 sm:text-right">
                        <p className="text-sm font-semibold text-[#156BB6]">
                          ₦ {order.totalAmount?.toLocaleString()}
                        </p>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {order.status || "Pending"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  return (
    <Suspense fallback={<CustomerProfileSkeleton />}>
      <CustomerProfilePageContent />
    </Suspense>
  );
}
