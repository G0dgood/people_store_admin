"use client";

import React from "react";
import moment from "moment";
import { FiExternalLink, FiPhone, FiMail, FiTruck } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import { BiLoaderAlt } from "react-icons/bi";
import Drawer from "../Drawer/Drawer";
import { Button } from "../Button";
import { Avatar } from "../Other/Avatar";
import { StatusBadge } from "../StatusBadge";
import { ConfirmationModal } from "./ConfirmationModal";
import { Icon } from "../Icon";
import { toast } from "sonner";
import { useToggleDriverStatusMutation, useDeleteDriverMutation } from "@/lib/redux/services/driverApi";

interface DriverDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  driver: any;
}

const vehicleColors: Record<string, { bg: string; text: string; icon: string }> = {
  Motorcycle: { bg: "bg-amber-50", text: "text-amber-700", icon: "🏍️" },
  Car:        { bg: "bg-blue-50",  text: "text-blue-700",  icon: "🚗" },
  Van:        { bg: "bg-purple-50",text: "text-purple-700",icon: "🚐" },
  Bicycle:    { bg: "bg-emerald-50",text: "text-emerald-700",icon: "🚲" },
};

const InfoCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-200 flex flex-col gap-1">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-[#121212]">{value || "—"}</span>
  </div>
);

