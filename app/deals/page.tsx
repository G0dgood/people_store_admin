"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/app/components/Button";
import { EmptyState } from "@/app/components/Admin/EmptyState";
import { UpdateDealsTimerModal } from "@/app/components/Admin/UpdateDealsTimerModal";
import { CreateOfferModal } from "@/app/components/Admin/CreateOfferModal";
import { Pagination } from "@/app/components/Admin/Pagination";
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

import {
  useGetDealsQuery,
  useGetTimerQuery,
  useUpdateTimerMutation,
  useDeleteOfferMutation,
  useGetDealStatsQuery
} from "@/lib/redux/services/dealApi";
import { useSocket } from "@/app/context/SocketContext";
import { toast } from "sonner";
import { SVGLoaderFetch } from "@/app/components/Options";
import { Tooltip } from "@/app/components/Tooltip";
import { HiArrowPath } from "react-icons/hi2";

export default function DealsPage() {
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<any>(null);
  const [offerToEdit, setOfferToEdit] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: timerResponse, isLoading: isLoadingTimer, refetch: refetchTimer, isFetching: isFetchingTimer } = useGetTimerQuery();
  const { data: dealsResponse, isLoading: isLoadingDeals, refetch: refetchDeals, isFetching: isFetchingDeals } = useGetDealsQuery({
    page: currentPage,
    limit: rowsPerPage
  });
  const { data: statsResponse, isLoading: isLoadingStats, refetch: refetchStats, isFetching: isFetchingStats } = useGetDealStatsQuery();
  const [updateTimer, { isLoading: isUpdatingTimer }] = useUpdateTimerMutation();
  const [deleteOffer, { isLoading: isDeletingOffer }] = useDeleteOfferMutation();
  const { on, off } = useSocket();


  const timerValues = timerResponse?.data?.timer || {
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isRunning: false
  };

  const isRunning = timerValues.isRunning;
  const offers = dealsResponse?.data?.deals || [];
  const pagination = dealsResponse?.data?.pagination;
  const dealStats = statsResponse?.data;

  // Real-time timer sync
  useEffect(() => {
    const handleTimerUpdate = () => {
      refetchTimer();
    };

    on("TIMER_UPDATED", handleTimerUpdate);
    return () => off("TIMER_UPDATED", handleTimerUpdate);
  }, [on, off, refetchTimer]);

  const endsAt = (timerValues as any).endsAt ? new Date((timerValues as any).endsAt).getTime() : null;

  // Remaining time anchored to wall-clock so the countdown continues across
  // refreshes/refetches instead of restarting from the configured duration.
  const computeRemaining = useCallback(() => {
    if (isRunning && endsAt) {
      return Math.max(0, Math.round((endsAt - Date.now()) / 1000));
    }
    return Math.max(0, (timerValues as any).remainingSeconds ?? 0);
  }, [isRunning, endsAt, (timerValues as any).remainingSeconds]);

  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    setTotalSeconds(computeRemaining());
  }, [computeRemaining]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTotalSeconds(computeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, computeRemaining]);

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

  const handleToggleTimer = async () => {
    try {
      await updateTimer({
        ...displayValues,
        isRunning: !isRunning
      }).unwrap();
      toast.success(isRunning ? "Timer paused" : "Timer resumed");
    } catch (error) {
      toast.error("Failed to update timer");
    }
  };

  const removeOffer = async (id: string) => {
    try {
      await deleteOffer(id).unwrap();
      toast.success("Offer removed");
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
    } catch (error) {
      toast.error("Failed to remove offer");
    }
  };

  const initialSelections = useMemo(() => {
    if (offerToEdit) {
      return { [offerToEdit.product?._id]: offerToEdit.discount };
    }
    return offers.reduce((acc: any, offer: any) => {
      if (offer.product?._id) acc[offer.product._id] = offer.discount;
      return acc;
    }, {});
  }, [offers, offerToEdit]);

  const stats = [
    {
      title: "Active Deals",
      value: isLoadingStats ? "..." : (dealStats?.activeDeals || 0).toString(),
      icon: <HiOutlineCube size={20} />,
      color: "blue"
    },
    {
      title: "Total Viewed",
      value: isLoadingStats ? "..." : (dealStats?.totalViewed || 0).toLocaleString(),
      icon: <HiOutlineUsers size={20} />,
      color: "emerald"
    },
    {
      title: "Conversion Rate",
      value: isLoadingStats ? "..." : (dealStats?.conversionRate || "0%"),
      icon: <HiOutlineRefresh size={20} />,
      color: "orange"
    },
    {
      title: "Offer Revenue",
      value: isLoadingStats ? "..." : "₦" + (dealStats?.offerRevenue || 0).toLocaleString(),
      icon: <HiOutlineCreditCard size={20} />,
      color: "rose"
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-[#1C1C1C1A] rounded-[6px]">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#121212]">Offer Countdown Management</h2>
          <p className="text-xs text-gray-400 font-bold">Configure the global countdown timer for your active deals.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-end items-center gap-3">
          <Tooltip text="Refresh Deals & Timer">
            <Button shape="rounded-sm" variant="outline"
              className="border-gray-200 text-gray-500 group h-10"
              iconLeft={<HiArrowPath size={16} className={`${(isFetchingTimer || isFetchingDeals || isFetchingStats) ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
              onClick={() => {
                refetchTimer();
                refetchDeals();
                refetchStats();
              }}
              disabled={isLoadingTimer || isFetchingTimer || isFetchingDeals || isFetchingStats}
            >
              {(isFetchingTimer || isFetchingDeals || isFetchingStats) ? "Refreshing..." : "Refresh"}
            </Button>
          </Tooltip>
          <Button shape="rounded-sm" variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-md shadow-brand-gold/10 h-10 px-6 text-[10px] font-black uppercase tracking-widest"
            iconLeft={<HiOutlinePlusCircle size={18} />}
            onClick={() => setIsTimerModalOpen(true)}
          >
            Update Global Timer
          </Button>
        </div>
      </div>

      {/* Timer Display Card */}
      <div className="w-full bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#1C1C1C1A] rounded-[6px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-gold/20 transition-colors" />

        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 flex items-center justify-center text-orange-500 border border-[#1C1C1C1A] rounded-[6px]">
              <RiTimerLine size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#121212]">Current Global Timer</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live on active storefront</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="max-w-xs text-xs text-gray-400 font-bold leading-relaxed">
              This timer is displayed in the "Deals and Offers" section. Once it hits zero, the section will auto-configure based on your store settings.
            </p>
            <div className="flex items-center gap-3">
              <Button shape="rounded-sm"
                variant={isRunning ? "secondary" : "primary"}
                size="sm"
                className="!py-1.5 !px-4 text-[10px] font-black uppercase tracking-widest border-none   transition-all duration-300 hover:bg-brand-gold hover:text-white"
                onClick={handleToggleTimer}
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
                ${!isRunning ? "border-rose-100 -[0.5]" : "border-gray-200"}
               `}
            >
              <span className={`text-xl md:text-2xl font-black transition-colors ${!isRunning ? "text-rose-400" : "text-[#121212]"}`}>{t.value}</span>
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
              ${stat.color === 'blue' ? 'bg-brand-gold/10 text-brand-gold' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
                  stat.color === 'orange' ? 'bg-orange-50 text-orange-500' :
                    'bg-rose-50 text-rose-500'}
            `}>
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#121212]">{stat.value}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Deals Table */}
      <div className="bg-white border border-[#1C1C1C1A] rounded-[6px] overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-[#121212] uppercase tracking-wider">Active Deals Feed</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time status of current promotions</span>
          </div>
          <Button shape="rounded-sm" variant="primary"
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold shadow-md shadow-brand-gold/10 h-10 px-6 text-[10px] font-black uppercase tracking-widest"
            iconLeft={<HiOutlinePlusCircle size={16} />}
            onClick={() => {
              setOfferToEdit(null);
              setIsOfferModalOpen(true);
            }}
          >
            Create New Offer
          </Button>
        </div>

        {isLoadingDeals ? (
          <div className="p-20 flex justify-center"><SVGLoaderFetch asTable={false} text="Loading deals..." /></div>
        ) : offers.length === 0 ? (
          <EmptyState
            title="No custom offers active"
            description="Global default deals are currently being displayed. You can add specific offer overrides here."
          />
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
                {offers.map((offer: any, idx: number) => {
                  const p = offer.product;
                  if (!p) return null;
                  const dealPrice = p.price - (p.price * offer.discount / 100);
                  return (
                    <tr key={idx} className="group hover:bg-brand-gold/5 transition-colors">
                      <td className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden bg-white p-1 shrink-0   group-hover:border-brand-gold/20 transition-colors">
                            <img src={p.productImage} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[#121212] group-hover:text-brand-gold transition-colors">{p.name}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-sm font-bold text-gray-400 line-through">₦{p.price.toLocaleString()}</span>
                      </td>
                      <td className="py-5">
                        <span className="px-3 py-1 bg-rose-50 text-rose-500 text-[10px] font-black rounded-full  ">
                          -{offer.discount}% OFF
                        </span>
                      </td>
                      <td className="py-5">
                        <span className="text-sm font-black text-emerald-500">₦{dealPrice.toLocaleString()}</span>
                      </td>
                      <td className="pr-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                            onClick={() => {
                              setOfferToEdit(offer);
                              setIsOfferModalOpen(true);
                            }}
                          >
                            <HiOutlinePencil className="w-4.5 h-4.5" />
                          </Button>
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
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
        <div className="border-t border-gray-50 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.pages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <UpdateDealsTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        initialValues={timerValues}
        isLoading={isUpdatingTimer}
        onUpdate={async (values) => {
          try {

            await updateTimer({ ...values, isRunning }).unwrap();
            toast.success("Global timer updated");
            setIsTimerModalOpen(false);
          } catch (error) {
            toast.error("Failed to update timer");
          }
        }}
      />

      <CreateOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setOfferToEdit(null);
        }}
        onSave={() => {
          setIsOfferModalOpen(false);
          setOfferToEdit(null);
        }}
        initialSelections={initialSelections}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOfferToDelete(null);
        }}
        onConfirm={() => {
          if (offerToDelete) removeOffer(offerToDelete._id);
        }}
        title="Remove Promotion"
        message={`Are you sure you want to end the promotion for "${offerToDelete?.product?.name || 'this product'}"? This product will revert to its original storefront price.`}
        confirmText="Yes, end promotion"
        type="danger"
        isLoading={isDeletingOffer}
      />
    </div>
  );
}
