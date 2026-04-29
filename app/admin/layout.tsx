"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "../components/Admin/AdminSidebar";
import { AdminHeader } from "../components/Admin/AdminHeader";
import { UserProvider } from "../context/UserContext";
import { PrivilegeProvider } from "@/lib/contexts/PrivilegeContext";
import { usePathname, useRouter } from "next/navigation";
import { AdminThemeProvider, useAdminTheme } from "../context/AdminThemeContext";
import { usePrivilege, ModuleId } from "@/lib/contexts/PrivilegeContext";
import { toast } from "sonner";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminDark } = useAdminTheme();
  const { canAccess, isLoading, userPrivileges } = usePrivilege();

  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  // Route-level permission protection
  useEffect(() => {
    if (isLoading || !userPrivileges) return;

    const routeModuleMap: Record<string, ModuleId> = {
      "/admin/orders": "orders",
      "/admin/products": "products",
      "/admin/customers": "customers",
      "/admin/users": "users",
      "/admin/roles": "roles",
      "/admin/permissions": "permissions",
      "/admin/categories": "categories",
      "/admin/brands": "brands",
      "/admin/transactions": "transactions",
      "/admin/refunds": "refunds",
      "/admin/support": "support",
      "/admin/faq": "faq",
      "/admin/notifications": "notifications",
      "/admin/profile": "profile",
      "/admin/deals": "deals",
      "/admin/advert": "advert",
      "/admin/reviews": "reviews",
      "/admin/coupons": "marketing",
    };

    // Find the matching module for the current path
    const matchingRoute = Object.keys(routeModuleMap).find(route => 
      pathname === route || pathname.startsWith(route + "/")
    );

    if (matchingRoute) {
      const moduleId = routeModuleMap[matchingRoute];
      if (!canAccess(moduleId, "view")) {
        toast.error("Access Denied", {
          description: `You do not have the required permissions to view the ${moduleId} module.`
        });
        router.push("/admin");
      }
    }
  }, [pathname, isLoading, userPrivileges, canAccess, router]);

  return (
    <div className={`admin-theme ${isAdminDark ? 'admin-dark' : ''} min-h-screen transition-colors duration-500`}>
      <div id="page-wrapper" className={`overflow-x-hidden ${mobileMenuOpen ? "mobile-nav-open" : ""}`}>
        <AdminHeader onOpenMenu={() => setMobileMenuOpen((prev) => !prev)}
          isOpen={mobileMenuOpen}
        />
        <AdminSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <PrivilegeProvider>
        <AdminThemeProvider>
          <AdminLayoutContent>
            {children}
          </AdminLayoutContent>
        </AdminThemeProvider>
      </PrivilegeProvider>
    </UserProvider>
  );
}
