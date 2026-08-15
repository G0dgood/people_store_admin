"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { UserProvider } from "@/app/context/UserContext";
import { PrivilegeProvider } from "@/lib/contexts/PrivilegeContext";
import { usePathname, useRouter } from "next/navigation";
import { AdminThemeProvider, useAdminTheme } from "@/app/context/AdminThemeContext";
import { usePrivilege, ModuleId } from "@/lib/contexts/PrivilegeContext";
import { useGetCurrentUserQuery } from "@/lib/redux/services/authApi";
import { toast } from "sonner";
import { SocketProvider, useSocket } from "@/app/context/SocketContext";
import { toastSuccess, toastInfo } from "@/app/utils/toastWithSound";
import { useDispatch } from "react-redux";
import { messageApi } from "@/lib/redux/services/messageApi";

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

  const dispatch = useDispatch();
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetCurrentUserQuery();
  const { on, off, socket } = useSocket();

  // Real-time Order Notification
  useEffect(() => {
    const handleNewOrder = (order: any) => {
      toastSuccess(`New Order Received!`, {
        description: `Order #${order.orderId || order._id.slice(-6).toUpperCase()} from ${order.customer?.fullName || 'Guest'}`,
        duration: 8000,
      }, 'orders');
    };

    on("newOrder", handleNewOrder);
    return () => off("newOrder", handleNewOrder);
  }, [on, off, socket]);

  // Real-time Chat & Support Ticket Notifications
  useEffect(() => {
    if (!userData?.data?._id) return;
    const adminId = userData.data._id;

    const handleIncomingMessage = (msg: any) => {
      const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
      
      dispatch(messageApi.util.invalidateTags([{ type: 'Message', id: 'UNREAD' }]));

      if (String(senderId) !== String(adminId)) {
        if (typeof window !== "undefined" && (window as any).__activeChatCustomerId === String(senderId)) {
          return;
        }
        
        const senderName = msg.sender?.fullName || "Customer";
        toastInfo(`New message from ${senderName}`, {
          description: msg.message,
          duration: 6000,
        }, 'notifications');
      }
    };

    const handleTicketUpdate = (ticket: any) => {
      const responses = ticket.responses || [];
      const lastResponse = responses[responses.length - 1];

      if (typeof window !== "undefined" && (window as any).__activeSupportTicketId === String(ticket._id)) {
        return;
      }

      if (lastResponse && lastResponse.sender === "Customer") {
        toastInfo(`New reply on ticket ${ticket.ticketId}`, {
          description: lastResponse.message,
          duration: 6000,
        }, 'notifications');
      } else if (responses.length === 0) {
        toastInfo(`New Support Ticket ${ticket.ticketId}`, {
          description: ticket.message,
          duration: 6000,
        }, 'notifications');
      }
    };

    on(`message:${adminId}`, handleIncomingMessage);
    on("ticket:update", handleTicketUpdate);

    return () => {
      off(`message:${adminId}`, handleIncomingMessage);
      off("ticket:update", handleTicketUpdate);
    };
  }, [on, off, socket, userData?.data?._id, dispatch]);

  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  // Global Authentication Protection
  useEffect(() => {
    if (!isUserLoading && (isUserError || !userData)) {
      router.push("/");
    }
  }, [userData, isUserLoading, isUserError, router]);

  // Route-level permission protection
  useEffect(() => {
    if (isLoading || !userPrivileges) return;

    const routeModuleMap: Record<string, ModuleId> = {
      "/orders": "orders",
      "/products": "products",
      "/customers": "customers",
      "/users": "users",
      "/roles": "roles",
      "/permissions": "permissions",
      "/categories": "categories",
      "/brands": "brands",
      "/transactions": "transactions",
      "/refunds": "refunds",
      "/support": "support",
      "/faq": "faq",
      "/notifications": "notifications",
      "/profile": "profile",
      "/deals": "deals",
      "/advert": "advert",
      "/reviews": "reviews",
      "/coupons": "marketing",
      "/gift-boxes": "gift-boxes",
      "/gift-cards": "gift-cards",
      "/logistics/drivers": "drivers",
      "/logistics/deliveries": "deliveries",
    };

    const matchingRoute = Object.keys(routeModuleMap).find(route =>
      pathname === route || pathname.startsWith(route + "/")
    );

    if (matchingRoute) {
      const moduleId = routeModuleMap[matchingRoute];
      if (!canAccess(moduleId, "view")) {
        toast.error("Access Denied", {
          description: `You do not have the required permissions to view the ${moduleId} module.`
        });
        router.push("/dashboard");
      }
    }
  }, [pathname, isLoading, userPrivileges, canAccess, router]);

  if (!isUserLoading && (isUserError || !userData)) {
    return null;
  }

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

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Root path "/" is the public Login page. Render clean without admin layout shell.
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <PrivilegeProvider>
        <SocketProvider>
          <AdminThemeProvider>
            <AdminLayoutContent>
              {children}
            </AdminLayoutContent>
          </AdminThemeProvider>
        </SocketProvider>
      </PrivilegeProvider>
    </UserProvider>
  );
}
