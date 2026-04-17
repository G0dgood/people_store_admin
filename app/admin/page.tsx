"use client";

import { StatCard } from "../components/Admin/StatCard";
import { TransactionTable } from "../components/Admin/TransactionTable";
import { BestSellingProductTable } from "../components/Admin/BestSellingProductTable";
import { DashboardInsightsDrawer } from "../components/Admin/DashboardInsightsDrawer";
import { useState } from "react";
import { RealtimeUsers } from "../components/Admin/RealtimeUsers";
import { TopProducts } from "../components/Admin/TopProducts";
import { QuickAddProduct } from "../components/Admin/QuickAddProduct";
import { AnalyticsOverview } from "../components/Admin/AnalyticsOverview";

export default function AdminDashboard() {
 const [activeInsightSection, setActiveInsightSection] = useState<'revenue' | 'funnel' | 'traffic' | null>(null);

 return (
  <div className="flex flex-col gap-6">
   {/* Drawers */}
   <DashboardInsightsDrawer
    isOpen={activeInsightSection !== null}
    onClose={() => setActiveInsightSection(null)}
    activeSection={activeInsightSection}
   />

   {/* Stats Grid */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard
     title="Total Sales"
     value="$350K"
     trendLabel="Sales"
     trendValue="10.4%"
     trendIsUp={true}
     previousValue="($235)"
     onViewDetails={() => setActiveInsightSection('revenue')}
    />
    <StatCard
     title="Total Orders"
     value="10.7K"
     trendLabel="order"
     trendValue="14.4%"
     trendIsUp={true}
     previousValue="(7.6k)"
     onViewDetails={() => setActiveInsightSection('funnel')}
    />
    <StatCard
     title="Pending & Canceled"
     value="509"
     trendLabel="user"
     trendValue="204"
     trendIsUp={true}
     previousLabel="Canceled"
     previousValue="94 (-14.4%)"
     onViewDetails={() => setActiveInsightSection('traffic')}
    />
   </div>

   <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
    {/* Main Content Area */}
    <div className="xl:col-span-8 flex flex-col gap-6">
     {/* Analytics Overview */}
     <AnalyticsOverview />

     {/* Transaction Table */}
     <TransactionTable />

     {/* Best Selling Product */}
     <BestSellingProductTable />
    </div>

    {/* Sidebar Analytics */}
    <div className="xl:col-span-4 flex flex-col gap-6">
     {/* Realtime Users */}
     <RealtimeUsers onViewInsight={() => setActiveInsightSection(null)} />

     {/* Top Products */}
     <TopProducts onViewAll={() => console.log("View All Products")} />

     {/* Add New Product & Quick List */}
     <QuickAddProduct
      onAddNew={() => console.log("Add New")}
      onAddProduct={(name) => console.log("Add", name)}
     />
    </div>
   </div>
  </div>
 );
}
