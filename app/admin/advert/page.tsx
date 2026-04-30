"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { useGetAdvertConfigQuery, useUpdateAdvertConfigMutation, AdvertConfig, AdvertItem, useCreateAdvertConfigMutation } from "@/lib/redux/services/advertApi";
import { useGetProductsQuery } from "@/lib/redux/services/productApi";
import { useGetMediaItemsQuery, MediaItem } from "@/lib/redux/services/mediaApi";
import { useGetCategoriesQuery } from "@/lib/redux/services/categoryApi";
import { toast } from "sonner";
import { TabFilter } from "../../components/Admin/TabFilter";
import { AdvertSkeleton } from "../../components/Skeleton/AdvertSkeleton";
import CinematicFocalPointModal from "../../components/Admin/CinematicFocalPointModal";
import { ItemArrangement } from "../../components/Admin/ItemArrangement";
import { FeaturedItemsPicker } from "../../components/Admin/FeaturedItemsPicker";
import { BackgroundLibraryModal } from "../../components/Admin/BackgroundLibraryModal";
import { BackgroundOrchestration } from "@/app/components/Admin/BackgroundOrchestration";
import { CopywritingTiming } from "@/app/components/Admin/CopywritingTiming";
import { Icon } from "@/app/components/Icon";
import { useSocket } from "@/app/context/SocketContext";
import { Tooltip } from "../../components/Tooltip";
import { HiArrowPath } from "react-icons/hi2";
import { ConfirmationModal } from "@/app/components/Admin/ConfirmationModal";

const INITIAL_CONFIG: AdvertConfig = {
  backgroundImages: [],
  featuredItems: [],
  layout: "",
  inventoryLayout: "",
  showTitle: false,
  showHighlight: false,
  showDescription: false,
  showStats: false,
  title: "",
  titleHighlight: "",
  description: "",
  stats: "",
  cycleDuration: 8,
};

