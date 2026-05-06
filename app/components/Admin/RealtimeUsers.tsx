"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { AdminChart } from "./AdminChart";
import { DropdownMenu, DropdownItem } from "../Dropdown/DropdownMenu";
import { HiArrowPath, HiPower, HiBell, HiClock, HiCheckCircle } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

interface RealtimeUsersProps {
  onViewInsight?: () => void;
}
import { useGetOrderStatsQuery } from "@/lib/redux/services/orderApi";
import { useSocket } from "@/app/context/SocketContext";



export const RealtimeUsers: React.FC<RealtimeUsersProps> = ({ onViewInsight }) => {
  const { data: statsResponse, isLoading, refetch } = useGetOrderStatsQuery();
  const totalOrders = statsResponse?.data?.totalOrders || 0;
  const { socket } = useSocket();



  // Socket listener for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      refetch();
    };

    socket.on("newOrder", handleUpdate);
    socket.on("orderStatusChanged", handleUpdate);
    socket.on("orderListUpdate", handleUpdate);

    return () => {
      socket.off("newOrder", handleUpdate);
      socket.off("orderStatusChanged", handleUpdate);
      socket.off("orderListUpdate", handleUpdate);
    };
  }, [socket, refetch]);

  // Generate semi-random live-looking data based on totalOrders
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    if (totalOrders > 0) {
      // Improved scaling for low volumes to ensure visibility
      const base = Math.max(2, totalOrders / 10);
      const data = Array.from({ length: 30 }, () =>
        Math.floor(base + Math.random() * (base * 0.8))
      );
      setChartData(data);
    } else {
      // Mock some activity for a "live" feel even if 0 real orders
      setChartData(Array.from({ length: 30 }, () => Math.floor(Math.random() * 5)));
    }
  }, [totalOrders]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 border border-[#1C1C1C1A] rounded-[6px] relative overflow-hidden group"
    >
      {/* Instrumentation Backdrop Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#1D3557 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

      {/* Subtle Glow Overlays */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-gold/5 border border-brand-gold/10 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold shadow-[0_0_8px_rgba(197,160,89,0.8)]"></span>
            </span>
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.1em]">Order Monitor</span>
          </div>

          <h3 className="text-5xl font-black text-[#1D3557] tracking-[-0.04em] mt-3 tabular-nums drop- ">
            {isLoading ? "..." : totalOrders.toLocaleString()}
          </h3>
          <p className="text-[11px] font-bold text-gray-400 mt-2 flex items-center gap-2 uppercase tracking-widest opacity-80">
            <span className="w-4 h-[1px] bg-gray-200"></span>
            Total Orders Placed
            <span className="w-4 h-[1px] bg-gray-200"></span>
          </p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className={`p-2 rounded-xl transition-all duration-300 ${isDropdownOpen ? "bg-[#1D3557] text-white shadow-lg" : "text-gray-400 hover:bg-gray-50 border border-transparent hover:border-gray-200"}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 z-50 origin-top-right"
              >
                <DropdownMenu width={220} className="shadow-2xl border border-gray-200 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/90">
                  <DropdownItem
                    label="Force Refresh"
                    subtext="Manual data pull"
                    icon={<HiArrowPath />}
                    onSelect={() => { setIsDropdownOpen(false); }}
                  />
                  <DropdownItem
                    label="Mute Live Feed"
                    subtext="Stop realtime updates"
                    icon={<HiPower />}
                    onSelect={() => { setIsDropdownOpen(false); }}
                  />
                  <DropdownItem
                    label="Alert Config"
                    subtext="Set user spike thresholds"
                    icon={<HiBell />}
                    onSelect={() => { setIsDropdownOpen(false); }}
                  />
                </DropdownMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative mt-4 group/chart">
        {/* Chart Monitor Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent rounded-2xl opacity-0 group-hover/chart:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="h-50 w-full relative flex items-center justify-center">
          <AdminChart
            type="doughnut"
            data={{
              labels: [],
              datasets: [{
                data: [
                  statsResponse?.data?.pendingOrders || 0,
                  statsResponse?.data?.processingOrders || 0,
                  statsResponse?.data?.completedOrders || 0
                ],
                backgroundColor: [
                  '#F59E0B', // Amber 500
                  '#3B82F6', // Blue 500
                  '#10B981'  // Emerald 500
                ],
                borderWidth: 0,
                hoverOffset: 15,
                cutout: '70%'
              }]
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context: any) => ` ${context.label}: ${context.raw} Orders`
                  }
                }
              }
            }}
          />
          {/* Central Stats Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Status</span>
            <span className="text-xl font-black text-[#1D3557]">{totalOrders}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 pt-6 mt-4 relative z-10">
        <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg border border-gray-200/50">
          <h4 className="text-[12px] font-black text-[#1D3557] uppercase tracking-widest pl-1">Order Status Distribution</h4>
          <span className="text-[10px] font-black text-brand-gold bg-white px-2 py-0.5 rounded border border-gray-200  ">LIVE</span>
        </div>

        {[
          { label: "Pending Orders", val: statsResponse?.data?.pendingOrders || 0, color: "text-amber-500", icon: <HiClock />, trend: "Attention", isUp: false },
          { label: "Processing", val: statsResponse?.data?.processingOrders || 0, color: "text-blue-500", icon: <HiArrowPath />, trend: "Active", isUp: true },
          { label: "Delivered", val: statsResponse?.data?.completedOrders || 0, color: "text-emerald-500", icon: <HiCheckCircle />, trend: "Completed", isUp: true },
        ].map((s, i) => {
          const percentage = totalOrders > 0 ? (s.val / totalOrders) * 100 : 0;
          return (
            <div key={s.label} className="flex flex-col gap-2">
              <div className="flex justify-between items-center group/row">
                <div className="flex items-center gap-3">
                  {/* Status Dot */}
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] animate-pulse`}
                    style={{ color: s.color.includes('amber') ? '#F59E0B' : s.color.includes('blue') ? '#3B82F6' : '#10B981' }} />

                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-[#1D3557] tracking-tight">{s.val.toLocaleString()}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] opacity-70">{s.label}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border   transition-all duration-300 ${s.isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  <span>{s.trend}</span>
                </div>
              </div>

              {/* Segmented Glowing Progress Bar */}
              <div className="h-2 w-full bg-gray-50/80 rounded-full overflow-hidden flex gap-0.5 p-[1px] border border-gray-200">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const isActive = (idx / 20) * 100 < percentage;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0.1 }}
                      transition={{ delay: 0.5 + (idx * 0.02) + (i * 0.1) }}
                      className={`h-full flex-1 rounded-[1px] ${isActive ? 'bg-gradient-to-b from-brand-gold/80 to-brand-gold shadow-[0_0_5px_rgba(197,160,89,0.3)]' : 'bg-gray-200'}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onViewInsight}
        className="group relative w-full h-[52px] mt-6 flex items-center justify-center transition-all duration-300 overflow-hidden rounded-[4px]"
      >
        {/* Glass Background */}
        <div className="absolute inset-0 bg-brand-gold group-hover:bg-amber-600 transition-colors" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] duration-1000" />

        <span className="relative z-10 text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          Deep Analysis
          <Icon name="arrow_forward" size="sm" className="group-hover:translate-x-1 transition-transform" />
        </span>

        {/* Outer Glow on hover */}
        <div className="absolute inset-x-4 inset-y-0 bg-brand-gold/20 blur-2xl group-hover:opacity-100 opacity-0 transition-opacity pointer-events-none" />
      </button>

      {/* Subtle border bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
    </motion.div>
  );
};
