"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { useGetAllDriversQuery } from "@/lib/redux/services/driverApi";
import { Avatar } from "../Other/Avatar";
import { StatusBadge } from "../StatusBadge";
import { Input } from "../Form/Inputs";
import { Icon } from "../Icon";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (driver: any) => void;
  currentlyAssignedId?: string;
}

const vehicleColors: Record<string, { bg: string; text: string; icon: string }> = {
  Motorcycle: { bg: "bg-amber-50", text: "text-amber-700", icon: "🏍️" },
  Car:        { bg: "bg-blue-50",  text: "text-blue-700",  icon: "🚗" },
  Van:        { bg: "bg-purple-50",text: "text-purple-700",icon: "🚐" },
  Bicycle:    { bg: "bg-emerald-50",text: "text-emerald-700",icon: "🚲" },
};

export function AssignDriverModal({
  isOpen,
  onClose,
  onAssign,
  currentlyAssignedId,
}: AssignDriverModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, refetch } = useGetAllDriversQuery({
    limit: 100,
    search: searchQuery,
  });

  const allDrivers = data?.data?.drivers || [];
  // Filter active drivers
  const activeDrivers = allDrivers.filter((driver) => driver.status === "active");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Driver" size="md">
      <div className="flex flex-col gap-6 h-full pb-2">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Search & Select Driver
          </p>
          <Input
            shape="rounded-sm"
            type="text"
            placeholder="Search driver name or vehicle type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium focus:ring-brand-gold/20 focus:border-brand-gold"
            suffixElement={
              <Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />
            }
          />
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-[300px] max-h-[450px] pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
              <BiLoaderAlt className="animate-spin" size={24} />
              <span className="text-xs font-bold tracking-widest uppercase">Loading Drivers...</span>
            </div>
          ) : activeDrivers.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl flex flex-col gap-2">
              <span className="text-2xl">🔍</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                No active drivers found
              </span>
            </div>
          ) : (
            activeDrivers.map((driver) => {
              const vehicle = vehicleColors[driver.vehicleType] || {
                bg: "bg-gray-50",
                text: "text-gray-600",
                icon: "🚘",
              };
              const isCurrentlyAssigned = driver._id === currentlyAssignedId;

              return (
                <div
                  key={driver._id}
                  onClick={() => {
                    onAssign(driver);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer group hover:shadow-md hover:border-brand-gold/30
                    ${
                      isCurrentlyAssigned
                        ? "bg-brand-gold/5 border-brand-gold"
                        : "bg-white border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={
                        driver.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          driver.fullName
                        )}&background=C5A028&color=fff`
                      }
                      name={driver.fullName}
                      size="md"
                      className="group-hover:scale-105 transition-transform duration-300 border border-gray-100 shadow-sm"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-[#121212] group-hover:text-brand-gold transition-colors">
                        {driver.fullName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border ${vehicle.bg} ${vehicle.text}`}
                        >
                          <span>{vehicle.icon}</span>
                          {driver.vehicleType}
                        </span>
                        <StatusBadge
                          module="driverAvailability"
                          value={driver.isAvailable ? "available" : "unavailable"}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    {isCurrentlyAssigned && (
                      <span className="text-[9px] font-black uppercase text-brand-gold tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                        Assigned
                      </span>
                    )}
                    {driver.currentLocation &&
                      (driver.currentLocation.latitude !== 0 ||
                        driver.currentLocation.longitude !== 0) && (
                        <div className="flex items-center gap-0.5 text-gray-400 group-hover:text-brand-gold transition-colors">
                          <HiOutlineLocationMarker size={10} />
                          <span className="text-[8px] font-bold uppercase tracking-wider">
                            Has GPS
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => refetch()}
            className="text-[10px] font-black uppercase text-gray-400 hover:text-brand-gold transition-colors tracking-widest flex items-center gap-1"
          >
            <span>🔄</span> Refresh Directory
          </button>
        </div>
      </div>
    </Modal>
  );
}
