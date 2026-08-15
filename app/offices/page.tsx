"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Form/Inputs";
import { Pagination } from "@/app/components/Admin/Pagination";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { Tooltip } from "@/app/components/Tooltip";
import { HiOutlineArrowPath, HiOutlineShare } from "react-icons/hi2";
import { useGetOfficesQuery, useDeleteOfficeMutation } from "@/lib/redux/services/officeApi";
import { toast } from "sonner";
import { BulkActionsDrawer } from "@/app/components/Admin/BulkActionsDrawer";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { AddOfficeModal } from "@/app/components/Admin/AddOfficeModal";
import { EditOfficeDrawer } from "@/app/components/Admin/EditOfficeDrawer";
import { ViewOfficeProductsModal } from "@/app/components/Admin/ViewOfficeProductsModal";
import { BusinessLinkModal } from "@/app/components/BusinessLinkModal";
import { LuPackageSearch } from "react-icons/lu";
import { useGetProductsQuery } from "@/lib/redux/services/productApi";

const statusConfig = {
  Active: "text-emerald-500 bg-emerald-50/50",
  Inactive: "text-rose-500 bg-rose-50/50",
};

export default function OfficesListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [officeToEdit, setOfficeToEdit] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState<any>(null);
  const [isViewProductsOpen, setIsViewProductsOpen] = useState(false);
  const [officeForProducts, setOfficeForProducts] = useState<any>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [officeForLink, setOfficeForLink] = useState<any>(null);

  const { data: response, isLoading, refetch, isFetching } = useGetOfficesQuery();
  const { data: productsResponse } = useGetProductsQuery({ limit: 1000 });
  const products = productsResponse?.data?.products || [];
  const [deleteOffice, { isLoading: isDeleting }] = useDeleteOfficeMutation();

  const officesData = response?.data || [];

  // Basic client-side search for now
  const filteredOffices = officesData.filter(office =>
    office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    office.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOffices.length / rowsPerPage) || 1;
  const paginatedOffices = filteredOffices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleAll = () => {
    if (selectedIds.length === paginatedOffices.length && paginatedOffices.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedOffices.map(o => String(o._id)));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (officeToDelete) {
      try {
        await deleteOffice(officeToDelete._id).unwrap();
        toast.success("Office Deleted", {
          description: `${officeToDelete.name} has been removed.`
        });
        setIsDeleteModalOpen(false);
      } catch (err: any) {
        toast.error("Deletion Failed", {
          description: err?.data?.message || "Failed to delete office."
        });
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => deleteOffice(id).unwrap()));
      toast.success("Bulk Deletion Successful", {
        description: `${selectedIds.length} office locations have been removed.`
      });
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error("Bulk Deletion Failed", {
        description: "Some locations could not be deleted."
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3 w-full sm:w-auto">
          <Tooltip text="Refresh List">
            <Button shape="rounded-sm" variant="outline"
              className="border-gray-200 text-gray-500 group h-11"
              iconLeft={<HiOutlineArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </Tooltip>
          <Button shape="rounded-sm" variant="primary"
            className="flex-1 sm:flex-initial h-11 transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
            iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Location
          </Button>
        </div>
      </div>

      <div className="bg-white overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px]">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search by name or address..."
              containerClassName="w-full lg:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium h-11"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />
            <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />
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
                    checked={selectedIds.length === paginatedOffices.length && paginatedOffices.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Location Name</th>
                <th>Address</th>
                <th>Contact info</th>
                <th>Products</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SVGLoaderFetch asTable={true} text="Loading locations..." colSpan={7} />
              ) : paginatedOffices.length === 0 ? (
                <NoRecordFound asTable={true} text="No locations found." colSpan={7} />
              ) : (
                paginatedOffices.map((office) => (
                  <tr key={office._id} className="group">
                    <td>
                      <Checkbox
                        checked={selectedIds.includes(office._id)}
                        onChange={() => toggleItem(office._id)}
                      />
                    </td>
                    <td>
                      <span className="text-sm font-bold text-[#121212] group-hover:text-brand-gold transition-colors">
                        {office.name}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-gray-500 max-w-[300px] truncate block">
                        {office.address}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-gray-700">{office.phone}</span>
                        <span className="text-[10px] text-gray-400">{office.email}</span>
                      </div>
                    </td>
                    <td>
                      <div
                        className="flex items-center gap-2 cursor-pointer group/count"
                        onClick={() => {
                          setOfficeForProducts(office);
                          setIsViewProductsOpen(true);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-[10px] border border-emerald-100 group-hover/count:bg-emerald-500 group-hover/count:text-white group-hover/count:border-emerald-500 transition-all">
                          {products.filter(p => p.locations?.some((l: any) => (typeof l === 'string' ? l : l._id) === office._id)).length}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter group-hover/count:text-emerald-600 transition-colors">Assigned</span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusConfig[office.status as keyof typeof statusConfig]}`}>
                        {office.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Tooltip text="Edit Location" position="top">
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                            onClick={() => {
                              setOfficeToEdit(office);
                              setIsEditDrawerOpen(true);
                            }}
                          >
                            <Icon name="settings" folder="dashboardIcon" size="sm" />
                          </Button>
                        </Tooltip>
                        <Tooltip text="Share Link" position="top">
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all"
                            onClick={() => {
                              setOfficeForLink(office);
                              setIsLinkModalOpen(true);
                            }}
                          >
                            <HiOutlineShare size={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip text="Delete Location" position="top">
                          <Button shape="rounded-sm" variant="outline"
                            className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                            onClick={() => {
                              setOfficeToDelete(office);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Icon name="Delete" folder="dashboardIcon" size="sm" />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Area */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddOfficeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {officeToEdit && (
        <EditOfficeDrawer
          isOpen={isEditDrawerOpen}
          onClose={() => {
            setIsEditDrawerOpen(false);
            setOfficeToEdit(null);
          }}
          office={officeToEdit}
        />
      )}

      <ViewOfficeProductsModal
        isOpen={isViewProductsOpen}
        onClose={() => {
          setIsViewProductsOpen(false);
          setOfficeForProducts(null);
        }}
        office={officeForProducts}
        assignedProducts={products.filter(p => p.locations?.some((l: any) => (typeof l === 'string' ? l : l._id) === officeForProducts?._id))}
      />

      <BusinessLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setOfficeForLink(null);
        }}
        officeName={officeForLink?.name}
        businessLink={officeForLink?.subdomain ? `localhost:3000/officelocation?subdomain/${officeForLink.subdomain}` : "No subdomain set"}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={handleClearSelection}
        selectedIds={selectedIds}
        items={filteredOffices}
        onClearSelection={handleClearSelection}
        title="Locations Selected"
        actions={[
          {
            id: "delete",
            title: "Delete Selected",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => {
              setOfficeToDelete(null);
              setIsDeleteModalOpen(true);
            },
          },
        ]}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={officeToDelete ? handleDelete : handleBulkDelete}
        title={officeToDelete ? "Delete Office Location" : "Delete Multiple Locations"}
        message={
          officeToDelete
            ? `Are you sure you want to delete "${officeToDelete.name}"? This action cannot be undone.`
            : `Are you sure you want to delete ${selectedIds.length} selected locations? This action cannot be undone.`
        }
        confirmText={officeToDelete ? "Yes, delete location" : "Yes, delete selected"}
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
