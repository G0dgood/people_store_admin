"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { AddBrandModal } from "../../components/Admin/AddBrandModal";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { EditBrandDrawer } from "../../components/Admin/EditBrandDrawer";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { BrandsMoreActionsDrawer } from "../../components/Admin/BrandsMoreActionsDrawer";

const brandsData = [
  { id: 1, name: "Apple", logo: "/dashboardImage/Electronics.png", category: "Electronics", rating: 4.8, status: "Active" },
  { id: 2, name: "Nike", logo: "/dashboardImage/Fashion.png", category: "Fashion", rating: 4.5, status: "Active" },
  { id: 3, name: "Samsung", logo: "/dashboardImage/Frame 4259 copy.png", category: "Electronics", rating: 4.6, status: "Active" },
  { id: 4, name: "Adidas", logo: "/dashboardImage/T-Shirt.png", category: "Fashion", rating: 4.4, status: "Inactive" },
  { id: 5, name: "Sony", logo: "/dashboardImage/Accessories.png", category: "Electronics", rating: 4.7, status: "Active" },
  { id: 6, name: "Logitech", logo: "/dashboardImage/Webcam.png", category: "Accessories", rating: 4.3, status: "Active" },
  { id: 7, name: "Beats", logo: "/dashboardImage/Headphones.png", category: "Electronics", rating: 4.5, status: "Active" },
  { id: 8, name: "Dyson", logo: "/dashboardImage/Home & Kitchen.png", category: "Home Appliance", rating: 4.9, status: "Inactive" },
];

const statusConfig = {
  Active: "text-brand-gold bg-brand-gold/10",
  Inactive: "text-rose-500 bg-rose-50/50",
};

export default function BrandsListing() {
  const [activeTab, setActiveTab] = useState("All brands");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<any>(null);

  const toggleAll = () => {
    if (selectedIds.length === brandsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(brandsData.map(b => b.id));
    }
  };

  const toggleItem = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<any>(null);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isBulkDeactivateConfirmOpen, setIsBulkDeactivateConfirmOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
        <div className="flex gap-3 w-full sm:w-auto">
          <Button shape="rounded-sm" variant="primary"
            className="flex-1 sm:flex-initial transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
            iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Brand
          </Button>
          <Button shape="rounded-sm" variant="outline"
            className="flex-1 sm:flex-initial"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All brands", "Active", "Inactive"]}
            activeTab={activeTab}
            onChange={setActiveTab} id={""} />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search brand name"
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button shape="rounded-sm" variant="outline"
                  className="!p-2.5 text-gray-400">
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button shape="rounded-sm" variant="outline"
                  className="!p-2.5 text-gray-400">
                  <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
                </Button>
                <Button shape="rounded-sm" variant="outline"
                  className="!p-2.5 text-gray-400">
                  <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={selectedIds.length === brandsData.length && brandsData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>No.</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {brandsData.map((brand, index) => (
                <tr key={brand.id} className="group">
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(brand.id)}
                      onChange={() => toggleItem(brand.id)}
                    />
                  </td>
                  <td className="text-sm font-medium text-gray-900">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[6px] border border-gray-200 overflow-hidden bg-white p-1 ring-1 ring-gray-100 flex items-center justify-center">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-bold text-[#1D3557] group-hover:text-brand-gold transition-colors">
                        {brand.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm font-bold text-gray-500">{brand.category}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Icon name="star" folder="dashboardIcon" size="xs" className="text-amber-400" />
                      <span className="text-xs font-bold text-[#1D3557]">{brand.rating}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[brand.status as keyof typeof statusConfig]}`}>
                      {brand.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Button shape="rounded-sm" variant="outline"
                        className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                        onClick={() => {
                          setBrandToEdit(brand);
                          setIsEditDrawerOpen(true);
                        }}
                      >
                        <Icon name="settings" folder="dashboardIcon" size="sm" />
                      </Button>
                      <Button shape="rounded-sm" variant="outline"
                        className="!p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        onClick={() => {
                          setBrandToDelete(brand);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Icon name="Delete" folder="dashboardIcon" size="sm" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Area */}
        <Pagination
          currentPage={currentPage}
          totalPages={24}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditBrandDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        brand={brandToEdit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Deleting brand:", brandToDelete?.name);
          setIsDeleteModalOpen(false);
        }}
        title="Delete Brand"
        message={`Are you sure you want to delete the brand "${brandToDelete?.name}"? This action will remove it from the storefront and cannot be undone.`}
        confirmText="Yes, delete brand"
        type="danger"
      />

      <BrandsMoreActionsDrawer
        isOpen={isMoreActionsOpen}
        onClose={() => setIsMoreActionsOpen(false)}
        onDeactivateInactive={() => setIsBulkDeactivateConfirmOpen(true)}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={brandsData}
        onClearSelection={() => setSelectedIds([])}
        title="Brands Selected"
        actions={[
          {
            id: "export",
            title: "Export Selected",
            icon: "cloud_download",
            folder: "icon",
            onClick: () => console.log("Exporting selected brands..."),
          },
          {
            id: "delete",
            title: "Delete All Selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => setIsDeleteModalOpen(true),
          },
        ]}
      />

      <ConfirmationModal
        isOpen={isBulkDeactivateConfirmOpen}
        onClose={() => setIsBulkDeactivateConfirmOpen(false)}
        onConfirm={() => {
          console.log("Bulk deactivating inactive brands...");
          setIsBulkDeactivateConfirmOpen(false);
        }}
        title="Bulk Deactivate Brands"
        message="Are you sure you want to deactivate all brands currently marked as 'Inactive'? They will no longer be visible on the storefront."
        confirmText="Yes, deactivate all"
        type="danger"
      />
    </div>
  );
}
