import React from "react";
import { Icon } from "../Icon";

interface StatProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatProps> = ({ label, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-default group">
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
      <Icon name={icon} size="md" />
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  </div>
);

export const ProfileStats: React.FC = () => {
  const stats = [
    { label: "Total Orders", value: 12, icon: "favorite", color: "bg-blue-500" },
    { label: "Pending Shipments", value: 3, icon: "send", color: "bg-orange-500" },
    { label: "Reward Points", value: "2.4k", icon: "security", color: "bg-blue-500" },
    { label: "Messages", value: 2, icon: "message_header", color: "bg-brand-gold" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};
