"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/Button";
import { UpdateDealsTimerModal } from "../../components/Admin/UpdateDealsTimerModal";
import { CreateOfferModal } from "../../components/Admin/CreateOfferModal";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import {
  HiOutlinePlusCircle,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineTrash,
  HiOutlinePencil
} from "react-icons/hi2";
import { RiTimerLine } from "react-icons/ri";
import { HiOutlineRefresh } from "react-icons/hi";

export default function DealsPage() {
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<any>(null);
  const [offerToEdit, setOfferToEdit] = useState<any>(null);
  const [timerValues, setTimerValues] = useState({
    days: "04",
    hours: "13",
    minutes: "34",
    seconds: "56",
  });
  const [isRunning, setIsRunning] = useState(true);

  // Convert initial values to total seconds
  const initialTotalSeconds = useMemo(() => {
    return (
      parseInt(timerValues.days) * 86400 +
      parseInt(timerValues.hours) * 3600 +
      parseInt(timerValues.minutes) * 60 +
      parseInt(timerValues.seconds)
    );
  }, [timerValues]);

  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);

  // Update totalSeconds if modal manually updates timerValues
  useEffect(() => {
    setTotalSeconds(initialTotalSeconds);
  }, [initialTotalSeconds]);

  // Countdown Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  // Derived display values
  const displayValues = useMemo(() => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return {
      days: d.toString().padStart(2, "0"),
      hours: h.toString().padStart(2, "0"),
      minutes: m.toString().padStart(2, "0"),
      seconds: s.toString().padStart(2, "0"),
    };
  }, [totalSeconds]);

  const [offers, setOffers] = useState<any[]>([]);

  const stats = [
    { title: "Active Deals", value: offers.length.toString(), icon: <HiOutlineCube size={20} />, color: "blue" },
    { title: "Total Viewed", value: "1.2k", icon: <HiOutlineUsers size={20} />, color: "emerald" },
    { title: "Conversion Rate", value: "8.5%", icon: <HiOutlineRefresh size={20} />, color: "orange" },
    { title: "Offer Revenue", value: "₦4.5M", icon: <HiOutlineCreditCard size={20} />, color: "rose" },
  ];

  const handleSaveOffers = (newDeals: any[]) => {
    setOffers(prev => {
      const next = [...prev];
      newDeals.forEach(deal => {
        const index = next.findIndex(o => o.id === deal.id);
        if (index !== -1) {
          next[index] = deal;
        } else {
          next.push(deal);
        }
      });
      return next;
    });
    setOfferToEdit(null);
  };

  const removeOffer = (id: number) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    setIsDeleteModalOpen(false);
    setOfferToDelete(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-[#1C1C1C1A] rounded-[6px]">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#1D3557]">Offer Countdown Management</h2>
          <p className="text-xs text-gray-400 font-bold">Configure the global countdown timer for your active deals.</p>
        </div>
        <Button
          variant="primary"
          shape="rounded-sm"
          iconLeft={<HiOutlinePlusCircle size={18} />}
          onClick={() => setIsTimerModalOpen(true)}
        >
          Update Global Timer
        </Button>
      </div>

      {/* Timer Display Card */}
      <div className="w-full bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#1C1C1C1A] rounded-[6px] relative overflow-hidden group">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue-light/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-blue-light/40 transition-colors" />

        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 flex items-center justify-center text-orange-500 border border-[#1C1C1C1A] rounded-[6px]">
              <RiTimerLine size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#1D3557]">Current Global Timer</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live on active storefront</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="max-w-xs text-xs text-gray-400 font-bold leading-relaxed">
              This timer is displayed in the "Deals and Offers" section. Once it hits zero, the section will auto-configure based on your store settings.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant={isRunning ? "secondary" : "primary"}
                size="sm"
                className="!py-1.5 !px-4 text-[10px] font-black uppercase tracking-widest border-none shadow-sm"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? "Pause Countdown" : "Resume Countdown"}
              </Button>
              {!isRunning && (
                <span className="text-[10px] font-black text-rose-500 uppercase animate-pulse">Paused</span>
              )}
            </div>
          </div>
        </div>

        <div className={`flex gap-4 relative z-10 transition-opacity duration-300 ${!isRunning ? "opacity-60" : "opacity-100"}`}>
          {[
            { value: displayValues.days, label: "Days" },
            { value: displayValues.hours, label: "Hour" },
            { value: displayValues.minutes, label: "Min" },
            { value: displayValues.seconds, label: "Sec" }
          ].map((t, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#F7F7F7] rounded-2xl border transition-all duration-300
                ${!isRunning ? "border-rose-100 grayscale-[0.5]" : "border-gray-200"}
              shadow-sm`}
            >
              <span className={`text-xl md:text-2xl font-black transition-colors ${!isRunning ? "text-rose-400" : "text-[#1D3557]"}`}>{t.value}</span>
              <span className="text-[10px] md:text-[11px] text-gray-400 font-black uppercase tracking-tighter opacity-60">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1C1C1C1A] rounded-[6px] flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center
              ${stat.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
                  stat.color === 'orange' ? 'bg-orange-50 text-orange-500' :
                    'bg-rose-50 text-rose-500'}
            `}>
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#1D3557]">{stat.value}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Deals Table */}
      <div className="bg-white border border-[#1C1C1C1A] rounded-[6px] overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-[#1D3557] uppercase tracking-wider">Active Deals Feed</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time status of current promotions</span>
          </div>
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<HiOutlinePlusCircle size={16} />}
            onClick={() => setIsOfferModalOpen(true)}
          >
            Create New Offer
          </Button>
        </div>

        {offers.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/50">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-gray-200 shadow-inner">
              <HiOutlineCube size={36} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-black text-[#1D3557]">No custom offers active</span>
              <span className="text-xs text-gray-400 font-bold max-w-xs">Global default deals are currently being displayed. You can add specific offer overrides here.</span>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsOfferModalOpen(true)}
            >
              Create Your First Offer
            </Button>
          </div>
        ) : (
          <div className="admin-table-container">
            <table>
              <thead>
                <tr className="bg-gray-50/50">
                  <th>Product</th>
                  <th>Original Price</th>
                  <th>Discount</th>
                  <th>Deal Price</th>
                  <th className=" text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {offers.map((offer, idx) => {
                  const dealPrice = offer.price - (offer.price * offer.discount / 100);
                  return (
                    <tr key={idx} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden bg-white p-1 shrink-0 shadow-sm group-hover:border-brand-blue/30 transition-colors">
                            <img src={offer.image} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[#1D3557] group-hover:text-brand-blue transition-colors">{offer.name}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{offer.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-sm font-bold text-gray-400 line-through">₦{offer.price.toLocaleString()}</span>
                      </td>
                      <td className="py-5">
                        <span className="px-3 py-1 bg-rose-50 text-rose-500 text-[10px] font-black rounded-full shadow-sm">
                          -{offer.discount}% OFF
                        </span>
                      </td>
                      <td className="py-5">
                        <span className="text-sm font-black text-emerald-500">₦{dealPrice.toLocaleString()}</span>
                      </td>
                      <td className="pr-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="!p-1.5 text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
                            onClick={() => {
                              setOfferToEdit(offer);
                              setIsOfferModalOpen(true);
                            }}
                          >
                            <HiOutlinePencil className="w-4.5 h-4.5" />
                          </Button>
                          <Button
                            variant="outline"
                            shape="rounded-sm"
                            className="!p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={() => {
                              setOfferToDelete(offer);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <HiOutlineTrash className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UpdateDealsTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        initialValues={timerValues}
        onUpdate={(values) => {
          setTimerValues(values);
        }}
      />

      <CreateOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setOfferToEdit(null);
        }}
        onSave={handleSaveOffers}
        initialSelections={offerToEdit ? { [offerToEdit.id]: offerToEdit.discount } : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOfferToDelete(null);
        }}
        onConfirm={() => {
          if (offerToDelete) removeOffer(offerToDelete.id);
        }}
        title="Remove Promotion"
        message={`Are you sure you want to end the promotion for "${offerToDelete?.name}"? This product will revert to its original storefront price.`}
        confirmText="Yes, end promotion"
        type="danger"
      />
    </div>
  );
}
