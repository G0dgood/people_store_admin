"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button/Button";
import { Input } from "@/app/components/Form/Inputs";
import { TabFilter } from "@/app/components/Admin/TabFilter";
import { Pagination } from "@/app/components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { useGetGiftCardsQuery, useDeleteGiftCardMutation, GiftCard } from "@/lib/redux/services/giftCardApi";
import { toast } from "sonner";
import { HiPlus, HiMagnifyingGlass, HiTrash, HiCreditCard, HiSquares2X2, HiListBullet, HiArrowsRightLeft, HiArrowPath } from "react-icons/hi2";
import { HiPencil } from "react-icons/hi";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { Tooltip } from "@/app/components/Tooltip";
import { MediaSkeleton as CardSkeleton } from "@/app/components/Admin/MediaSkeleton";
import { AddGiftCardModal } from "../../components/Admin/AddGiftCardModal";

const GiftCardsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const rowsPerPage = 12;

  const { data: response, isLoading, refetch, isFetching } = useGetGiftCardsQuery({
    search,
    status: activeTab === "All" ? undefined : activeTab,
    page: currentPage,
    limit: rowsPerPage
  });

  const [deleteGiftCard, { isLoading: isDeleting }] = useDeleteGiftCardMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const giftCards = response?.data?.giftCards || [];

  const handleEdit = (card: GiftCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGiftCard(deleteId).unwrap();
      toast.success("Gift card deleted successfully");
    } catch (error) {
      toast.error("Failed to delete gift card");
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  const totalPages = Math.ceil((response?.data?.total || 0) / rowsPerPage) || 1;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-[#121212]">Prepaid Cards</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Issue & Manage Gift Cards</p>
        </div>
        <div className="flex gap-3">
          <Tooltip text="Refresh Gift Cards">
            <Button shape="rounded-sm" variant="outline"
              className="border-gray-200 text-gray-500 group"
              iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </Tooltip>
          <Button
            onClick={handleAdd}
            shape="rounded-sm"
            variant="primary"
            disabled={isLoading || isFetching}
            iconLeft={<HiPlus size={18} />}
          >
            Issue New Card
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-200   overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All", "Active", "Used", "Expired"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              shape="rounded-sm"
              type="text"
              placeholder="Search by code or name..."
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
                className={`!p-2.5 w-10 h-10 transition-all ${viewType === "grid" ? "border-brand-gold bg-brand-gold/10 text-brand-gold  " : "text-gray-400 border-gray-100"}`}
                onClick={() => setViewType("grid")}
              >
                <HiSquares2X2 size={20} />
              </Button>
              <Button
                shape="rounded-sm"
                variant="outline"
                className={`!p-2.5 w-10 h-10 transition-all ${viewType === "list" ? "border-brand-gold bg-brand-gold/10 text-brand-gold  " : "text-gray-400 border-gray-100"}`}
                onClick={() => setViewType("list")}
              >
                <HiListBullet size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 min-h-[400px] flex flex-col">
          {(isLoading || isFetching) ? (
            <CardSkeleton viewType={viewType} count={8} />
          ) : giftCards.length === 0 ? (
            <NoRecordFound asTable={false} text="No gift cards found." />
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {giftCards.map((card) => (
                <div
                  key={card._id}
                  className="group relative rounded-[16px] overflow-hidden p-6 border border-white/5 hover:border-white/20 transition-all duration-500 shadow-xl shadow-black/20"
                  style={{ backgroundColor: card.color || "#121212" }}
                >
                  <div className="flex flex-col h-full gap-8">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{card.name}</span>
                        <span className="text-white text-lg font-black tracking-widest mt-1 uppercase">{card.code}</span>
                      </div>
                      <HiCreditCard size={28} className="text-white/20 group-hover:text-brand-gold/50 transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Current Balance</span>
                      <span className="text-2xl font-black text-white">₦{card.balance.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Expiry</span>
                        <span className="text-[10px] font-bold text-white/80">{card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : "Never"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Tooltip text="Edit Card Details">
                          <button onClick={() => handleEdit(card)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand-gold hover:text-white transition-all">
                            <HiPencil size={14} />
                          </button>
                        </Tooltip>
                        <Tooltip text="Delete Card">
                          <button onClick={() => setDeleteId(card._id)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-red-500 hover:text-white transition-all">
                            <HiTrash size={14} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0">
                    <span className={`px-3 py-1 rounded-bl-[12px] text-[8px] font-black uppercase tracking-widest ${card.status === 'Active' ? 'bg-green-500 text-white' :
                      card.status === 'Used' ? 'bg-brand-gold text-white' :
                        'bg-red-500 text-white'
                      }`}>
                      {card.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Card Info</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Balance</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Initial</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Expiry</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4">Status</th>
                    <th className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {giftCards.map((card) => (
                    <tr key={card._id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-brand-charcoal uppercase">{card.code}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{card.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-black text-brand-gold">₦{card.balance.toLocaleString()}</td>
                      <td className="py-4 text-xs font-bold text-gray-400">₦{card.initialAmount.toLocaleString()}</td>
                      <td className="py-4 text-xs font-bold text-gray-600">{card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : "No Expiry"}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${card.status === 'Active' ? 'bg-green-50 text-green-600' :
                          card.status === 'Used' ? 'bg-gray-50 text-blue-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                          {card.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip text="Edit Card Details">
                            <Button variant="ghost" onClick={() => handleEdit(card)} className="!p-2 text-gray-400 hover:text-brand-gold">
                              <HiPencil size={18} />
                            </Button>
                          </Tooltip>
                          <Tooltip text="Delete Card">
                            <Button variant="ghost" onClick={() => setDeleteId(card._id)} className="!p-2 text-gray-400 hover:text-red-500">
                              <HiTrash size={18} />
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-gray-50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <AddGiftCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        giftCard={selectedCard}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Gift Card"
        message="Are you sure you want to delete this gift card? This action cannot be undone."
        confirmText="Delete Card"
        type="danger"
      />
    </div>
  );
};

export default GiftCardsPage;
