import React from "react";
import { Icon } from "../Icon";
import Modal from "../Modal/Modal";

interface CustomerSideCardProps {
  customer: any;
  onClose: () => void;
}

export function CustomerSideCard({ customer, onClose }: CustomerSideCardProps) {
  if (!customer) return null;

  return (
    <Modal
      isOpen={!!customer}
      onClose={onClose}
      title="Customer Profile"
      size="md"
    >
      <div className="flex flex-col gap-8 py-4">
        <div className="flex flex-col items-start gap-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gold/10 bg-brand-gold/10">
                <img
                  src={customer.avatar || "https://ui-avatars.com/api/?name=" + customer.fullName + "&background=C5A028&color=fff"}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#121212]">{customer.fullName || customer.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">{customer.email}</span>
                  <button className="text-gray-300 hover:text-brand-gold transition-colors">
                    <Icon name="link-external" folder="dashboardIcon" size="sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Customer Info
          </span>
          <div className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-[6px]  ">
            <Icon name="ic_round-phone" folder="dashboardIcon" size="sm" className="text-gray-900" />
            <span className="text-sm font-semibold text-gray-700">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white border border-gray-50 rounded-[6px]  ">
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
                className="w-9 h-9 rounded-[6px] flex items-center justify-center border border-gray-50 hover:bg-gray-50 hover:border-brand-gold/20 transition-all text-[#121212]"
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
            <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1  ">
              <span className="text-lg font-bold text-[#121212]">150</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Total order</span>
            </div>
            <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1   border-brand-gold/10">
              <span className="text-lg font-bold text-brand-gold">140</span>
              <span className="text-[9px] font-bold text-brand-gold/60 uppercase text-center">
                Completed
              </span>
            </div>
            <div className="p-3 bg-white border border-gray-50 rounded-[6px] flex flex-col items-center gap-1   border-rose-50">
              <span className="text-lg font-bold text-rose-500">10</span>
              <span className="text-[9px] font-bold text-rose-500/60 uppercase">Canceled</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
