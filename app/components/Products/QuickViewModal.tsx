"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";
import Image from "next/image";
import Link from "next/link";
import { Rating, FavoriteButton } from "../Other";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiMinus, HiPlus } from "react-icons/hi2";
import { QuickViewSkeleton } from "../Skeleton/QuickViewSkeleton";

interface QuickViewModalProps {
   isOpen: boolean;
   onClose: () => void;
   product: any;
   isLoading?: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
   isOpen,
   onClose,
   product,
   isLoading = false,
}) => {
   const { addToCart } = useCart();
   const [quantity, setQuantity] = useState(1);
   const [selectedImage, setSelectedImage] = useState(0);

   if (!isOpen) return null;

   const handleAddToCart = () => {
      addToCart({
         id: product.id,
         title: product.title,
         price: product.price,
         image: product.image,
      });
      toast.success("Added to cart");
      onClose();
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         size="xl"
         className="!p-0 overflow-hidden"
      >
         {isLoading || !product ? (
            <QuickViewSkeleton />
         ) : (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-hidden">
               {/* Left: Image Section */}
               <div className="w-full md:w-1/2 bg-gray-50/50 p-6 md:p-10 flex flex-col gap-6 items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="relative w-full aspect-square bg-white shadow-sm border border-gray-100 p-8 flex items-center justify-center overflow-hidden">
                     <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-full"
                     >
                        <Image
                           src={product.image}
                           alt={product.title}
                           fill
                           className="object-contain"
                           sizes="(max-width: 768px) 100vw, 50vw"
                        />
                     </motion.div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-3">
                     {[0, 1, 2].map((i) => (
                        <div
                           key={i}
                           className={`w-16 h-16 border-2 cursor-pointer p-2 bg-white transition-all ${selectedImage === i ? 'border-brand-gold shadow-md' : 'border-gray-100 opacity-60'}`}
                           onClick={() => setSelectedImage(i)}
                        >
                           <div className="relative w-full h-full">
                              <Image src={product.image} alt="thumbnail" fill className="object-contain" sizes="64px" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right: Content Section */}
               <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Masterpiece Curation</span>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={onClose}
                           className="!p-2 text-gray-400 hover:text-gray-900 shadow-none border-none"
                        >
                           <HiXMark size={20} />
                        </Button>
                     </div>
                     <h2 className="text-2xl md:text-3xl font-outfit font-light text-gray-900 uppercase tracking-wide leading-tight">
                        {product.title}
                     </h2>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                           <Rating value={product.rating} />
                           <span className="text-brand-gold text-sm font-bold ml-1">{product.rating}</span>
                        </div>
                        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{product.orders} successful orders</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-3">
                        <span className="text-3xl font-outfit font-bold text-gray-900">{product.price}</span>
                        {product.originalPrice && (
                           <span className="text-gray-400 line-through text-lg font-medium">{product.originalPrice}</span>
                        )}
                     </div>
                     <div className="flex items-center gap-2">
                        <Icon
                           name={product.stockStatus === "Out of Stock" ? "close" : "check"}
                           size="xs"
                           className={product.stockStatus === "Out of Stock" ? "text-rose-500" : "text-brand-gold"}
                        />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.stockStatus === "Out of Stock" ? "text-rose-500" : "text-brand-gold"}`}>
                           {product.stockStatus || "In Stock"} & Ready to Ship
                        </span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4 border-y border-gray-100 py-6">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand: {product.brand}</span>
                        <p className="text-gray-600 text-sm leading-relaxed font-light line-clamp-3">
                           {product.description}
                        </p>
                     </div>
                  </div>

                  {(product.size || product.volume) && (
                     <div className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Available Sizes</h4>
                        <div className="flex flex-wrap gap-2">
                           {(product.size || product.volume).split(",").map((s: string, idx: number) => (
                              <button
                                 key={idx}
                                 className="px-4 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors"
                              >
                                 {s.trim()}
                              </button>
                           ))}
                        </div>
                     </div>
                  )}

                  <div className="flex flex-col gap-6 mt-auto">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 h-14 overflow-hidden">
                           <Button
                              variant="ghost"
                              className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors !p-0 border-none rounded-none"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                           >
                              <HiMinus size={16} />
                           </Button>
                           <span className="w-14 h-full flex items-center justify-center font-bold text-sm border-x border-gray-200">
                              {quantity}
                           </span>
                           <Button
                              variant="ghost"
                              className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors !p-0 border-none rounded-none"
                              onClick={() => setQuantity(quantity + 1)}
                           >
                              <HiPlus size={16} />
                           </Button>
                        </div>
                        <FavoriteButton
                           item={product as any}
                           variant="outline"
                           className="flex-1 h-14 border-gray-200 flex items-center gap-2 justify-center"
                        >
                           <span className="text-[10px] font-bold uppercase tracking-widest">Save for later</span>
                        </FavoriteButton>
                     </div>

                     <Button
                        onClick={handleAddToCart}
                        className="w-full h-16 bg-black text-white hover:bg-brand-gold font-bold uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-[0.98]"
                     >
                        Add to Boutique Bag
                     </Button>

                     <Link
                        href={`/products/detail?id=${product.id}`}
                        onClick={onClose}
                        className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-brand-gold transition-colors mt-2"
                     >
                        View Full Details
                     </Link>
                  </div>
               </div>
            </div>
         )}
      </Modal>
   );
};