export default function AdvertManagement() {
  const { data: advertResponse, isLoading: isAdvertLoading, refetch: refetchAdvert, isFetching: isFetchingAdvert } = useGetAdvertConfigQuery();
  const { data: productsResponse, isLoading: isProductsLoading } = useGetProductsQuery();
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const { data: mediaResponse, isLoading: isMediaLoading } = useGetMediaItemsQuery();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateAdvertConfigMutation();
  const [createConfig, { isLoading: isCreating }] = useCreateAdvertConfigMutation();
  const [localConfig, setLocalConfig] = useState<AdvertConfig>(INITIAL_CONFIG);
  const { on, off } = useSocket();

  const productsData = (productsResponse?.data as any)?.products || [];
  const categoriesData = categoriesResponse?.data || [];
  // Synchronized category data for orchestration
  const availableBackgrounds = (mediaResponse?.data as MediaItem[])?.filter(m => m.type === "image").map(m => m.url) || [
    "", // Fallback default
  ];

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [refiningAssetIndex, setRefiningAssetIndex] = useState<number | null>(null);
  const [replacingAssetIndex, setReplacingAssetIndex] = useState<number | null>(null);
  const [activeVisualIndex, setActiveVisualIndex] = useState<number | null>(null); // null means Global Sequence

  // Initialize local config when data arrives
  useEffect(() => {
    if (advertResponse) {
      setLocalConfig(advertResponse);
    }
  }, [advertResponse]);

  // Real-time advert sync
  useEffect(() => {
    const handleUpdate = () => refetchAdvert();
    on("ADVERT_UPDATED", handleUpdate);
    return () => off("ADVERT_UPDATED", handleUpdate);
  }, [on, off, refetchAdvert]);

  if (isAdvertLoading || isProductsLoading || isMediaLoading || isCategoriesLoading) return <AdvertSkeleton />;

  const config = localConfig;
  const setConfig = setLocalConfig as any;

  const handleSave = async () => {
    try {
      const { _id, ...data } = config;

      if (_id) {
        // Update existing
        await updateConfig({ id: _id, data }).unwrap();
      } else {
        // Create new
        await createConfig(data).unwrap();
      }

      toast.success("Marketing Policy Deployed", {
        description: "The interactive login experience has been updated across the platform."
      });
      setIsDeployModalOpen(false);
    } catch (err: any) {
      toast.error("Deployment Failed", {
        description: err?.message || err?.data?.message || "An unexpected error occurred while updating the configuration."
      });
    }
  };

  const toggleBackgroundSelection = (bgUrl: string) => {
    const isSelected = config.backgroundImages.some(img => img.url === bgUrl);
    if (isSelected) {
      if (config.backgroundImages.length > 1) {
        const newImages = config.backgroundImages.filter(img => img.url !== bgUrl);
        setConfig({
          ...config,
          backgroundImages: newImages
        });

        // Safety: If the active visual was deleted or the index is now out of bounds
        if (activeVisualIndex !== null && (activeVisualIndex >= newImages.length)) {
          setActiveVisualIndex(null);
        }
      }
    } else {
      setConfig({
        ...config,
        backgroundImages: [...config.backgroundImages, { url: bgUrl, positionX: 50, positionY: 50 }]
      });
    }
  };

  const handleUpdateFocalPoint = (index: number, x: number, y: number) => {
    const newBackgrounds = [...config.backgroundImages];
    newBackgrounds[index] = { ...newBackgrounds[index], positionX: x, positionY: y };
    setConfig({ ...config, backgroundImages: newBackgrounds });
  };

  const handleReorderBackgrounds = (newBackgrounds: any[]) => {
    // Focus Protection: Determine where the currently focused image moved to
    if (activeVisualIndex !== null) {
      const activeImage = config.backgroundImages[activeVisualIndex];
      const newIndex = newBackgrounds.findIndex(img => img.url === activeImage.url);
      if (newIndex !== -1) {
        setActiveVisualIndex(newIndex);
      }
    }
    setConfig({ ...config, backgroundImages: newBackgrounds });
  };

  const handleSelectBackground = (bgUrl: string) => {
    if (replacingAssetIndex !== null && config) {
      const newBackgrounds = [...config.backgroundImages];
      newBackgrounds[replacingAssetIndex] = { ...newBackgrounds[replacingAssetIndex], url: bgUrl };
      setConfig({ ...config, backgroundImages: newBackgrounds });
      setReplacingAssetIndex(null);
      setIsBackgroundModalOpen(false);
    } else {
      toggleBackgroundSelection(bgUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | FileList) => {
    const files = e instanceof FileList ? e : e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        toggleBackgroundSelection(base64String);
      };
      reader.readAsDataURL(file);
    });

    // Reset will be handled by the component owning the ref
  };

  const toggleProductSelection = (product: AdvertItem) => {
    if (activeVisualIndex === null) {
      // Global Selection
      const isSelected = config.featuredItems.some(p => p._id === product._id);
      if (isSelected) {
        setConfig({
          ...config,
          featuredItems: config.featuredItems.filter(p => p._id !== product._id)
        });
      } else {
        setConfig({
          ...config,
          featuredItems: [...config.featuredItems, product]
        });
      }
    } else {
      // Visual Specific Override
      const newBackgrounds = [...config.backgroundImages];
      const currentVisual = newBackgrounds[activeVisualIndex];
      const items = currentVisual.featuredItems || [];
      const isSelected = items.some(p => p._id === product._id);

      if (isSelected) {
        newBackgrounds[activeVisualIndex] = {
          ...currentVisual,
          featuredItems: items.filter(p => p._id !== product._id)
        };
      } else {
        newBackgrounds[activeVisualIndex] = {
          ...currentVisual,
          featuredItems: [...items, product]
        };
      }
      setConfig({ ...config, backgroundImages: newBackgrounds });
    }
  };

  const activeFeaturedItems = activeVisualIndex === null
    ? config.featuredItems
    : (config.backgroundImages[activeVisualIndex]?.featuredItems || []);

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex justify-between items-center ">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-black text-[#1D3557]">Advert Control Center</h1>
          <p className="text-sm text-gray-400 font-medium">Configure and deploy the interactive login marketing experience.</p>
        </div>

        <div className="flex items-center gap-6">
          <Tooltip text="Refresh Advert Config">
            <Button shape="rounded-sm" variant="outline"
              className="border-gray-200 text-gray-500 group h-10"
              iconLeft={<HiArrowPath size={16} className={`${isFetchingAdvert ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold'} transition-colors`} />}
              onClick={() => refetchAdvert()}
              disabled={isAdvertLoading || isFetchingAdvert}
            >
              {isFetchingAdvert ? "Synchronizing..." : "Refresh"}
            </Button>
          </Tooltip>
          <div className="flex flex-col items-end gap-1.5 mr-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Layout Architecture</span>
            <TabFilter
              id="layout-architecture"
              tabs={["Login Left", "Login Right"]}
              activeTab={config.layout === "left-form" ? "Login Left" : "Login Right"}
              onChange={(tab) => setConfig({ ...config, layout: tab === "Login Left" ? "left-form" : "right-form" })}
            />
          </div>

          <Button shape="rounded-sm" variant="primary"
            onClick={() => setIsDeployModalOpen(true)}
            isLoading={isUpdating || isCreating}
            className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold"
            iconLeft={<Icon name="cloud_upload" folder="icon" size="sm" className="brightness-0 invert" />}
          >
            Deploy Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 flex flex-col gap-8">

          <CopywritingTiming
            config={config}
            activeVisualIndex={activeVisualIndex}
            setConfig={setConfig}
            setActiveVisualIndex={setActiveVisualIndex}
          />

          <BackgroundOrchestration
            config={config}
            productsData={productsData}
            categoriesData={categoriesData}
            setConfig={setConfig}
            setIsBackgroundModalOpen={setIsBackgroundModalOpen}
            setReplacingAssetIndex={setReplacingAssetIndex}
            setIsRefineModalOpen={setIsRefineModalOpen}
            setRefiningAssetIndex={setRefiningAssetIndex}
            handleReorderBackgrounds={handleReorderBackgrounds}
            toggleBackgroundSelection={toggleBackgroundSelection}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <FeaturedItemsPicker
              config={config}
              activeVisualIndex={activeVisualIndex}
              activeFeaturedItems={activeFeaturedItems}
              productsData={productsData}
              setConfig={setConfig}
              toggleProductSelection={toggleProductSelection}
              setActiveVisualIndex={setActiveVisualIndex}
            />

            <ItemArrangement
              config={config}
              activeVisualIndex={activeVisualIndex}
              activeFeaturedItems={activeFeaturedItems}
              setConfig={setConfig}
            />
          </div>
        </div>
      </div>




      <BackgroundLibraryModal
        isOpen={isBackgroundModalOpen}
        onClose={() => {
          setIsBackgroundModalOpen(false);
          setReplacingAssetIndex(null);
        }}
        replacingAssetIndex={replacingAssetIndex}
        availableBackgrounds={availableBackgrounds}
        productsData={productsData}
        config={config}
        setConfig={setConfig}
        handleSelectBackground={handleSelectBackground}
        toggleBackgroundSelection={toggleBackgroundSelection}
        handleFileUpload={handleFileUpload}
      />

      <ConfirmationModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onConfirm={handleSave}
        isLoading={isUpdating || isCreating}
        title="Deploy Advert Policy"
        message="Are you sure you want to deploy these changes? This will immediately update the login page branding and featured products for all users."
        confirmText="Yes, deploy configuration"
        type="success"
      />

      <CinematicFocalPointModal
        isOpen={isRefineModalOpen}
        onClose={() => setIsRefineModalOpen(false)}
        refiningAssetIndex={refiningAssetIndex}
        backgroundImages={config.backgroundImages}
        onUpdateFocalPoint={handleUpdateFocalPoint}
      />

    </div>
  );
}
