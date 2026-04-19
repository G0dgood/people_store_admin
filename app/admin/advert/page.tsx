"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { getAdvertConfig, saveAdvertConfig, AdvertConfig, AdvertItem } from "../../utils/advertState";
import { motion, Reorder } from "framer-motion";
import { ConfirmationModal } from "../../components/Admin/ConfirmationModal";
import Modal from "../../components/Modal/Modal";
import { Input } from "../../components/Form";
import { Label } from "../../components/Form/Field";
import Checkbox from "../../components/Checkbox";
import { TabFilter } from "../../components/Admin/TabFilter";
import Dropdown from "../../components/Form/Dropdown";
import { AdvertSkeleton } from "../../components/Skeleton/AdvertSkeleton";
import { LuPencilLine, LuArrowLeftRight } from "react-icons/lu";

const availableBackgrounds = [
  "/images/login-hero.png",
  "/dashboardImage/Headphones.png",
  "/dashboardImage/Electronics.png",
  "/dashboardImage/Fashion.png",
  "/dashboardImage/Home & Kitchen.png",
];

const productsData: AdvertItem[] = [
  { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: "₦35,000", image: "/dashboardImage/Headphones.png" },
  { id: 2, name: "Smart Fitness Watch", category: "Electronics", price: "₦18,500", image: "/dashboardImage/Electronics.png" },
  { id: 3, name: "Organic Cotton T-Shirt", category: "Fashion", price: "₦4,500", image: "/dashboardImage/T-Shirt.png" },
  { id: 4, name: "Leather Travel Bag", category: "Fashion", price: "₦25,000", image: "/dashboardImage/Fashion.png" },
  { id: 5, name: "Minimalist Wall Clock", category: "Home", price: "₦8,900", image: "/dashboardImage/Home & Kitchen.png" },
  { id: 6, name: "Modern Desk Lamp", category: "Home", price: "₦12,000", image: "/dashboardImage/Bulb.png" },
  { id: 7, name: "Ergonomic Gaming Mouse", category: "Electronics", price: "₦22,000", image: "/dashboardImage/Accessories.png" },
  { id: 8, name: "Wireless Charging Pad", category: "Electronics", price: "₦7,500", image: "/dashboardImage/Electronics.png" },
];

