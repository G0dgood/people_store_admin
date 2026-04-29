import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { DropdownMenu, DropdownItem, DropdownFooterAction } from "../Dropdown/DropdownMenu";
import { useGetPublicProductsQuery } from "@/lib/redux/services/boutiqueApi";
import { formatPrice } from "@/app/utils/formatPrice";

interface SearchAutocompleteProps {
  searchQuery: string;
  isVisible: boolean;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ searchQuery, isVisible }) => {
  const router = useRouter();
  
  const { data: productsResponse, isLoading } = useGetPublicProductsQuery(
    { search: searchQuery, limit: 6 },
    { skip: searchQuery.length < 2 || !isVisible }
  );

  const products = productsResponse?.data?.products || [];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute top-full left-0 pt-3 w-full z-[100]">
          <DropdownMenu width="100%" className="shadow-2xl border border-gray-200 rounded-xl overflow-hidden max-h-[450px] overflow-y-auto">
            {searchQuery.length >= 2 ? (
              <>
                <div className="px-5 py-3 text-[10px] font-black text-gray-400 border-b border-gray-50 uppercase tracking-[0.2em] flex justify-between items-center bg-gray-50/30">
                  <span>Top Results for "{searchQuery}"</span>
                  {isLoading && <span className="animate-pulse text-brand-gold">Searching...</span>}
                </div>
                
                {products.length > 0 ? (
                  <div className="flex flex-col">
                    {products.map((product) => (
                      <div 
                        key={product._id}
                        onClick={() => router.push(`/products/detail?id=${product._id}`)}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 group"
                      >
                        <div className="w-12 h-12 relative flex-shrink-0 bg-white border border-gray-100 p-1 group-hover:border-brand-gold/30 transition-colors">
                          <Image 
                            src={product.productImage || "/placeholder.png"} 
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs font-bold text-gray-900 truncate group-hover:text-brand-gold transition-colors">{product.name}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category?.name || "Boutique"}</span>
                        </div>
                        <span className="text-xs font-black text-gray-900">{formatPrice(product.price)}</span>
                      </div>
                    ))}
                    <DropdownFooterAction
                      label={`Explore all results for ${searchQuery}`}
                      onClick={() => router.push(`/products?search=${encodeURIComponent(searchQuery)}`)}
                      icon="arrow_forward"
                    />
                  </div>
                ) : !isLoading ? (
                  <div className="px-5 py-8 text-center flex flex-col gap-2">
                    <span className="text-sm font-bold text-gray-900">No boutiques found</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Try searching for something else</span>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="px-5 py-3 text-[10px] font-black text-gray-400 border-b border-gray-50 uppercase tracking-[0.2em] bg-gray-50/30">
                  Trending Searches
                </div>
                <DropdownItem 
                  label="Signature Oud" 
                  subtext="Trending Now" 
                  icon="trending_up" 
                  onSelect={() => router.push('/products?search=Oud')}
                />
                <DropdownItem 
                  label="Summer Mist Collection" 
                  subtext="Most Popular" 
                  icon="trending_up" 
                  onSelect={() => router.push('/products?search=Mist')}
                />
                <DropdownItem 
                  label="Luxury Gift Sets" 
                  subtext="Curated for you" 
                  icon="trending_up" 
                  onSelect={() => router.push('/gift-boxes')}
                />
                <div className="px-5 py-3 text-[10px] font-black text-gray-400 border-t border-gray-50 uppercase tracking-[0.2em] mt-2 bg-gray-50/30">
                  Popular Categories
                </div>
                <DropdownItem label="Fragrance Boutique" onSelect={() => router.push('/products?category=Fragrances')} />
                <DropdownItem label="Skin Care Rituals" onSelect={() => router.push('/products?category=Skin Care')} />
              </>
            )}
          </DropdownMenu>
        </div>
      )}
    </AnimatePresence>
  );
};
