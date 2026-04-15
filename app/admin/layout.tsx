"use client";

import React from "react";
import { AdminSidebar } from "../components/Admin/AdminSidebar";
import { AdminHeader } from "../components/Admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="page-wrapper">
      <AdminSidebar />
      <AdminHeader />
      <main>
        {children}
      </main>
    </div>
  );
}