export default function AdvertManagement() {
  const [config, setConfig] = useState<AdvertConfig | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [refiningAssetIndex, setRefiningAssetIndex] = useState<number | null>(null);
  const [replacingAssetIndex, setReplacingAssetIndex] = useState<number | null>(null);
  const [editingStoryIndex, setEditingStoryIndex] = useState<number | null>(null);
  const [activeVisualIndex, setActiveVisualIndex] = useState<number | null>(null); // null means Global Sequence
  const [backgroundModalTab, setBackgroundModalTab] = useState<"ambient" | "products" | "url" | "upload">("ambient");
  const [customUrl, setCustomUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setConfig(getAdvertConfig());
  }, []);

  if (!config) return <AdvertSkeleton />;

  const handleSave = () => {
    if (config) {
      saveAdvertConfig(config);
      setIsDeployModalOpen(false);
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

    // Reset input value to allow re-uploading same file if via click
    if (!(e instanceof FileList) && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleProductSelection = (product: AdvertItem) => {
    if (activeVisualIndex === null) {
      // Global Selection
      const isSelected = config.featuredItems.some(p => p.id === product.id);
      if (isSelected) {
        setConfig({
          ...config,
          featuredItems: config.featuredItems.filter(p => p.id !== product.id)
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
      const isSelected = items.some(p => p.id === product.id);
      
      if (isSelected) {
        newBackgrounds[activeVisualIndex] = {
          ...currentVisual,
          featuredItems: items.filter(p => p.id !== product.id)
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
          <div className="flex flex-col items-end gap-1.5 mr-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Layout Architecture</span>
            <TabFilter
              id="layout-architecture"
              tabs={["Login Left", "Login Right"]}
              activeTab={config.layout === "left-form" ? "Login Left" : "Login Right"}
              onChange={(tab) => setConfig({ ...config, layout: tab === "Login Left" ? "left-form" : "right-form" })}
            />
          </div>

          <Button
            variant="primary"
            shape="rounded-sm"
            onClick={() => setIsDeployModalOpen(true)}
            iconLeft={<Icon name="cloud_upload" folder="icon" size="sm" className="brightness-0 invert" />}
          >
            Deploy Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 flex flex-col gap-8">

          {/* Section 1: Copywriting & Timing */}
          <section className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#1D3557] flex items-center gap-2">
                <span className="w-8 h-8 rounded-[6px] bg-blue-50 text-blue-500 flex items-center justify-center text-xs">01</span>
                Feature Copy & Timing
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1.5 ">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none italic">Targeting Atmosphere</span>
                   <Dropdown 
                     options={[
                       { value: "global", label: "Global Defaults (Sequence)" },
                       ...config.backgroundImages.map((bg, i) => ({ value: i.toString(), label: `Atmosphere ${i + 1}` }))
                     ]}
                     value={activeVisualIndex === null ? "global" : activeVisualIndex.toString()}
                     onChange={(val) => setActiveVisualIndex(val === "global" ? null : parseInt(val))}
                     size="sm"
                     className="min-w-[180px]"
                   />
                </div>
                {activeVisualIndex !== null && (
                  <Button
                    variant="outline"
                    shape="rounded-sm"
                    className="text-[10px] py-1 h-9 px-4"
                    onClick={() => {
                      const newBgs = [...config.backgroundImages];
                      newBgs[activeVisualIndex] = { 
                        ...newBgs[activeVisualIndex], 
                        title: undefined, 
                        titleHighlight: undefined, 
                        description: undefined, 
                        stats: undefined,
                        duration: undefined
                      };
                      setConfig({ ...config, backgroundImages: newBgs });
                    }}
                  >
                    Reset Slide
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={config.showTitle}
                        onChange={(checked) => setConfig({ ...config, showTitle: checked })}
                        size="md"
                      />
                      <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showTitle ? "text-gray-300" : "text-brand-blue/60"}`}>Main Title</Label>
                    </div>
                    <div className={`transition-opacity duration-300 ${!config.showTitle ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                      <Input
                        value={activeVisualIndex === null ? config.title : (config.backgroundImages[activeVisualIndex]?.title || "")}
                        onChange={(e) => {
                          if (activeVisualIndex === null) {
                            setConfig({ ...config, title: e.target.value });
                          } else {
                            const newBgs = [...config.backgroundImages];
                            newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], title: e.target.value };
                            setConfig({ ...config, backgroundImages: newBgs });
                          }
                        }}
                        placeholder={activeVisualIndex === null ? "e.g. Master Your" : `Default: ${config.title}`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={config.showHighlight}
                        onChange={(checked) => setConfig({ ...config, showHighlight: checked })}
                        size="md"
                      />
                      <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showHighlight ? "text-gray-300" : "text-brand-blue/60"}`}>Highlighted Title</Label>
                    </div>
                    <div className={`transition-opacity duration-300 ${!config.showHighlight ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                      <Input
                        value={activeVisualIndex === null ? config.titleHighlight : (config.backgroundImages[activeVisualIndex]?.titleHighlight || "")}
                        onChange={(e) => {
                          if (activeVisualIndex === null) {
                            setConfig({ ...config, titleHighlight: e.target.value });
                          } else {
                            const newBgs = [...config.backgroundImages];
                            newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], titleHighlight: e.target.value };
                            setConfig({ ...config, backgroundImages: newBgs });
                          }
                        }}
                        placeholder={activeVisualIndex === null ? "e.g. Command." : `Default: ${config.titleHighlight}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={config.showDescription}
                      onChange={(checked) => setConfig({ ...config, showDescription: checked })}
                      size="md"
                    />
                    <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showDescription ? "text-gray-300" : "text-brand-blue/60"}`}>Description Text</Label>
                  </div>
                  <div className={`transition-opacity duration-300 ${!config.showDescription ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                    <Input
                      value={activeVisualIndex === null ? config.description : (config.backgroundImages[activeVisualIndex]?.description || "")}
                      onChange={(e) => {
                        if (activeVisualIndex === null) {
                          setConfig({ ...config, description: e.target.value });
                        } else {
                          const newBgs = [...config.backgroundImages];
                          newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], description: e.target.value };
                          setConfig({ ...config, backgroundImages: newBgs });
                        }
                      }}
                      placeholder={activeVisualIndex === null ? "Describe your platform brilliance..." : `Default: ${config.description}`}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={config.showStats}
                      onChange={(checked) => setConfig({ ...config, showStats: checked })}
                      size="md"
                    />
                    <Label className={`!mb-0 text-[10px] font-black uppercase tracking-widest transition-opacity ${!config.showStats ? "text-gray-300" : "text-brand-blue/60"}`}>Platform Stats</Label>
                  </div>
                  <div className={`transition-opacity duration-300 ${!config.showStats ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                    <Input
                      value={activeVisualIndex === null ? config.stats : (config.backgroundImages[activeVisualIndex]?.stats || "")}
                      onChange={(e) => {
                        if (activeVisualIndex === null) {
                          setConfig({ ...config, stats: e.target.value });
                        } else {
                          const newBgs = [...config.backgroundImages];
                          newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], stats: e.target.value };
                          setConfig({ ...config, backgroundImages: newBgs });
                        }
                      }}
                      placeholder={activeVisualIndex === null ? "e.g. Powering 12,400+ stores..." : `Default: ${config.stats}`}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-[6px] border border-gray-200 flex flex-col gap-6 justify-center">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-[#1D3557] uppercase tracking-widest">
                    {activeVisualIndex === null ? "Global Cycle Duration" : `Atmosphere ${activeVisualIndex + 1} Timing Override`}
                  </label>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {activeVisualIndex === null 
                      ? "How many seconds should each background image stay before cycling?" 
                      : `Override the global timing for this specific atmosphere.`}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={activeVisualIndex === null ? config.cycleDuration : (config.backgroundImages[activeVisualIndex]?.duration || config.cycleDuration)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (activeVisualIndex === null) {
                        setConfig({ ...config, cycleDuration: val });
                      } else {
                        const newBgs = [...config.backgroundImages];
                        newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], duration: val };
                        setConfig({ ...config, backgroundImages: newBgs });
                      }
                    }}
                    className="flex-1 accent-brand-blue"
                  />
                  <span className="w-16 h-12 bg-white rounded-[6px] border border-gray-200 flex items-center justify-center font-black text-brand-blue text-lg">
                    {activeVisualIndex === null ? config.cycleDuration : (config.backgroundImages[activeVisualIndex]?.duration || config.cycleDuration)}s
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Background Orchestration */}
          <section className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-[#1D3557] flex items-center gap-2">
                <span className="w-8 h-8 rounded-[6px] bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs">02</span>
                Atmospheric Visuals
              </h3>
              <Button
                variant="outline"
                shape="rounded-sm"
                onClick={() => setIsBackgroundModalOpen(true)}
                iconLeft={<Icon name="material-symbols_image-outline" folder="dashboardIcon" size="xs" />}
                className="text-xs py-2"
              >
                Manage Background Library ({config.backgroundImages.length})
              </Button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
              <Reorder.Group 
                axis="x" 
                values={config.backgroundImages} 
                onReorder={handleReorderBackgrounds}
                className="flex gap-4"
              >
                {config.backgroundImages.map((bg, i) => {
                const categories = Array.from(new Set(productsData.map(p => p.category)));
                return (
                  <Reorder.Item 
                    key={bg.url} 
                    value={bg}
                    className="flex flex-col gap-3 min-w-[240px] cursor-grab active:cursor-grabbing"
                  >
                    <div className="relative aspect-[16/10] rounded-[6px] overflow-hidden border border-gray-200 shadow-sm group">
                      <img
                        src={bg.url}
                        alt="Visual"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                        style={{ objectPosition: `${bg.positionX}% ${bg.positionY}%` }}
                      />
                      
                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                        <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                          {i + 1}
                        </div>
                        <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icon name="drag_indicator" folder="icon" size="xs" />
                        </div>
                      </div>

                      {bg.linkedCategory && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 rounded-[4px] text-[8px] font-black text-white shadow-lg uppercase tracking-widest z-10 animate-in fade-in zoom-in duration-300">
                          {bg.linkedCategory}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10">
                        <div className="flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <button
                            onClick={() => {
                              setRefiningAssetIndex(i);
                              setIsRefineModalOpen(true);
                            }}
                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1D3557] hover:bg-brand-blue hover:text-white transition-all shadow-lg text-lg"
                            title="Edit Focal Point"
                          >
                            <LuPencilLine />
                          </button>
                          <button
                            onClick={() => {
                              setReplacingAssetIndex(i);
                              setIsBackgroundModalOpen(true);
                            }}
                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1D3557] hover:bg-brand-blue hover:text-white transition-all shadow-lg text-lg"
                            title="Replace Image"
                          >
                            <LuArrowLeftRight />
                          </button>
                          <button
                            onClick={() => {
                              setRefiningAssetIndex(i);
                              setIsRefineModalOpen(true);
                            }}
                            className="px-4 py-1.5 bg-white rounded-[4px] text-[10px] font-black uppercase tracking-widest text-[#1D3557] hover:bg-brand-blue hover:text-white transition-all shadow-lg"
                          >
                            Edit Visual
                          </button>
                        </div>
                        <button
                          onClick={() => toggleBackgroundSelection(bg.url)}
                          className="text-[9px] font-bold text-white/70 hover:text-rose-400 transition-colors uppercase tracking-widest mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Category Link Selector */}
                    <div className="flex flex-col gap-1.5 pointer-events-auto">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Linked Category</label>
                       <Dropdown 
                        options={[
                          { value: "", label: "All Categories (General)" },
                          ...categories.map(cat => ({ value: cat, label: cat }))
                        ]}
                        value={bg.linkedCategory || ""}
                        onChange={(val) => {
                          const newBackgrounds = [...config.backgroundImages];
                          newBackgrounds[i] = { ...newBackgrounds[i], linkedCategory: val || undefined };
                          setConfig({ ...config, backgroundImages: newBackgrounds });
                        }}
                        size="sm"
                      />
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
              <button
                onClick={() => setIsBackgroundModalOpen(true)}
                className="min-w-[240px] h-[150px] aspect-[16/10] rounded-[6px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-indigo-200 transition-colors bg-indigo-50/10 group mt-0"
              >
                <Icon name="circle-plus" folder="dashboardIcon" size="md" className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Add Visual</span>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Section 3: Featured Items Picker */}
            <section className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-6 xl:col-span-2">
              <h3 className="text-lg font-black text-[#1D3557] flex flex-col gap-6">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <span className="w-8 h-8 rounded-[6px] bg-emerald-50 flex items-center justify-center text-xs">03</span>
                    Featured Inventory
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1.5 ">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none italic">Targeting Atmosphere</span>
                       <Dropdown 
                         options={[
                           { value: "global", label: "Global Sequence (Default)" },
                           ...config.backgroundImages.map((bg, i) => ({ value: i.toString(), label: `Atmosphere ${i + 1}` }))
                         ]}
                         value={activeVisualIndex === null ? "global" : activeVisualIndex.toString()}
                         onChange={(val) => setActiveVisualIndex(val === "global" ? null : parseInt(val))}
                         size="sm"
                         className="min-w-[180px]"
                       />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-tight">{activeFeaturedItems.length} Selected</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {activeVisualIndex === null ? "Global Display Preset" : `Atmosphere ${activeVisualIndex + 1} Layout Override`}
                    </span>
                    {activeVisualIndex !== null && config.backgroundImages[activeVisualIndex].inventoryLayout && (
                      <span className="text-[9px] font-bold text-brand-blue-light uppercase tracking-widest bg-brand-blue/5 px-2 py-0.5 rounded-[4px]">Active Override</span>
                    )}
                  </div>
                  <TabFilter
                    id="inventory-display-presets"
                    tabs={activeVisualIndex === null 
                      ? ["Cinematic List", "Asset Grid", "Scrolling Strip"]
                      : ["Default", "Cinematic List", "Asset Grid", "Scrolling Strip"]
                    }
                    activeTab={
                      activeVisualIndex === null 
                        ? (config.inventoryLayout === "list" ? "Cinematic List" : config.inventoryLayout === "grid" ? "Asset Grid" : "Scrolling Strip")
                        : (config.backgroundImages[activeVisualIndex].inventoryLayout === "list" ? "Cinematic List" :
                           config.backgroundImages[activeVisualIndex].inventoryLayout === "grid" ? "Asset Grid" :
                           config.backgroundImages[activeVisualIndex].inventoryLayout === "strip" ? "Scrolling Strip" : "Default")
                    }
                    onChange={(tab) => {
                      const layout = tab === "Cinematic List" ? "list" : tab === "Asset Grid" ? "grid" : tab === "Scrolling Strip" ? "strip" : undefined;
                      if (activeVisualIndex === null) {
                        setConfig({ ...config, inventoryLayout: layout || "list" });
                      } else {
                        const newBgs = [...config.backgroundImages];
                        newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], inventoryLayout: layout };
                        setConfig({ ...config, backgroundImages: newBgs });
                      }
                    }}
                  />
                </div>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {productsData.map((product) => {
                  const isSelected = activeFeaturedItems.some(p => p.id === product.id);
                  return (
                    <button
                      key={product.id}
                      onClick={() => toggleProductSelection(product)}
                      className={`p-3 rounded-[6px] border transition-all flex flex-col gap-3 group relative
                          ${isSelected ? "border-brand-blue bg-blue-50/20" : "border-gray-50 bg-white hover:border-blue-100"}
                        `}
                    >
                      <div className="relative aspect-square rounded-[6px] bg-white border border-gray-50 flex items-center justify-center overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                        <div className="absolute top-2 right-2 z-10">
                          <Checkbox checked={isSelected} onChange={() => { }} size="md" />
                        </div>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-bold text-[#1D3557] truncate">{product.name}</span>
                        <span className="text-[9px] font-black text-brand-blue uppercase">{product.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section 4: Item Arrangement */}
            <section className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-6 xl:col-span-1">
              <h3 className="text-lg font-black text-[#1D3557] flex items-center gap-2">
                <span className="w-8 h-8 rounded-[6px] bg-orange-50 text-orange-500 flex items-center justify-center text-xs">04</span>
                Marketing Arrangement
              </h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  {config.showTitle && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Main Header</span>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-[4px] text-xs font-bold text-brand-blue">
                        {config.title} <span className="text-emerald-500">{config.titleHighlight}</span>
                      </div>
                    </div>
                  )}

                  {config.showStats && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Impact Stats</span>
                      <div className="flex bg-gray-50 border border-gray-200 p-4 rounded-[6px] items-center gap-4">
                        <Icon name="verified" folder="icon" size="sm" className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                          {config.stats}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    {activeVisualIndex === null ? "Global Inventory Sequence" : `Atmosphere ${activeVisualIndex + 1} Selection`}
                  </span>
                  <Reorder.Group
                    axis="y"
                    values={activeFeaturedItems}
                    onReorder={(newOrder) => {
                      if (activeVisualIndex === null) {
                        setConfig({ ...config, featuredItems: newOrder });
                      } else {
                        const newBgs = [...config.backgroundImages];
                        newBgs[activeVisualIndex] = { ...newBgs[activeVisualIndex], featuredItems: newOrder };
                        setConfig({ ...config, backgroundImages: newBgs });
                      }
                    }}
                    className="flex flex-col gap-3"
                  >
                    {activeFeaturedItems.map((item) => (
                      <Reorder.Item
                        key={item.id}
                        value={item}
                        className="p-4 bg-white rounded-[6px] border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing flex items-center justify-between group hover:border-brand-blue transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[6px] bg-gray-50 p-1">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#1D3557]">{item.name}</span>
                          </div>
                        </div>
                        <Icon name="Frame" folder="dashboardIcon" size="sm" className="text-gray-300 group-hover:text-brand-blue transition-colors" />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Background Library Modal */}
      <Modal
        isOpen={isBackgroundModalOpen}
        onClose={() => {
          setIsBackgroundModalOpen(false);
          setReplacingAssetIndex(null);
        }}
        title={replacingAssetIndex !== null ? "Replace Atmosphere Visual" : "Atmospheric Visual Library"}
        size="lg"
      >
        <div className="flex flex-col gap-6">
          {/* Tab Navigation */}
          <TabFilter
            id="library-source-filter"
            tabs={["Ambient Gallery", "Store Products", "Custom URL", "Upload Device"]}
            activeTab={
              backgroundModalTab === "ambient" ? "Ambient Gallery" :
                backgroundModalTab === "products" ? "Store Products" :
                  backgroundModalTab === "url" ? "Custom URL" : "Upload Device"
            }
            onChange={(tab) => setBackgroundModalTab(
              tab === "Ambient Gallery" ? "ambient" :
                tab === "Store Products" ? "products" :
                  tab === "Custom URL" ? "url" : "upload"
            )}
            fullWidth={true}
          />

          {/* Tab Content */}
          <div className="min-h-[400px] flex flex-col gap-6">
            {backgroundModalTab === "ambient" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableBackgrounds.map((bg, i) => {
                  const isSelected = config.backgroundImages.some(img => img.url === bg);
                  const order = config.backgroundImages.findIndex(img => img.url === bg) + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectBackground(bg)}
                      className={`group relative aspect-[16/10] rounded-[6px] overflow-hidden border-4 transition-all
                          ${isSelected ? "border-brand-blue ring-8 ring-blue-50 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100 shadow-sm"}
                        `}
                    >
                      <img src={bg} alt="Background" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute top-3 right-3 p-1.5 bg-brand-blue rounded-[6px] text-white shadow-xl overflow-hidden flex items-center gap-2 px-3">
                          <Checkbox checked={true} onChange={() => { }} size="md" className="!p-0" />
                          <span className="text-[10px] font-black uppercase">{order}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {backgroundModalTab === "products" && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {productsData.map((product) => {
                  const isSelected = config.backgroundImages.some(img => img.url === product.image);
                  const order = config.backgroundImages.findIndex(img => img.url === product.image) + 1;
                  return (
                    <button
                      key={product.id}
                      onClick={() => handleSelectBackground(product.image)}
                      className={`group relative aspect-square rounded-[6px] overflow-hidden border-2 transition-all p-2 flex flex-col gap-2
                          ${isSelected ? "border-brand-blue bg-blue-50/20 ring-4 ring-blue-50" : "border-gray-200 bg-white hover:border-blue-200 shadow-sm"}
                        `}
                    >
                      <div className="relative flex-1 bg-white rounded-[4px] overflow-hidden flex items-center justify-center p-2">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 p-1 bg-brand-blue rounded-[4px] text-white shadow-lg overflow-hidden flex items-center gap-1.5 px-2">
                            <Checkbox checked={true} onChange={() => { }} size="md" className="!p-0" />
                            <span className="text-[9px] font-black uppercase">{order}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col text-left px-1">
                        <span className="text-[10px] font-bold text-[#1D3557] truncate">{product.name}</span>
                        <span className="text-[8px] font-black text-brand-blue uppercase">{product.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {backgroundModalTab === "url" && (
              <div className="flex flex-col gap-8 items-center justify-center py-10 px-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-[20px] flex items-center justify-center text-indigo-500 mb-2">
                  <Icon name="link-external" folder="dashboardIcon" size="lg" />
                </div>
                <div className="flex flex-col gap-2 text-center max-w-sm">
                  <h4 className="text-base font-black text-[#1D3557]">Import Remote Visual</h4>
                  <p className="text-xs text-gray-400 font-medium">Paste a direct link to a high-resolution image to inject it into your login sequence.</p>
                </div>
                <div className="w-full flex gap-3">
                  <Input
                    placeholder="https://images.unsplash.com/photo-..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    containerClassName="flex-1"
                    className="bg-gray-50 border-gray-200"
                  />
                  <Button
                    variant="primary"
                    shape="rounded-sm"
                    onClick={() => {
                      if (customUrl) {
                        handleSelectBackground(customUrl);
                        setCustomUrl("");
                      }
                    }}
                    disabled={!customUrl}
                  >
                    Add to Library
                  </Button>
                </div>

                {/* Preview of added URLs */}
                <div className="w-full flex flex-col gap-4 mt-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active URL Sources</span>
                  <div className="grid grid-cols-2 gap-4">
                    {config.backgroundImages.filter(bg => bg.url.startsWith("http")).map((asset, i) => (
                      <div key={i} className="relative aspect-[16/6] rounded-[6px] overflow-hidden border border-gray-200 shadow-sm group">
                        <img src={asset.url} alt="Custom" className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleBackgroundSelection(asset.url)}
                          className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Icon name="Delete" folder="dashboardIcon" size="xs" className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {backgroundModalTab === "upload" && (
              <div className="flex flex-col gap-8 items-center justify-center py-10 px-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files) {
                      handleFileUpload(e.dataTransfer.files);
                    }
                  }}
                  className={`w-full border-2 border-dashed rounded-[20px] p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
                    ${isDragging 
                      ? "border-brand-blue bg-blue-50/50 scale-[1.02] shadow-xl" 
                      : "border-gray-200 bg-transparent hover:border-brand-blue hover:bg-blue-50/20 shadow-sm"}
                  `}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-brand-blue transition-all">
                    <Icon name="cloud_upload" folder="icon" size="md" />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-sm font-black text-[#1D3557]">Click or drag to upload from device</span>
                    <span className="text-[10px] font-bold text-gray-400 italic">Max 5MB per image recommended</span>
                  </div>
                </div>

                {/* Preview of Uploaded Images */}
                <div className="w-full flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Device Uploads</span>
                    <button
                      onClick={() => setConfig({ ...config, backgroundImages: config.backgroundImages.filter(bg => !bg.url.startsWith("data:")) })}
                      className="text-[9px] font-bold text-rose-500 hover:underline"
                    >
                      Clear all uploads
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {config.backgroundImages.filter(bg => bg.url.startsWith("data:")).map((asset, i) => (
                      <div key={i} className="relative aspect-square rounded-[6px] overflow-hidden border border-gray-200 group">
                        <img src={asset.url} alt="Upload" className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleBackgroundSelection(asset.url)}
                          className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Icon name="Delete" folder="dashboardIcon" size="xs" className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
            <button
              onClick={() => setConfig({ ...config, backgroundImages: [{ url: availableBackgrounds[0], positionX: 50, positionY: 50 }] })}
              className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors"
            >
              Reset to Default
            </button>
            <Button variant="primary" shape="rounded-sm" onClick={() => setIsBackgroundModalOpen(false)}>
              Confirm Library Selection
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onConfirm={handleSave}
        title="Deploy Advert Policy"
        message="Are you sure you want to deploy these changes? This will immediately update the login page branding and featured products for all users."
        confirmText="Yes, deploy configuration"
        type="success"
      />

      {/* Cinematic Focal Point Editor Modal */}
      {isRefineModalOpen && refiningAssetIndex !== null && (
        <Modal
          isOpen={isRefineModalOpen}
          onClose={() => setIsRefineModalOpen(false)}
          title="Refine Cinematic Focus"
          size="lg"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-black text-[#1D3557] uppercase tracking-widest">Master Your Framing</h4>
              <p className="text-xs text-gray-400 font-medium">Drag the visual within the viewfinder below to define its center of attention.</p>
            </div>

            <div className="relative aspect-[16/9] bg-gray-900 rounded-[12px] overflow-hidden shadow-2xl group cursor-move">
              {/* Mock Browser UI Overlay */}
              <div className="absolute top-0 inset-x-0 h-8 bg-black/40 backdrop-blur-md z-20 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
                </div>
                <div className="flex-1 max-w-[400px] h-4 bg-white/10 rounded-[4px] mx-auto" />
              </div>

              <motion.div
                className="absolute inset-0 z-10 select-none"
                onPan={(_, info) => {
                  const bounds = document.getElementById('focal-viewport')?.getBoundingClientRect();
                  if (!bounds) return;

                  // Speed up dragging response
                  const sensitivity = 0.5;
                  const deltaX = (info.delta.x / bounds.width) * 100 * sensitivity;
                  const deltaY = (info.delta.y / bounds.height) * 100 * sensitivity;

                  const currentX = config.backgroundImages[refiningAssetIndex].positionX;
                  const currentY = config.backgroundImages[refiningAssetIndex].positionY;

                  handleUpdateFocalPoint(
                    refiningAssetIndex,
                    Math.max(0, Math.min(100, currentX - deltaX)),
                    Math.max(0, Math.min(100, currentY - deltaY))
                  );
                }}
                id="focal-viewport"
              >
                <img
                  src={config.backgroundImages[refiningAssetIndex].url}
                  alt="Preview"
                  className="w-full h-full object-cover pointer-events-none scale-150"
                  style={{
                    objectPosition: `${config.backgroundImages[refiningAssetIndex].positionX}% ${config.backgroundImages[refiningAssetIndex].positionY}%`
                  }}
                />

                {/* Visual focus guides */}
                <div className="absolute inset-0 pointer-events-none border border-white/20">
                  <div className="absolute inset-x-0 top-1/3 border-t border-white/10" />
                  <div className="absolute inset-x-0 top-2/3 border-t border-white/10" />
                  <div className="absolute inset-y-0 left-1/3 border-l border-white/10" />
                  <div className="absolute inset-y-0 left-2/3 border-l border-white/10" />
                </div>

                {/* Focus Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-blue shadow-[0_0_20px_rgba(0,119,255,0.5)] flex items-center justify-center">
                    <div className="w-1 h-1 bg-brand-blue rounded-full" />
                  </div>
                </div>
              </motion.div>

              <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-[4px] text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                  X: {Math.round(config.backgroundImages[refiningAssetIndex].positionX)}% | Y: {Math.round(config.backgroundImages[refiningAssetIndex].positionY)}%
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
              <Button
                variant="outline"
                onClick={() => handleUpdateFocalPoint(refiningAssetIndex, 50, 50)}
              >
                Center Image
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsRefineModalOpen(false)}
              >
                Save Cinematic Framing
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
