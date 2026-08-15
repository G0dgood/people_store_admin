"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Tooltip } from "@/app/components/Tooltip";
import { HiShieldCheck, HiUsers, HiArrowPath, HiLockClosed, HiKey } from "react-icons/hi2";
import { motion } from "framer-motion";
import Link from "next/link";
import { useGetUsersQuery } from "@/lib/redux/services/authApi";
import { useGetRolesQuery } from "@/lib/redux/services/roleApi";

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery({ page: 1, limit: 100 });
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();

  const totalStaff = usersData?.users?.length || 0;
  const activeRoles = rolesData?.roles?.length || 0;
  const superAdmins = usersData?.users?.filter((u: any) => u.role === "SUPER_ADMIN" || u.role === "Super Admin").length || 0;

  const stats = [
    { label: "Total Administrative Staff", value: totalStaff, icon: <HiUsers size={20} />, color: "text-brand-gold", bg: "bg-brand-gold/10" },
    { label: "Active Governance Roles", value: activeRoles, icon: <HiShieldCheck size={20} />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Privileged Super Admins", value: superAdmins, icon: <HiLockClosed size={20} />, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12">
      {/* Header & Stats Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-[#121212] tracking-tight">Governance & Roles</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Access & Security Policy Management</p>
          </div>
          <div className="flex gap-3">
            <Link href="/users">
              <Button shape="rounded-sm" variant="outline" iconLeft={<HiUsers size={16} />}>
                Staff Management
              </Button>
            </Link>
            <Link href="/roles">
              <Button shape="rounded-sm" variant="primary" iconLeft={<HiShieldCheck size={16} />}>
                Role Matrix
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-white p-6 rounded-[8px] border border-gray-100   hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[6px] ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#121212]">{stat.value}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50 bg-gray-50/30">
          <TabFilter
            tabs={["Overview", "Access Audit", "Recent Policy Changes"]}
            activeTab={activeTab}
            onChange={setActiveTab}
            id="gov-tabs"
          />
          <Tooltip text="Refresh Governance Data">
            <Button shape="rounded-sm" variant="outline" className="!p-2.5 text-gray-400 hover:text-brand-gold border-gray-200">
              <HiArrowPath size={16} />
            </Button>
          </Tooltip>
        </div>

        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-brand-gold/5 flex items-center justify-center text-brand-gold animate-pulse">
            <HiKey size={40} />
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <h3 className="text-lg font-black text-[#121212]">Administrative Security Console</h3>
            <p className="text-sm font-medium text-gray-400 leading-relaxed">
              This hub provides high-level oversight of your administrative structure. Use the links above to manage individual staff accounts or fine-tune global role permissions.
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <Link href="/roles">
              <Button shape="rounded-sm" variant="outline" className="px-8 border-gray-200 font-black">
                Manage Roles
              </Button>
            </Link>
            <Link href="/users">
              <Button shape="rounded-sm" variant="primary" className="px-8 font-black">
                Review Staff
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
