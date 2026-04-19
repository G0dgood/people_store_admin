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
      {isVisible && searchQuery.length > 0 && (
        <div className="absolute top-full left-0 pt-3 w-full z-[100]">
          <DropdownMenu width="100%" className="shadow-xl border border-gray-200">
            <div className="px-4 py-2 text-xs font-bold text-gray-400 border-b border-gray-50 uppercase tracking-wider">
              Top Results for "{searchQuery}"
            </div>
            <DropdownItem label={`${searchQuery} case for iPhone`} subtext="In Accessories" icon="search" />
            <DropdownItem label={`${searchQuery} wireless headphones`} subtext="In Electronics" icon="search" />
            <DropdownItem label={`Blue ${searchQuery}`} subtext="In Fashion" icon="search" />
            <DropdownFooterAction 
              label={`View all results for ${searchQuery}`} 
              onClick={() => router.push('/products')} 
              icon="arrow_forward" 
            />
          </DropdownMenu>
        </div>
      )}
    </AnimatePresence>
  );
};
