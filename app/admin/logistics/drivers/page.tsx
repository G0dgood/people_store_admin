"use client";

import React, { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import Dropdown from "../../../components/Form/Dropdown";
import { StatusBadge } from "../../../components/StatusBadge";
import { ListingSearch } from "../../../components/ui/ListingSearch";
import { TabFilter } from "../../../components/Admin/TabFilter";
import { Pagination } from "../../../components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { motion } from "framer-motion";
import { HiArrowPath } from "react-icons/hi2";
import { FiExternalLink } from "react-icons/fi";
import { useGetAllDriversQuery, useToggleDriverStatusMutation, useDeleteDriverMutation } from "@/lib/redux/services/driverApi";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { toast } from "sonner";
import { usePrivilege } from "@/lib/contexts/PrivilegeContext";
import { Tooltip } from "@/app/components/Tooltip";

const vehicleColors: Record<string, string> = {
 Motorcycle: "text-amber-700 bg-amber-50 border border-amber-100",
 Car: "text-blue-700 bg-blue-50 border border-blue-100",
 Van: "text-purple-700 bg-purple-50 border border-purple-100",
 Bicycle: "text-emerald-700 bg-emerald-50 border border-emerald-100",
};

const statusOptions = [
 { value: "All", label: "All Statuses" },
 { value: "Active", label: "Active" },
 { value: "Deactivated", label: "Deactivated" },
];

const availabilityOptions = [
 { value: "All", label: "All Availabilities" },
 { value: "Available", label: "Available" },
 { value: "Unavailable", label: "Unavailable" },
];

export default function DriversManagement() {
 const [activeTab, setActiveTab] = useState("All Drivers");
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("All");
 const [availabilityFilter, setAvailabilityFilter] = useState("All");

 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [driverToDelete, setDriverToDelete] = useState<any>(null);
 const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
 const [driverToToggle, setDriverToToggle] = useState<any>(null);

 const { canAccess } = usePrivilege();

 // Build API params
 const apiParams: any = {
  page: currentPage,
  limit: rowsPerPage,
  search: searchQuery,
 };

 if (activeTab !== "All Drivers") {
  apiParams.vehicleType = activeTab;
 }
 if (statusFilter !== "All") {
  apiParams.status = statusFilter.toLowerCase();
 }
 if (availabilityFilter !== "All") {
  apiParams.isAvailable = availabilityFilter === "Available" ? "true" : "false";
 }

 // Fetch from backend
 const { data, isLoading, refetch, isFetching } = useGetAllDriversQuery(apiParams);

 const drivers = data?.data?.drivers || [];
 const pagination = data?.data?.pagination || { totalPages: 1, totalDrivers: 0 };

 const [toggleDriverStatus, { isLoading: isToggling }] = useToggleDriverStatusMutation();
 const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation();

 const toggleAll = () => {
  if (selectedIds.length === drivers.length) {
   setSelectedIds([]);
  } else {
   setSelectedIds(drivers.map((d: any) => d._id));
  }
 };

 const toggleItem = (id: string) => {
  setSelectedIds(prev =>
   prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
 };

 const handleDeleteDriver = async () => {
  if (!driverToDelete?._id) return;

  try {
   await deleteDriver(driverToDelete._id).unwrap();
   toast.success("Driver Removed", {
    description: `Successfully removed driver ${driverToDelete.fullName} from the logistics directory.`
   });
   setIsDeleteModalOpen(false);
   setDriverToDelete(null);
  } catch (err: any) {
   toast.error("Action Failed", {
    description: err.data?.message || "Failed to remove the driver."
   });
  }
 };

 const handleToggleStatus = async () => {
  if (!driverToToggle?._id) return;
  const newStatus = driverToToggle.status === "active" ? "deactivated" : "active";

  try {
   await toggleDriverStatus({ driverId: driverToToggle._id, status: newStatus }).unwrap();
   toast.success("Driver Status Updated", {
    description: `Successfully set ${driverToToggle.fullName} to ${newStatus}.`
   });
   setIsStatusModalOpen(false);
   setDriverToToggle(null);
  } catch (err: any) {
   toast.error("Action Failed", {
    description: err.data?.message || "Failed to update driver status."
   });
  }
 };

 const handleRowsPerPageChange = (newLimit: number) => {
  setRowsPerPage(newLimit);
  setCurrentPage(1);
 };

 const getVehicleStyle = (vehicle: string) => {
  return vehicleColors[vehicle] || "text-gray-500 bg-gray-50 border border-gray-100";
 };

 const openGoogleMaps = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(url, "_blank");
 };

 return (
  <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
   {/* Top action header */}
   <div className="flex justify-end gap-3 w-full sm:w-auto">
    <Tooltip text="Refresh Drivers Directory">
     <Button
      shape="rounded-sm"
      variant="outline"
      className="border-gray-200 text-gray-500 group"
      iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
      onClick={() => refetch()}
      disabled={isLoading || isFetching}
     >
      {isFetching ? "Refreshing..." : "Refresh List"}
     </Button>
    </Tooltip>
   </div>

   <div className="bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col min-h-[600px]">
    {/* Filter controls panel */}
    <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
     <TabFilter
      tabs={["All Drivers", "Motorcycle", "Car", "Van", "Bicycle"]}
      activeTab={activeTab}
      onChange={(tab) => {
       setActiveTab(tab);
       setCurrentPage(1);
      }}
      id={"drivers-filter"}
     />

     <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
      {/* Search Input */}
      <ListingSearch
       placeholder="Search name, email, or vehicle number..."
       value={searchQuery}
       onChange={(val) => {
        setSearchQuery(val);
        setCurrentPage(1);
       }}
       className="flex-1 xl:w-80"
      />

      {/* Status Dropdown */}
      <Dropdown
       value={statusFilter}
       onChange={(value) => {
        setStatusFilter(value);
        setCurrentPage(1);
       }}
       options={statusOptions}
       variant="minimal"
       className="w-40"
      />

      {/* Availability Dropdown */}
      <Dropdown
       value={availabilityFilter}
       onChange={(value) => {
        setAvailabilityFilter(value);
        setCurrentPage(1);
       }}
       options={availabilityOptions}
       variant="minimal"
       className="w-44"
      />

      <RowsPerPage value={rowsPerPage} onChange={handleRowsPerPageChange} />
     </div>
    </div>

    {/* Drivers Table */}
    <div className="admin-table-container flex-1">
     <table className="w-full">
      <thead>
       <tr>
        <th className="w-10 pl-6">
         <Checkbox
          checked={selectedIds.length === drivers.length && drivers.length > 0}
          onChange={toggleAll}
         />
        </th>
        <th>Driver Profile</th>
        <th>Vehicle Info</th>
        <th>Availability</th>
        <th>Location Details</th>
        <th>Status</th>
        <th className="text-right pr-6">Actions</th>
       </tr>
      </thead>
      <tbody>
       {isLoading ? (
        <SVGLoaderFetch colSpan={7} text={"Connecting to logistics directory..."} />
       ) : drivers.length === 0 ? (
        <NoRecordFound colSpan={7} />
       ) : (
        drivers.map((driver: any) => (
         <tr key={driver._id} className="group">
          <td className="w-10 pl-6">
           <Checkbox
            checked={selectedIds.includes(driver._id)}
            onChange={() => toggleItem(driver._id)}
           />
          </td>
          <td>
           <div className="flex items-center gap-4 py-2">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
             <img
              src={driver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.fullName)}&background=C5A028&color=fff`}
              alt={driver.fullName}
              className="w-full h-full object-cover"
             />
            </div>
            <div className="flex flex-col min-w-0">
             <span className="text-sm font-black text-[#121212] group-hover:text-brand-gold transition-colors truncate">{driver.fullName}</span>
             <span className="text-[10px] font-medium text-gray-400 truncate tracking-tight">{driver.email}</span>
             <span className="text-[9px] font-bold text-gray-400 truncate">{driver.phoneNumber || "No Phone Number"}</span>
            </div>
           </div>
          </td>
          <td>
           <div className="flex flex-col gap-1 items-start">
            <span className={`px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider ${getVehicleStyle(driver.vehicleType)}`}>
             {driver.vehicleType}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{driver.vehicleNumber || "No Plate Number"}</span>
           </div>
          </td>
          <td>
           <StatusBadge module="driverAvailability" value={driver.isAvailable ? "available" : "unavailable"} />
          </td>
          <td>
           {driver.currentLocation && (driver.currentLocation.latitude !== 0 || driver.currentLocation.longitude !== 0) ? (
            <button
             onClick={() => openGoogleMaps(driver.currentLocation.latitude, driver.currentLocation.longitude)}
             className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-charcoal hover:underline transition-colors font-bold text-left"
            >
             <Icon name="mdi_location (1)" folder="dashboardIcon" size="xs" />
             <span>
              {driver.currentLocation.latitude.toFixed(4)}, {driver.currentLocation.longitude.toFixed(4)}
             </span>
             <FiExternalLink size={10} />
            </button>
           ) : (
            <span className="text-xs text-gray-400 italic">No GPS coordinates</span>
           )}
          </td>
          <td>
           <StatusBadge module="driver" value={driver.status} />
          </td>
          <td className="text-right pr-6">
           <div className="flex justify-end gap-3 transition-all duration-300">
            {canAccess("drivers", "edit") && (
             <Tooltip text={driver.status === "active" ? "Deactivate Driver" : "Reactivate Driver"}>
              <Button
               shape="rounded-sm"
               variant="outline"
               className={`!p-1.5 border-gray-200 transition-all font-bold ${driver.status === "active"
                 ? "text-amber-500 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                 : "text-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                }`}
               onClick={() => {
                setDriverToToggle(driver);
                setIsStatusModalOpen(true);
               }}
              >
               <Icon name="settings" folder="dashboardIcon" size="sm" />
              </Button>
             </Tooltip>
            )}
            {canAccess("drivers", "delete") && (
             <Tooltip text="Remove Driver Account">
              <Button
               shape="rounded-sm"
               variant="outline"
               className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 border-gray-200 transition-all"
               onClick={() => {
                setDriverToDelete(driver);
                setIsDeleteModalOpen(true);
               }}
              >
               <Icon name="Delete" folder="dashboardIcon" size="sm" />
              </Button>
             </Tooltip>
            )}
           </div>
          </td>
         </tr>
        ))
       )}
      </tbody>
     </table>
    </div>

    {/* Pagination Footer */}
    <div className="p-4 bg-gray-50/30 border-t border-gray-50 mt-auto">
     <Pagination
      currentPage={currentPage}
      totalPages={pagination.totalPages}
      onPageChange={setCurrentPage}
     />
    </div>
   </div>

   {/* Toggle Status Confirmation */}
   <ConfirmationModal
    isOpen={isStatusModalOpen}
    onClose={() => setIsStatusModalOpen(false)}
    onConfirm={handleToggleStatus}
    title={driverToToggle?.status === "active" ? "Deactivate Driver Access" : "Reactivate Driver Access"}
    message={`Are you sure you want to ${driverToToggle?.status === "active" ? "deactivate" : "reactivate"
     } ${driverToToggle?.fullName}? ${driverToToggle?.status === "active"
      ? "Deactivating this driver will terminate their active sessions and prevent them from logging in to complete deliveries."
      : "Reactivating this driver will allow them to log in to the delivery mobile application again."
     }`}
    confirmText={isToggling ? "Updating..." : driverToToggle?.status === "active" ? "Deactivate Account" : "Reactivate Account"}
    type={driverToToggle?.status === "active" ? "danger" : "success"}
   />

   {/* Delete Driver Confirmation */}
   <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeleteDriver}
    title="Revoke Driver Account"
    message={`Are you sure you want to permanently delete driver ${driverToDelete?.fullName} and clear all related data? This action is permanent and cannot be undone.`}
    confirmText={isDeleting ? "Revoking..." : "Yes, Delete Driver"}
    type="danger"
   />
  </div>
 );
}
