"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdvertConfig, AdvertConfig, AdvertItem } from "@/app/utils/advertState";

export const LoginAdvert = () => {
 const [config, setConfig] = useState<AdvertConfig | null>(null);
 const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
 const [slideSpecificItems, setSlideSpecificItems] = useState<AdvertItem[] | undefined>(undefined);
 const [activeLayoutOverride, setActiveLayoutOverride] = useState<"list" | "grid" | "strip" | undefined>(undefined);
 const [overrides, setOverrides] = useState<{
  title?: string;
  titleHighlight?: string;
  description?: string;
  stats?: string;
 }>({});

 useEffect(() => {
  setConfig(getAdvertConfig());

  const handleUpdate = () => {
   setConfig(getAdvertConfig());
  };

  const handleSlideChange = (e: any) => {
   setActiveCategory(e.detail.category);
   setSlideSpecificItems(e.detail.featuredItems);
   setActiveLayoutOverride(e.detail.inventoryLayout);
   setOverrides({
    title: e.detail.title,
    titleHighlight: e.detail.titleHighlight,
    description: e.detail.description,
    stats: e.detail.stats
   });
  };

  window.addEventListener("advertConfigUpdated", handleUpdate);
  window.addEventListener("advertSlideChanged", handleSlideChange);
  return () => {
   window.removeEventListener("advertConfigUpdated", handleUpdate);
   window.removeEventListener("advertSlideChanged", handleSlideChange);
  };
 }, []);

 if (!config) return null;

 const filteredItems = slideSpecificItems && slideSpecificItems.length > 0
  ? slideSpecificItems
  : (activeCategory
   ? config.featuredItems.filter(item => item.category === activeCategory)
   : config.featuredItems);

 const activeLayout = activeLayoutOverride || config.inventoryLayout;

 const displayCopy = {
  title: overrides.title || config.title,
  titleHighlight: overrides.titleHighlight || config.titleHighlight,
  description: overrides.description || config.description,
  stats: overrides.stats || config.stats
 };

 // Sync featured items for initial slide if config is present but overrides aren't yet
 const itemsToDisplay = (slideSpecificItems && slideSpecificItems.length > 0)
  ? slideSpecificItems
  : (activeCategory
   ? config.featuredItems.filter(item => item.category === activeCategory)
   : (config.backgroundImages?.[0]?.featuredItems || config.featuredItems));

 return (
  <motion.div
   initial={{ opacity: 0, x: 30 }}
   animate={{ opacity: 1, x: 0 }}
   transition={{ delay: 0.3, duration: 0.8 }}
   className="relative z-10 hidden lg:flex flex-col gap-8 max-w-[600px] text-right items-end"
  >
   {(config.showTitle || config.showHighlight || config.showDescription) && (
    <div className="flex flex-col gap-4">
     <div className="w-16 h-1 bg-white rounded-full ml-auto" />
     <AnimatePresence mode="wait">
      {(config.showTitle || config.showHighlight) && (
       <motion.div
        key={displayCopy.title + displayCopy.titleHighlight}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
       >
        <h1 className="text-6xl xl:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl">
         {config.showTitle && <span>{displayCopy.title} <br /></span>}
         {config.showHighlight && <span className="text-brand-gold">{displayCopy.titleHighlight}</span>}
        </h1>
       </motion.div>
      )}
     </AnimatePresence>

     <AnimatePresence mode="wait">
      {config.showDescription && (
       <motion.p
        key={displayCopy.description}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-white/80 text-xl font-medium max-w-lg mt-2 drop-shadow-lg leading-relaxed"
       >
        {displayCopy.description}
       </motion.p>
      )}
     </AnimatePresence>
    </div>
   )}

   {/* Dynamic Feature List (Featured Products) */}
   <div className="mt-4 w-full ml-auto">
    {activeLayout === "list" && (
     <div className="flex flex-col gap-6 max-w-md ml-auto">
      <AnimatePresence mode="popLayout">
       {itemsToDisplay.map((item, i) => (
        <motion.div
         key={item._id || item.id || `list-${i}`}
         initial={{ opacity: 0, scale: 0.9, x: 20 }}
         animate={{ opacity: 1, scale: 1, x: 0 }}
         exit={{ opacity: 0, scale: 0.8, x: -20 }}
         transition={{ delay: i * 0.05 }}
         whileHover={{ x: -10 }}
         className="flex items-center gap-6 justify-end group cursor-pointer"
        >
         <div className="flex flex-col items-end text-right">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-brand-gold transition-colors">
           {typeof item.category === 'object' ? item.category.name : item.category}
          </span>
          <span className="text-lg font-bold text-white group-hover:text-brand-gold-light transition-colors">
           {item.name}
          </span>
          <span className="text-[10px] font-black text-white/40 group-hover:text-white/80 transition-opacity">
           FEATURED SELECTION • {item.price}
          </span>
         </div>

         <div className="w-16 h-16 rounded-[6px] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all overflow-hidden p-2 shadow-2xl">
          <img src={item.productImage || item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-lg" />
         </div>
        </motion.div>
       ))}
      </AnimatePresence>
     </div>
    )}

    {activeLayout === "grid" && (
     <div className="grid grid-cols-3 gap-3 max-w-2xl ml-auto">
      <AnimatePresence mode="popLayout">
       {itemsToDisplay.slice(0, 8).map((item, i) => (
        <motion.div
         key={item._id || item.id || `grid-${i}`}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.9 }}
         transition={{ delay: i * 0.05 }}
         whileHover={{ y: -5, scale: 1.05 }}
         className="p-3 rounded-[6px] bg-white/10 backdrop-blur-md border border-white/20 flex flex-col gap-2 group cursor-pointer"
        >
         <div className="aspect-[4/3] bg-white/10 rounded-[4px] p-2 flex items-center justify-center overflow-hidden">
          <img src={item.productImage || item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-500" />
         </div>
         <div className="flex flex-col text-right">
          <span className="text-[8px] font-black text-brand-gold uppercase tracking-widest">
           {typeof item.category === 'object' ? item.category.name : item.category}
          </span>
          <span className="text-[11px] font-bold text-white truncate">{item.name}</span>
          <span className="text-[10px] font-black text-white/60">{item.price}</span>
         </div>
        </motion.div>
       ))}
      </AnimatePresence>
     </div>
    )}

    {activeLayout === "strip" && (
     <div className="fixed bottom-24 inset-x-0 px-12 z-30 flex justify-center">
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 p-2 rounded-full overflow-hidden">
       <AnimatePresence mode="popLayout">
        {itemsToDisplay.map((item, i) => (
         <motion.div
          key={item._id || item.id || `strip-${i}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer group"
         >
          <div className="w-8 h-8 rounded-full bg-white/20 p-1 flex items-center justify-center overflow-hidden text-center">
           <img src={item.productImage || item.image} alt={item.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
           <span className="text-[10px] font-bold text-white group-hover:text-brand-gold transition-colors">{item.name}</span>
           <span className="text-[8px] font-black text-white/40 uppercase">{item.price}</span>
          </div>
         </motion.div>
        ))}
       </AnimatePresence>
      </div>
     </div>
    )}

    {itemsToDisplay.length === 0 && (
     <p className="text-white/30 text-xs font-bold uppercase tracking-widest italic pt-10 text-right">
      No items in {activeCategory} category
     </p>
    )}
   </div>

   <AnimatePresence mode="wait">
    {config.showStats && (
     <motion.div
      key={displayCopy.stats}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12 p-6 rounded-[6px] bg-white/5 border border-white/10 backdrop-blur-sm text-right max-w-sm"
     >
      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-loose">
       {displayCopy.stats}
      </p>
     </motion.div>
    )}
   </AnimatePresence>
  </motion.div>
 );
};
