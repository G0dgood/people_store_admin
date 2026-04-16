"use client";

import React from "react";
import { AdminSidebar } from "../components/Admin/AdminSidebar";
import { AdminHeader } from "../components/Admin/AdminHeader";
import { UserProvider } from "../context/UserContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div id="page-wrapper">
        <AdminSidebar />
        <AdminHeader />
        <main>
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
