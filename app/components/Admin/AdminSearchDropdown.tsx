"use client";

import React from "react";
import { Icon } from "../Icon";
import { DropdownMenu } from "../Dropdown/DropdownMenu";

interface SearchResult {
  id: number;
  title: string;
  subtitle: string;
  type: "product" | "order" | "customer";
  image?: string;
  meta?: string;
}

const mockResults: SearchResult[] = [
  { id: 1, title: "iPhone 13 Pro Max", subtitle: "Electronics / Smartphones", type: "product", image: "/dashboardImage/Electronics.png", meta: "₦450,000" },
  { id: 2, title: "Wireless Headphones", subtitle: "Accessories", type: "product", image: "/dashboardImage/Headphones.png", meta: "₦25,000" },
  { id: 3, title: "Order #TXN-9023", subtitle: "Robert Fox", type: "order", meta: "Pending" },
  { id: 4, title: "Order #TXN-8812", subtitle: "Eleanor Pena", type: "order", meta: "Complete" },
  { id: 5, title: "Guy Hawkins", subtitle: "guy.hawkins@example.com", type: "customer" },
  { id: 6, title: "Theresa Webb", subtitle: "theresa.webb@gmail.com", type: "customer" },
];

interface AdminSearchDropdownProps {
  query: string;
}

export const AdminSearchDropdown: React.FC<AdminSearchDropdownProps> = ({ query }) => {
  const filteredResults = query 
    ? mockResults.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.subtitle.toLowerCase().includes(query.toLowerCase()))
    : mockResults.slice(0, 4); // Show "Recent/Popular" if empty

  const categories = Array.from(new Set(filteredResults.map(r => r.type)));

  return (
    <div className="absolute top-full left-0 pt-4 z-50 cursor-default">
      <DropdownMenu width={480} className="shadow-2xl border-gray-200 p-0 overflow-hidden max-h-[600px] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
           <div className="flex flex-col gap-0.5">
              <span className="font-black text-[#1D3557] text-sm tracking-tight">
                 {query ? `Search results for "${query}"` : "Recent Searches"}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                 {filteredResults.length} matches found
              </span>
           </div>
           {!query && <button className="text-[10px] font-black text-brand-blue uppercase hover:underline">Clear History</button>}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
           {categories.length > 0 ? (
             categories.map(cat => (
               <div key={cat} className="mb-4 last:mb-0">
                  <h4 className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat}s</h4>
                  <div className="flex flex-col gap-0.5">
                     {filteredResults.filter(r => r.type === cat).map(item => (
                       <button key={item.id} className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-brand-blue-light group transition-all text-left">
                          <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden
                             ${item.type === 'product' ? 'bg-white' : 'bg-gray-50'}
                          `}>
                             {item.image ? (
                               <img src={item.image} alt="" className="w-full h-full object-contain" />
                             ) : (
                               <Icon 
                                 name={item.type === 'order' ? 'Cart' : 'people_alt'} 
                                 folder={item.type === 'order' ? 'dashboardIcon' : 'icon'} 
                                 size="sm" 
                                 className="text-gray-400" 
                               />
                             )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                             <span className="text-[13px] font-black text-[#1D3557] group-hover:text-brand-blue truncate">{item.title}</span>
                             <span className="text-[11px] font-bold text-gray-400 truncate">{item.subtitle}</span>
                          </div>
                          {item.meta && (
                            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md
                               ${item.meta === 'Complete' ? 'bg-emerald-50 text-emerald-500' : 
                                 item.meta === 'Pending' ? 'bg-amber-50 text-amber-500' : 'text-brand-blue'}
                            `}>
                               {item.meta}
                            </span>
                          )}
                       </button>
                     ))}
                  </div>
               </div>
             ))
           ) : (
             <div className="py-12 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-200 shadow-sm">
                   <Icon name="search-01" folder="dashboardIcon" size="lg" />
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-sm font-black text-[#1D3557]">No matches found</span>
                   <span className="text-xs font-bold text-gray-400 max-w-[200px]">Try adjusting your search query or exploring our modules.</span>
                </div>
             </div>
           )}
        </div>

        <button className="h-14 border-t border-gray-50 flex items-center justify-center gap-2 group hover:bg-gray-50 transition-all">
           <span className="text-[11px] font-black text-[#1D3557] group-hover:text-brand-blue uppercase tracking-widest">View All Search Results</span>
           <Icon name="arrow_forward" folder="icon" size="xs" className="text-gray-300 group-hover:text-brand-blue transition-all translate-x-0 group-hover:translate-x-1" />
        </button>
      </DropdownMenu>
    </div>
  );
};
