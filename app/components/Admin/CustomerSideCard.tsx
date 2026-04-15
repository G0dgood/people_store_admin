"use client";

import React from "react";
import { Icon } from "../Icon";
import { motion } from "framer-motion";

interface CustomerSideCardProps {
  customer: any;
  onClose: () => void;
}

export function CustomerSideCard({ customer, onClose }: CustomerSideCardProps) {
  if (!customer) return null;

  return (
    <motion.div
      key="details-sidebar"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full lg:w-[380px] bg-white rounded-[6px] border border-gray-100 shadow-xl p-6 flex flex-col gap-8 sticky top-6 z-10"
    >
      <div className="flex flex-col items-start gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-blue-light bg-brand-blue-light">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#1D3557]">{customer.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">{customer.email}</span>
                <button className="text-gray-300 hover:text-brand-blue transition-colors">
                  <Icon name="link-external" folder="dashboardIcon" size="sm" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-[6px] transition-all"
          >
            <Icon name="menu-close" folder="dashboardIcon" size="sm" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Customer Info
        </span>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-[6px] shadow-sm">
          <Icon name="ic_round-phone" folder="dashboardIcon" size="sm" className="text-gray-900" />
          <span className="text-sm font-semibold text-gray-700">{customer.phone}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-[6px] shadow-sm">
          <Icon name="mdi_location (1)" folder="dashboardIcon" size="sm" className="text-gray-900" />
          <span className="text-sm font-semibold text-gray-700">{customer.address}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Social Media
        </span>
        <div className="flex items-center gap-3">
          {["facebook", "whatsapp", "x", "linkedin", "instagram"].map((social) => (
            <button
              key={social}
              className="w-9 h-9 rounded-[6px] flex items-center justify-center border border-gray-50 hover:bg-gray-50 hover:border-blue-100 transition-all text-[#1D3557]"
            >
              <Icon name={social} folder="dashboardIcon" size="sm" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Activity
        </span>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline p-2.5 bg-gray-50/30 rounded-[6px]">
            <span className="text-xs font-medium text-gray-400">Registration:</span>
            <span className="text-xs font-bold text-gray-700">{customer.registration}</span>
          </div>
          <div className="flex justify-between items-baseline p-2.5 bg-gray-50/30 rounded-[6px]">
            <span className="text-xs font-medium text-gray-400">Last purchase:</span>
            <span className="text-xs font-bold text-gray-700">{customer.lastPurchase}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Order overview
        </span>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1 shadow-sm">
            <span className="text-lg font-bold text-[#1D3557]">150</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase">Total order</span>
          </div>
          <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1 shadow-sm border-brand-blue-light">
            <span className="text-lg font-bold text-blue-500">140</span>
            <span className="text-[9px] font-bold text-blue-500/60 uppercase text-center">
              Completed
            </span>
          </div>
          <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1 shadow-sm border-rose-50">
            <span className="text-lg font-bold text-rose-500">10</span>
            <span className="text-[9px] font-bold text-rose-500/60 uppercase">Canceled</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