export function DriverDetailDrawer({ isOpen, onClose, driver }: DriverDetailDrawerProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);

  const [toggleDriverStatus, { isLoading: isToggling }] = useToggleDriverStatusMutation();
  const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

  if (!driver) return null;

  const vehicle = vehicleColors[driver.vehicleType] || { bg: "bg-gray-50", text: "text-gray-600", icon: "🚘" };
  const isActive = driver.status === "active";
  const newStatus = isActive ? "deactivated" : "active";

  const openMaps = () => {
    const { latitude, longitude } = driver.currentLocation || {};
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank");
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleDriverStatus({ driverId: driver._id, status: newStatus }).unwrap();
      toast.success("Status Updated", {
        description: `${driver.fullName} has been set to ${newStatus}.`,
      });
      setIsStatusModalOpen(false);
      onClose();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.data?.message || "Could not update status." });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDriver(driver._id).unwrap();
      toast.success("Driver Removed", {
        description: `${driver.fullName} has been removed from the logistics directory.`,
      });
      setIsDeleteModalOpen(false);
      onClose();
    } catch (err: any) {
      toast.error("Action Failed", { description: err.data?.message || "Could not remove driver." });
    }
  };

  const hasLocation =
    driver.currentLocation &&
    (driver.currentLocation.latitude !== 0 || driver.currentLocation.longitude !== 0);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Driver Profile">
      <div className="flex flex-col gap-8 pb-12">

        {/* ── Profile Header ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-20 bg-[#121212] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500" />

          <Avatar
            src={driver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.fullName)}&background=C5A028&color=fff`}
            name={driver.fullName}
            size="xl"
            className="border-4 border-white shadow-xl relative z-10 -mt-2 group-hover:scale-105 transition-transform duration-500"
          />

          <div className="flex flex-col gap-1 relative z-10">
            <h3 className="text-xl font-black text-[#121212] tracking-tight">{driver.fullName}</h3>
            <p className="text-xs font-bold text-gray-400 truncate max-w-[220px]">{driver.email}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 relative z-10">
            {/* Vehicle badge */}
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest border ${vehicle.bg} ${vehicle.text}`}>
              <span>{vehicle.icon}</span>
              {driver.vehicleType || "Unknown"}
            </span>
            {/* Status badge */}
            <StatusBadge module="driver" value={driver.status} />
            {/* Availability badge */}
            <StatusBadge module="driverAvailability" value={driver.isAvailable ? "available" : "unavailable"} />
          </div>
        </div>

        {/* ── Contact Info ── */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Contact Information</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <FiMail size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                <span className="text-xs font-bold text-[#121212]">{driver.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <FiPhone size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</span>
                <span className="text-xs font-bold text-[#121212]">{driver.phoneNumber || "Not provided"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Vehicle Details ── */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Vehicle Details</h4>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Vehicle Type" value={driver.vehicleType} />
            <InfoCard label="Plate Number" value={driver.vehicleNumber || "Not set"} />
          </div>
        </div>

        {/* ── Account Info ── */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Account Details</h4>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              label="Driver ID"
              value={`DRV-${driver._id?.toString().substr(-5).toUpperCase()}`}
            />
            <InfoCard
              label="Joined"
              value={driver.createdAt ? moment(driver.createdAt).format("MMM DD, YYYY") : "—"}
            />
            <InfoCard
              label="Last Updated"
              value={driver.updatedAt ? moment(driver.updatedAt).fromNow() : "—"}
            />
            <InfoCard
              label="Availability"
              value={driver.isAvailable ? "🟢 Available" : "🔴 Unavailable"}
            />
          </div>
        </div>

        {/* ── GPS Location ── */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">GPS Location</h4>
          {hasLocation ? (
            <button
              onClick={openMaps}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-brand-gold/30 hover:shadow-md transition-all group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0 group-hover:scale-110 transition-transform">
                <HiOutlineLocationMarker size={16} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coordinates</span>
                <span className="text-xs font-bold text-[#121212] truncate">
                  {driver.currentLocation.latitude.toFixed(6)}, {driver.currentLocation.longitude.toFixed(6)}
                </span>
              </div>
              <FiExternalLink size={12} className="text-brand-gold shrink-0" />
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-50/50 border border-gray-200 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                <HiOutlineLocationMarker size={16} />
              </div>
              <span className="text-xs font-bold text-gray-400 italic">No GPS coordinates available</span>
            </div>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="mt-auto flex flex-col gap-3 pt-4 no-invert">
          <div className="flex gap-3">
            <Button
              shape="rounded-sm"
              variant="outline"
              className={`flex-1 font-black text-xs h-12 uppercase tracking-widest transition-all duration-300
                ${isActive
                  ? "text-amber-500 border-amber-100 bg-amber-50/30 hover:bg-amber-100"
                  : "text-emerald-500 border-emerald-100 bg-emerald-50/30 hover:bg-emerald-100"}`}
              disabled={isToggling}
              onClick={() => setIsStatusModalOpen(true)}
              iconLeft={
                isToggling
                  ? <BiLoaderAlt className="animate-spin" size={14} />
                  : isActive
                    ? <HiLockClosed size={14} />
                    : <HiLockOpen size={14} />
              }
            >
              {isToggling ? "Updating..." : isActive ? "Deactivate Driver" : "Reactivate Driver"}
            </Button>
            <Button
              shape="rounded-sm"
              variant="outline"
              className="flex-1 font-black text-xs h-12 uppercase tracking-widest text-rose-500 border-rose-100 bg-rose-50/30 hover:bg-rose-100"
              disabled={isDeleting}
              onClick={() => setIsDeleteModalOpen(true)}
              iconLeft={isDeleting && <BiLoaderAlt className="animate-spin" size={14} />}
            >
              {isDeleting ? "Removing..." : "Delete Driver"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Status Confirmation ── */}
      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={isActive ? "Deactivate Driver" : "Reactivate Driver"}
        message={`Are you sure you want to ${isActive ? "deactivate" : "reactivate"} ${driver.fullName}? ${
          isActive
            ? "They will no longer be able to log in to the delivery app."
            : "They will regain access to the delivery app."
        }`}
        confirmText={isToggling ? "Updating..." : isActive ? "Yes, Deactivate" : "Yes, Reactivate"}
        type={isActive ? "danger" : "success"}
      />

      {/* ── Delete Confirmation ── */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Driver Account"
        message={`Are you sure you want to permanently delete ${driver.fullName} from the logistics directory? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete Driver"}
        type="danger"
      />
    </Drawer>
  );
}
