"use client";

import React from "react";
import { DropdownMenu } from "../Dropdown/DropdownMenu";
import { useGetProductsQuery } from "@/lib/redux/services/productApi";
import { useGetOrdersQuery } from "@/lib/redux/services/orderApi";
import { useGetAllCustomersQuery } from "@/lib/redux/services/customerApi";
import Link from "next/link";
import Image from "next/image";
import {
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineSquares2X2,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowRight
} from "react-icons/hi2";

interface SearchResult {
  id: number;
  title: string;
  subtitle: string;
  type: "product" | "order" | "customer" | "module";
  image?: string;
  meta?: string;
  url?: string;
}


const ADMIN_MODULES: SearchResult[] = [
  { id: 903, title: "Product Inventory", subtitle: "Manage products", type: "module", url: "/products" },
  { id: 904, title: "Media Library", subtitle: "Manage files and images", type: "module", url: "/products/media" },
  { id: 905, title: "Customer Directory", subtitle: "Manage users", type: "module", url: "/customers" },
  { id: 906, title: "Staff Management", subtitle: "Admin accounts", type: "module", url: "/users" },
  { id: 907, title: "Marketing Coupons", subtitle: "Discount codes", type: "module", url: "/coupons" },
  { id: 908, title: "Deals & Offers", subtitle: "Promotional campaigns", type: "module", url: "/deals" },
  { id: 909, title: "Advert Management", subtitle: "Control storefront banners", type: "module", url: "/advert" },
  { id: 910, title: "Category Management", subtitle: "Product categories", type: "module", url: "/categories" },
  { id: 911, title: "Brand Management", subtitle: "Product brands", type: "module", url: "/brands" },
  { id: 912, title: "Product Reviews", subtitle: "Customer feedback", type: "module", url: "/reviews" },
  { id: 913, title: "Support Tickets", subtitle: "Customer service", type: "module", url: "/support" },
  { id: 914, title: "Refund Management", subtitle: "Process returns", type: "module", url: "/refunds" },
  { id: 915, title: "Governance & Roles", subtitle: "Access control", type: "module", url: "/roles" },
  { id: 916, title: "Office Locations", subtitle: "Manage store branches", type: "module", url: "/offices" },
];

interface AdminSearchDropdownProps {
  query: string;
}

export const AdminSearchDropdown: React.FC<AdminSearchDropdownProps> = ({ query }) => {
  // Use frontend filtering for instantaneous search feel, or rely on backend if implemented
  const { data: productsRes } = useGetProductsQuery();
  const { data: ordersRes } = useGetOrdersQuery({});
  const { data: customersRes } = useGetAllCustomersQuery();

  const products = (productsRes?.data as any)?.products || [];
  const orders = (ordersRes?.data as any)?.orders || [];
  const customers = customersRes?.data && 'customers' in customersRes.data
    ? customersRes.data.customers
    : (Array.isArray(customersRes?.data) ? customersRes.data : []);

  const dynamicResults: SearchResult[] = [
    ...products.map((p: any) => ({
      id: p._id,
      title: p.name,
      subtitle: p.category?.name || "Product",
      type: "product" as const,
      image: p.productImage,
      meta: `₦${p.price.toLocaleString()}`,
      url: `/products?search=${p.name}`
    })),
    ...orders.map((o: any) => ({
      id: o._id,
      title: `Order #${o.orderId.substring(0, 8)}`,
      subtitle: o.customer?.fullName || "Guest Customer",
      type: "order" as const,
      meta: o.status,
      url: `/orders/${o._id}`
    })),
    ...customers.map((c: any) => ({
      id: c._id,
      title: c.fullName,
      subtitle: c.email,
      type: "customer" as const,
      url: `/customers?search=${c.fullName}`
    })),
    ...ADMIN_MODULES
  ];

  const filteredResults = query
    ? dynamicResults.filter(item =>
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      item.meta?.toLowerCase().includes(query.toLowerCase())
    )
    : dynamicResults.slice(0, 5); // Show "Recent/Popular" if empty

  const categories = Array.from(new Set(filteredResults.map(r => r.type)));

  return (
    <div className="absolute top-full left-0 pt-4 z-50 cursor-default">
      <DropdownMenu width={480} className="shadow-2xl border-gray-200 p-0 overflow-hidden max-h-[600px] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex flex-col gap-0.5">
            <span className="font-black text-[#121212] text-sm tracking-tight">
              {query ? `Search results for "${query}"` : "Recent Searches"}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              {filteredResults.length} matches found
            </span>
          </div>
          {!query && <button className="text-[10px] font-black text-brand-gold uppercase hover:underline">Clear History</button>}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {categories.length > 0 ? (
            categories.map(cat => (
              <div key={cat} className="mb-4 last:mb-0">
                <h4 className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat}s</h4>
                <div className="flex flex-col gap-0.5">
                  {filteredResults.filter(r => r.type === cat).map(item => (
                    <Link key={item.id} href={(item as any).url || "#"} className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-brand-gold-light group transition-all text-left">
                      <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-gray-200   overflow-hidden relative
                             ${item.type === 'product' ? 'bg-white' : 'bg-gray-50'}
                          `}>
                        {item.image ? (
                          <Image src={item.image} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <>
                            {item.type === 'order' && <HiOutlineShoppingCart className="text-gray-400 w-5 h-5" />}
                            {item.type === 'customer' && <HiOutlineUsers className="text-gray-400 w-5 h-5" />}
                            {item.type === 'module' && <HiOutlineSquares2X2 className="text-gray-400 w-5 h-5" />}
                            {item.type === 'product' && !item.image && <HiOutlineCube className="text-gray-400 w-5 h-5" />}
                          </>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[13px] font-black text-[#121212] group-hover:text-brand-gold truncate">{item.title}</span>
                        <span className="text-[11px] font-bold text-gray-400 truncate">{item.subtitle}</span>
                      </div>
                      {item.meta && (
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-md
                               ${item.meta === 'Complete' || item.meta === 'Delivered' ? 'bg-emerald-50 text-emerald-500' :
                            item.meta === 'Pending' || item.meta === 'Processing' ? 'bg-amber-50 text-amber-500' : 'text-brand-gold'}
                            `}>
                          {item.meta}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-200  ">
                <HiOutlineMagnifyingGlass className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black text-[#121212]">No matches found</span>
                <span className="text-xs font-bold text-gray-400 max-w-[200px]">Try adjusting your search query or exploring our modules.</span>
              </div>
            </div>
          )}
        </div>

        <button className="h-14 border-t border-gray-50 flex items-center justify-center gap-2 group hover:bg-gray-50 transition-all">
          <span className="text-[11px] font-black text-[#121212] group-hover:text-brand-gold uppercase tracking-widest">View All Search Results</span>
          <HiOutlineArrowRight className="text-gray-300 group-hover:text-brand-gold transition-all translate-x-0 group-hover:translate-x-1 w-4 h-4" />
        </button>
      </DropdownMenu>
    </div>
  );
};
