import React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DropdownMenu, DropdownItem, DropdownFooterAction } from "../Dropdown/DropdownMenu";

interface SearchAutocompleteProps {
  searchQuery: string;
  isVisible: boolean;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ searchQuery, isVisible }) => {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute top-full left-0 pt-3 w-full z-[100]">
          <DropdownMenu width="100%" className="shadow-2xl border border-gray-200 rounded-xl overflow-hidden">
            {searchQuery.length > 0 ? (
              <>
                <div className="px-5 py-3 text-[10px] font-black text-gray-400 border-b border-gray-50 uppercase tracking-[0.2em]">
                  Top Results for "{searchQuery}"
                </div>
                <DropdownItem label={`${searchQuery} in Fragrances`} subtext="Collection 2024" icon="search" />
                <DropdownItem label={`${searchQuery} Luxury Set`} subtext="New Arrivals" icon="search" />
                <DropdownItem label={`Boutique ${searchQuery}`} subtext="Exclusive" icon="search" />
                <DropdownFooterAction
                  label={`Explore all results for ${searchQuery}`}
                  onClick={() => router.push('/products')}
                  icon="arrow_forward"
                />
              </>
            ) : (
              <>
                <div className="px-5 py-3 text-[10px] font-black text-gray-400 border-b border-gray-50 uppercase tracking-[0.2em]">
                  Trending Searches
                </div>
                <DropdownItem label="Signature Oud" subtext="Trending Now" icon="trending_up" />
                <DropdownItem label="Summer Mist Collection" subtext="Most Popular" icon="trending_up" />
                <DropdownItem label="Luxury Gift Sets" subtext="Curated for you" icon="trending_up" />
                <div className="px-5 py-3 text-[10px] font-black text-gray-400 border-t border-gray-50 uppercase tracking-[0.2em] mt-2">
                  Popular Categories
                </div>
                <DropdownItem label="Fragrance Boutique" />
                <DropdownItem label="Skin Care Rituals" />
              </>
            )}
          </DropdownMenu>
        </div>
      )}
    </AnimatePresence>
  );
};
