"use client";

import React, { useState } from "react";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Form/Inputs";
import { TabFilter } from "../../../components/Admin/TabFilter";
import { Pagination } from "../../../components/Admin/Pagination";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";
import { UploadMediaModal } from "../../../components/Admin/UploadMediaModal";
import { MediaMoreActionsDrawer } from "../../../components/Admin/MediaMoreActionsDrawer";
import { EditMediaDrawer } from "../../../components/Admin/EditMediaDrawer";
import { MediaPreviewModal } from "../../../components/Admin/MediaPreviewModal";
import { useGetMediaItemsQuery, useDeleteMediaMutation, MediaItem } from "@/lib/redux/services/mediaApi";
import { toast } from "sonner";
import { SVGLoaderFetch, NoRecordFound } from "@/app/components/Options";
import { useEffect } from "react";
import { Tooltip } from "@/app/components/Tooltip";
import { useApiError } from "@/app/hooks/useApiError";
import { HiArrowPath } from "react-icons/hi2";
import { MediaSkeleton } from "@/app/components/Admin/MediaSkeleton";

// Media items are now fetched via useGetMediaItemsQuery

export default function ProductMediaListing() {
  const { data: response, isLoading, refetch, isFetching } = useGetMediaItemsQuery();
  const mediaData = response?.data || [];

  const [deleteMedia, { isLoading: isDeleting, isError, error }] = useDeleteMediaMutation();
  useApiError(isError, error, "Failed to delete media");

  const [activeTab, setActiveTab] = useState("All media");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(12);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [isPurgeConfirmOpen, setIsPurgeConfirmOpen] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState<MediaItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [mediaToPreview, setMediaToPreview] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedia = mediaData.filter(item => {
    // Tab Filter
    const matchesTab = activeTab === "All media" ||
      (activeTab === "Images" && item.type === "image") ||
      (activeTab === "Videos" && item.type === "video");

    // Search Filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Pagination Logic
  const totalItems = filteredMedia.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMedia = filteredMedia.slice(startIndex, startIndex + rowsPerPage);

  // Sync pagination reset on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleDelete = async () => {
    if (!mediaToDelete) return;
    try {
      await deleteMedia(mediaToDelete._id).unwrap();
      toast.success("Media deleted successfully");
      setIsDeleteModalOpen(false);
      setMediaToDelete(null);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center mb-2">
        <div className="flex gap-3">
          <Tooltip text="Refresh Media Library">
            <Button shape="rounded-sm" variant="outline"
              className="border-gray-200 text-gray-500 group"
              iconLeft={<HiArrowPath size={16} className={`${isFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-white'} transition-colors`} />}
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </Tooltip>
          <Button shape="rounded-sm" variant="primary"
            iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload New
          </Button>
          <Button shape="rounded-sm" variant="outline"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            onClick={() => setIsMoreActionsOpen(true)}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-200   overflow-hidden flex flex-col">
        {/* Filter & Control Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All media", "Images", "Videos"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search media filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex gap-2">
              <Button shape="rounded-sm" variant="outline"
                className={`!p-2.5 w-10 h-10 transition-all
                  ${viewType === "grid"
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold  "
                    : "text-gray-400"}
                `}
                onClick={() => setViewType("grid")}
                title="Grid View"
              >
                <Icon name="grid_view" folder="icon" size="sm" />
              </Button>
              <Button shape="rounded-sm" variant="outline"
                className={`!p-2.5 w-10 h-10 transition-all
                  ${viewType === "list"
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold  "
                    : "text-gray-400"}
                `}
                onClick={() => setViewType("list")}
                title="List View"
              >
                <Icon name="menu" folder="icon" size="sm" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 min-h-[400px] flex flex-col">
          {(isLoading || isFetching) ? (
            <MediaSkeleton viewType={viewType} count={12} />
          ) : filteredMedia.length === 0 ? (
            <NoRecordFound asTable={false} />
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMedia.map((item) => (
                <div key={item._id} className="group relative bg-white border border-gray-200 rounded-[6px] overflow-hidden hover:shadow-md hover:border-brand-gold/20 transition-all">
                  <div
                    className="relative aspect-video bg-gray-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => {
                      setMediaToPreview(item);
                      setIsPreviewModalOpen(true);
                    }}
                  >
                    <img src={item.thumbnailUrl || item.url} alt={item.name} className="w-full h-full object-contain transition-transform group-hover:scale-105" />

                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center  ">
                          <Icon name="play_circle_filled" folder="icon" size="sm" className="text-[#1D3557] ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <Tooltip text="Media Settings">
                        <Button shape="rounded-sm" variant="outline"
                          className="w-8 h-8 text-gray-500 bg-white/95   hover:text-white hover:bg-brand-gold hover:border-brand-gold !p-0 transition-all cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaToEdit(item);
                            setIsEditDrawerOpen(true);
                          }}
                        >
                          <Icon name="settings" folder="dashboardIcon" size="xs" />
                        </Button>
                      </Tooltip>
                      <Tooltip text="Permanently Delete Asset">
                        <Button shape="rounded-sm" variant="outline"
                          className="w-8 h-8 bg-white/95   text-gray-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 !p-0 transition-all cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaToDelete(item);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Icon name="Delete" folder="dashboardIcon" size="xs" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-50 bg-white">
                    <h3 className="text-sm font-bold text-[#1D3557] truncate mb-1" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.size}</span>
                      <span className="text-[10px] font-medium text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th className="text-xs">Asset</th>
                    <th className="text-xs">Filename</th>
                    <th className="text-xs">Size</th>
                    <th className="text-xs">Type</th>
                    <th className="text-xs">Uploaded</th>
                    <th className="text-xs text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMedia.map((item) => (
                    <tr key={item._id} className="group">
                      <td>
                        <div
                          className="w-16 h-10 rounded-[4px] border border-gray-200 overflow-hidden bg-white p-0.5   relative shrink-0 cursor-pointer"
                          onClick={() => {
                            setMediaToPreview(item);
                            setIsPreviewModalOpen(true);
                          }}
                        >
                          <img src={item.thumbnailUrl || item.url} alt={item.name} className="w-full h-full object-contain" />
                          {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                              <Icon name="play_circle" folder="icon" size="xs" className="text-[#1D3557]" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm font-bold text-[#1D3557] truncate max-w-[200px] block group-hover:text-brand-gold transition-colors">
                          {item.name}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs font-bold text-gray-500">{item.size}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Icon
                            name={item.type === "video" ? "play_circle" : "photo"}
                            folder="icon"
                            size="xs"
                            className="text-gray-400"
                          />
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.type}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs font-medium text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end items-center gap-4">
                          <Tooltip text="Media Settings">
                            <Button shape="rounded-sm" variant="outline"
                              className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all"
                              onClick={() => {
                                setMediaToEdit(item);
                                setIsEditDrawerOpen(true);
                              }}
                            >
                              <Icon name="settings" folder="dashboardIcon" size="sm" />
                            </Button>
                          </Tooltip>
                          <Tooltip text="Permanently Delete Asset">
                            <Button shape="rounded-sm" variant="outline"
                              className="!p-1.5 text-gray-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                              onClick={() => {
                                setMediaToDelete(item);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Icon name="Delete" folder="dashboardIcon" size="sm" />
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <MediaMoreActionsDrawer
        isOpen={isMoreActionsOpen}
        onClose={() => setIsMoreActionsOpen(false)}
        onPurgeUnused={() => setIsPurgeConfirmOpen(true)}
      />

      <EditMediaDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        media={mediaToEdit}
      />

      <MediaPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        media={mediaToPreview}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Media File"
        message={`Are you sure you want to permanently delete "${mediaToDelete?.name}"? Any products currently using this asset will show a broken image link.`}
        confirmText="Yes, delete file"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isPurgeConfirmOpen}
        onClose={() => setIsPurgeConfirmOpen(false)}
        onConfirm={() => {
          setIsPurgeConfirmOpen(false);
        }}
        title="Purge Unused Assets"
        message="Are you sure you want to identify and remove all media files that aren't linked to any active product? This action will save space but cannot be reversed."
        confirmText="Yes, purge now"
        type="danger"
      />
    </div>
  );
}
