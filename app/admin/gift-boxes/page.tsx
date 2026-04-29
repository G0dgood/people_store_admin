"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button/Button";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { AddGiftBoxModal } from "@/app/components/Admin/AddGiftBoxModal";
import Link from "next/link";
import { useGetGiftBoxesQuery, useDeleteGiftBoxMutation } from "@/lib/redux/services/giftBoxApi";
import { toast } from "sonner";
import Image from "next/image";
import { HiPlus, HiMagnifyingGlass, HiOutlineGift, HiTrash, HiSquares2X2, HiListBullet } from "react-icons/hi2";
import { HiPencil } from "react-icons/hi";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";

const GiftCardsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const rowsPerPage = 12;

  const { data: response, isLoading } = useGetGiftBoxesQuery({
    search,
    status: activeTab === "All" ? undefined : activeTab
  });

  const [deleteGiftBox, { isLoading: isDeleting }] = useDeleteGiftBoxMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const giftBoxes = response?.data?.giftBoxes || [];

  const handleEdit = (box: any) => {
    setSelectedBox(box);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBox(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGiftBox(deleteId).unwrap();
      toast.success("Gift box removed from curation");
    } catch (error) {
      toast.error("Failed to delete gift box");
    } finally {
      setDeleteId(null);
    }
  };

  // Sync pagination reset
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  const totalPages = Math.ceil(giftBoxes.length / rowsPerPage) || 1;
  const paginatedBoxes = giftBoxes.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-[#1D3557]">Gift Boxes</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Manage Artisanal Bundles</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleAdd}
            shape="rounded-sm"
            variant="primary"
            iconLeft={<HiPlus size={18} />}
          >
            Create New Set
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Filter & Control Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All", "Active", "Inactive"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              shape="rounded-sm"
              type="text"
              placeholder="Search by collection name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              containerClassName="flex-1 xl:w-96"
              className="bg-gray-50/30 border-gray-100 placeholder:text-gray-400 text-xs font-medium pl-11"
              suffixElement={<HiMagnifyingGlass size={18} className="text-gray-400" />}
            />

            <div className="flex gap-2">
              <Button
                shape="rounded-sm"
                variant="outline"
                className={`!p-2.5 w-10 h-10 transition-all ${viewType === "grid" ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-sm" : "text-gray-400 border-gray-100"}`}
                onClick={() => setViewType("grid")}
              >
                <HiSquares2X2 size={20} />
              </Button>
              <Button
                shape="rounded-sm"
                variant="outline"
                className={`!p-2.5 w-10 h-10 transition-all ${viewType === "list" ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-sm" : "text-gray-400 border-gray-100"}`}
                onClick={() => setViewType("list")}
              >
                <HiListBullet size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[400px] flex flex-col">
          {isLoading ? (
            <SVGLoaderFetch asTable={false} text="Loading curation..." />
          ) : giftBoxes.length === 0 ? (
            <NoRecordFound asTable={false} text="No gift boxes found in this category." />
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedBoxes.map((box) => (
                <div key={box._id} className="group relative bg-white border border-gray-100 rounded-[8px] overflow-hidden hover:shadow-xl hover:border-brand-gold/20 transition-all duration-500">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={box.image || "/placeholder.png"}
                      alt={box.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(box)}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-charcoal hover:bg-brand-gold hover:text-white transition-colors shadow-lg"
                      >
                        <HiPencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteId(box._id)}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${box.status === "Active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                        {box.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-black text-[#1D3557] truncate mb-1 uppercase tracking-tight">{box.name}</h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Set Price</span>
                        <span className="text-sm font-black text-brand-gold">₦{box.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contents</span>
                        <span className="text-[10px] font-bold text-gray-600">{box.products?.length || 0} Pieces</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Visual</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Collection</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Artisanal Pieces</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Price</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Status</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedBoxes.map((box) => (
                    <tr key={box._id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="w-16 h-12 relative rounded border border-gray-100 overflow-hidden bg-white">
                          <Image src={box.image || "/placeholder.png"} alt={box.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[#1D3557] group-hover:text-brand-gold transition-colors">{box.name}</span>
                          <span className="text-[10px] text-gray-400 truncate max-w-[200px]">{box.description}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-bold text-gray-600">{box.products?.length || 0} Products</td>
                      <td className="py-4 text-xs font-black text-brand-gold">₦{box.price.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${box.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}>
                          {box.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            className="!p-2 text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10"
                            onClick={() => handleEdit(box)}
                          >
                            <HiPencil size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            className="!p-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => setDeleteId(box._id)}
                          >
                            <HiTrash size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Area */}
        <div className="border-t border-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <AddGiftBoxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        giftBox={selectedBox}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Remove Gift Box"
        message="Are you sure you want to remove this curated set? This will hide the bundle from the shop and cannot be reversed."
        confirmText="Remove Curation"
        type="danger"
      />
    </div>
  );
};

export default GiftCardsPage;
