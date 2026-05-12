"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { IoGrid } from "react-icons/io5";
import {
  useGetCurrentCustomerQuery,
  useUpdateOwnCustomerProfileMutation,
  useUpdateOwnCustomerPasswordMutation
} from "@/lib/redux/services/customersApi";
import { toast } from "sonner";
import { SVGLoader } from "@/app/components/SVGLoader";
import { useApiError } from "@/app/hooks/useApiError";
import { CustomerProfileSkeleton } from "@/app/components/Skeleton/CustomerProfileSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer, selectCustomer } from "@/lib/redux/slices/authSlice";
import { useUserInfo } from "@/app/contexts/UserInfoContext";
import { getStoreUrl, parseStoreContextFromUrl, getShopUrl } from "@/app/utils/storeUtils";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useGetCurrentCustomerOrdersQuery } from "@/lib/redux/services/ordersApi";
import { CustomerHeader } from "../../components/customer-header";

function CustomerProfilePageContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { storeContext, updateStoreContext } = useUserInfo();
  const currentCustomer = useSelector(selectCustomer);
  const { data: customerData, isLoading: isLoadingCustomer } = useGetCurrentCustomerQuery();
  const [updateProfile, { isLoading: isUpdatingProfile, isError: isProfileError, error: profileError }] = useUpdateOwnCustomerProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword, isError: isPasswordError, error: passwordError }] = useUpdateOwnCustomerPasswordMutation();

  const { data: ordersData, isLoading: isLoadingOrders } = useGetCurrentCustomerOrdersQuery(
    undefined,
    { skip: !customerData?.id && !currentCustomer?.id }
  );

  const orders = ordersData?.data || [];

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

  const [businessInfo, setBusinessInfo] = useState<import("@/lib/redux/services/businessesApi").Business | null>(null);

  const subdomain = searchParams.get("subdomain") || storeContext?.subdomain;

  useEffect(() => {
    if (subdomain) {
      const savedBusiness = localStorage.getItem(`tecnova_business_${subdomain}`);
      if (savedBusiness) {
        setBusinessInfo(JSON.parse(savedBusiness));
      }
    }
  }, [subdomain]);

  useEffect(() => {
    const searchString = window.location.search.substring(1);
    const context = parseStoreContextFromUrl(searchParams, searchString);
    if (context) {
      updateStoreContext(context);
    }
  }, [searchParams, updateStoreContext]);

  useEffect(() => {
    if (customerData) {
      setFormData({
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        phoneNumber: customerData.phoneNumber || customerData.phone || "",
        email: customerData.email || "",
      });
    } else if (currentCustomer) {
      setFormData({
        firstName: currentCustomer.firstName || "",
        lastName: currentCustomer.lastName || "",
        phoneNumber: currentCustomer.phoneNumber || currentCustomer.phone || "",
        email: currentCustomer.email || "",
      });
    }
  }, [customerData, currentCustomer]);

  useApiError(isProfileError, profileError, "Failed to update profile");
  useApiError(isPasswordError, passwordError, "Failed to update password");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData).unwrap();
      dispatch(setCustomer(result));
      localStorage.setItem("tecnovaCustomer", JSON.stringify(result));
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
  const businessLogo = businessInfo?.logo?.fileUrl || businessInfo?.BusinessDocuments?.[0]?.fileUrl;

  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader
        businessName={businessInfo?.name}
        businessDescription={businessInfo?.description}
        logoUrl={businessLogo}
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
              href={getStoreUrl(storeContext?.subdomain, storeContext?.businessId, storeContext?.officeId)}
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
                <Input
                  label="First Name"
                  placeholder="Enter here"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  fullWidth
                  disabled={isUpdatingProfile}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter here"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  fullWidth
                  disabled={isUpdatingProfile}
                />
                <Input
                  label="Phone Number"
                  placeholder="+2348144699332"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  fullWidth
                  disabled={isUpdatingProfile}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  fullWidth
                  disabled={true}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" fullWidth size="lg" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? <SVGLoader width="24px" height="24px" color="#fff" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </section>

          <hr className="my-10 border-neutral-100" />

          <section className="">
            <h2 className="text-xl font-medium text-[#3E4347] mb-6">Security</h2>
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter here"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                fullWidth
                showPasswordToggle
                disabled={isUpdatingPassword}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter here"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  fullWidth
                  showPasswordToggle
                  disabled={isUpdatingPassword}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Enter here"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  fullWidth
                  showPasswordToggle
                  disabled={isUpdatingPassword}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" fullWidth size="lg" variant="outline-primary" disabled={isUpdatingPassword}>
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
                  const firstItem = order.items?.[0]?.officeInventory?.product;
                  const orderName = firstItem?.name || order.name || "Order";
                  const orderImage = firstItem?.ProductImages?.[0]?.filePath || firstItem?.images?.[0]?.filePath || "/genericProduct.jpg";

                  return (
                    <Link
                      key={order.id}
                      href={getShopUrl(`/customer/orders/${order.id}`, storeContext?.subdomain)}
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
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {order.status || "PENDING"}
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
