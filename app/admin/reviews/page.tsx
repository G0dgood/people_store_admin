"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { TabFilter } from "../../components/Admin/TabFilter";

const reviewsData = [
  { 
    id: 1, 
    customer: { name: "Arlene McCoy", email: "arlene.mccoy@example.com", avatar: "/dashboardImage/Fashion.png" },
    rating: 5,
    comment: "The sound quality is exceptional. Best headphones I've owned!",
    product: { name: "Premium Wireless Headphones", image: "/dashboardImage/Headphones.png" },
    date: "Oct 24, 2023",
    status: "Published"
  },
  { 
    id: 2, 
    customer: { name: "Brooklyn Simmons", email: "brooklyn.s@example.com", avatar: "/dashboardImage/T-Shirt.png" },
    rating: 4,
    comment: "Great fitness tracker, but the strap is a bit stiff initially.",
    product: { name: "Smart Fitness Watch", image: "/dashboardImage/Electronics.png" },
    date: "Oct 22, 2023",
    status: "Pending"
  },
  { 
    id: 3, 
    customer: { name: "Cody Fisher", email: "cody.f@example.com", avatar: "/dashboardImage/Cap.png" },
    rating: 2,
    comment: "The color is slightly different from the photos. Disappointed.",
    product: { name: "Organic Cotton T-Shirt", image: "/dashboardImage/T-Shirt.png" },
    date: "Oct 20, 2023",
    status: "Published"
  },
  { 
    id: 4, 
    customer: { name: "Jane Cooper", email: "jane.c@example.com", avatar: "/dashboardImage/Electronics.png" },
    rating: 5,
    comment: "Stunning design and very accurate timekeeping. Love it!",
    product: { name: "Minimalist Wall Clock", image: "/dashboardImage/Home & Kitchen.png" },
    date: "Oct 18, 2023",
    status: "Published"
  },
  { 
    id: 5, 
    customer: { name: "Robert Fox", email: "robert.f@example.com", avatar: "/dashboardImage/Accessories.png" },
    rating: 1,
    comment: "Item arrived damaged. Customer support was helpful though.",
    product: { name: "Modern Desk Lamp", image: "/dashboardImage/Bulb.png" },
    date: "Oct 15, 2023",
    status: "Spam"
  },
  { 
    id: 6, 
    customer: { name: "Esther Howard", email: "esther.h@example.com", avatar: "/dashboardImage/Fashion.png" },
    rating: 4,
    comment: "Very comfortable bag for daily commute. Highly recommend.",
    product: { name: "Leather Travel Bag", image: "/dashboardImage/Fashion.png" },
    date: "Oct 12, 2023",
    status: "Published"
  },
];

const statusStyles = {
  Published: "text-blue-500 bg-brand-blue-light",
  Pending: "text-amber-500 bg-amber-50/50",
  Spam: "text-rose-500 bg-rose-50/50",
};

export default function ReviewListing() {
  const [activeTab, setActiveTab] = useState("All reviews");

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Area */}
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button
            variant="primary"
            shape="rounded-sm"
            iconLeft={<Icon name="ticket" folder="dashboardIcon" size="sm" />}
          >
            Export Reviews
          </Button>
          <Button
            variant="outline"
            shape="rounded-sm"
            iconRight={<Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" className="text-gray-400" />}
          >
            More Action
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[6px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Controls Bar */}
        <div className="p-6 flex flex-col xl:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All reviews", "Published", "Pending", "Spam"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Input
              type="text"
              placeholder="Search reviewer, comment..."
              containerClassName="flex-1 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex gap-2">
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                <Icon name="sort" folder="dashboardIcon" size="sm" />
              </button>
              <button className="p-2.5 rounded-[6px] border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all flex items-center gap-2 px-4 shadow-sm">
                <Icon name="filter" folder="dashboardIcon" size="sm" />
                <span className="text-xs font-bold text-[#1D3557]">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[#1D3557]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Review</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviewsData.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={review.customer.avatar} alt={review.customer.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1D3557] leading-tight">{review.customer.name}</span>
                        <span className="text-[10px] font-medium text-gray-400 mt-0.5">{review.customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-[300px]">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon 
                            key={star} 
                            name="star" 
                            folder="dashboardIcon" 
                            size="xs" 
                            className={star <= review.rating ? "text-amber-400" : "text-gray-200"} 
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-[#1D3557] leading-relaxed line-clamp-2 italic tracking-tight opacity-80">
                         "{review.comment}"
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[6px] border border-gray-100 overflow-hidden bg-white p-1 shadow-sm">
                        <img src={review.product.image} alt={review.product.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-gray-500 max-w-[120px] truncate">{review.product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-gray-400">{review.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold ${statusStyles[review.status as keyof typeof statusStyles]}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right pr-6 text-gray-300">
                    <div className="flex justify-end gap-4">
                       <button className="hover:text-blue-500 transition-colors">
                          <Icon name="reply" folder="dashboardIcon" size="sm" />
                       </button>
                       <button className="hover:text-rose-500 transition-colors">
                          <Icon name="Delete" folder="dashboardIcon" size="sm" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 flex items-center justify-between border-t border-gray-50">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-xs font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm group">
            <Icon name="arrow_back" folder="icon" size="xs" className="transition-transform group-hover:-translate-x-0.5" />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 85].map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-xs font-bold transition-all ${
                  page === 1 
                    ? "bg-blue-100 text-blue-600 shadow-sm" 
                    : "text-gray-400 hover:text-[#1D3557] hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-[6px] text-xs font-bold text-[#1D3557] hover:bg-gray-50 transition-all shadow-sm group">
            Next
            <Icon name="arrow_forward" folder="icon" size="xs" className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
