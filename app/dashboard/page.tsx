"use client";

import { StatCard } from "@/app/components/Admin/StatCard";
import { TransactionTable } from "@/app/components/Admin/TransactionTable";
import { BestSellingProductTable } from "@/app/components/Admin/BestSellingProductTable";
import { DashboardInsightsDrawer } from "@/app/components/Admin/DashboardInsightsDrawer";
import { useState } from "react";
import { RealtimeUsers } from "@/app/components/Admin/RealtimeUsers";
import { TopProducts } from "@/app/components/Admin/TopProducts";
import { QuickAddProduct } from "@/app/components/Admin/QuickAddProduct";
import { AnalyticsOverview } from "@/app/components/Admin/AnalyticsOverview";
import { useRouter } from "next/navigation";

import { useGetOrderStatsQuery } from "@/lib/redux/services/orderApi";
import { useGetCustomerStatsQuery } from "@/lib/redux/services/customerApi";
import { useGetOfficesQuery } from "@/lib/redux/services/officeApi";
import { HiArrowPath } from "react-icons/hi2";
import { Tooltip } from "@/app/components/Tooltip";
import { Button } from "@/app/components/Button";
import { StatCardSkeleton } from "@/app/components/Skeleton/StatCardSkeleton";
import { useGetBrandStatsQuery } from "@/lib/redux/services/brandApi";
import { useGetProductStatsQuery } from "@/lib/redux/services/productApi";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeInsightSection, setActiveInsightSection] = useState<'revenue' | 'funnel' | 'traffic' | null>(null);

  const { data: orderStatsResponse, isLoading: isLoadingOrders, refetch: refetchOrders, isFetching: isFetchingOrders } = useGetOrderStatsQuery();
  const { data: customerStatsResponse, isLoading: isLoadingCustomers, refetch: refetchCustomers, isFetching: isFetchingCustomers } = useGetCustomerStatsQuery();
  const { data: brandStatsResponse, isLoading: isLoadingBrands, refetch: refetchBrands, isFetching: isFetchingBrands } = useGetBrandStatsQuery();
  const { data: productStatsResponse, isLoading: isLoadingProductStats, refetch: refetchProductStats, isFetching: isFetchingProductStats } = useGetProductStatsQuery();
  const { data: officesResponse, isLoading: isLoadingOffices, refetch: refetchOffices, isFetching: isFetchingOffices } = useGetOfficesQuery();

  const isGlobalFetching = isFetchingOrders || isFetchingCustomers || isFetchingBrands || isFetchingProductStats || isFetchingOffices;

  const handleRefresh = () => {
    refetchOrders();
    refetchCustomers();
    refetchBrands();
    refetchProductStats();
    refetchOffices();
  };

  const orderStats = orderStatsResponse?.data;
  const brandStats = brandStatsResponse?.data;
  const productStats = productStatsResponse?.data;

  return (
    <div className="flex flex-col gap-6">
      {/* Drawers */}
      <DashboardInsightsDrawer
        isOpen={activeInsightSection !== null}
        onClose={() => setActiveInsightSection(null)}
        activeSection={activeInsightSection}
      />

      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-[#121212]">Command Center</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Live Administrative Overview</p>
        </div>
        <Tooltip text="Refresh Dashboard Metrics">
          <Button shape="rounded-sm" variant="outline"
            className="border-gray-200 text-gray-500 group h-10 px-6"
            iconLeft={<HiArrowPath size={16} className={`${isGlobalFetching ? 'animate-spin text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold'} transition-colors`} />}
            onClick={handleRefresh}
            disabled={isLoadingOrders || isGlobalFetching}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isGlobalFetching ? "Synchronizing..." : "Refresh Pulse"}
            </span>
          </Button>
        </Tooltip>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {(isLoadingOrders || isLoadingCustomers || isLoadingBrands || isLoadingOffices) ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Sales"
              value={"₦" + (orderStats?.totalRevenue || 0).toLocaleString()}
              trendLabel="Revenue"
              trendValue="10.4%"
              trendIsUp={true}
              onViewDetails={() => setActiveInsightSection('revenue')}
            />
            <StatCard
              title="Total Orders"
              value={(orderStats?.totalOrders || 0).toLocaleString()}
              trendLabel="Orders"
              trendValue="14.4%"
              trendIsUp={true}
              onViewDetails={() => setActiveInsightSection('funnel')}
            />
            <StatCard
              title="Total Stores"
              value={(brandStats?.totalBrands || 0).toLocaleString()}
              trendLabel="Live Brands"
              trendValue={(brandStats?.activeBrands || 0).toString()}
              trendIsUp={true}
              previousLabel="Active Status"
              previousValue={(brandStats?.activeBrands || 0).toString()}
              onViewDetails={() => router.push("/brands")}
            />
            <StatCard
              title="Total Inventory"
              value={(productStats?.totalStock || 0).toLocaleString()}
              trendLabel="Stock Units"
              trendValue={(productStats?.totalProducts || 0).toString()}
              trendIsUp={true}
              previousLabel="Unique Products"
              previousValue={(productStats?.totalProducts || 0).toString()}
              onViewDetails={() => router.push("/products")}
            />
            <StatCard
              title="Office Locations"
              value={(officesResponse?.data?.length || 0).toLocaleString()}
              trendLabel="Active Sites"
              trendValue={(officesResponse?.data?.filter((o: any) => o.status === 'Active').length || 0).toString()}
              trendIsUp={true}
              previousLabel="Total Branches"
              previousValue={(officesResponse?.data?.length || 0).toString()}
              onViewDetails={() => router.push("/offices")}
            />
          </>
        )}
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
          <RealtimeUsers onViewInsight={() => setActiveInsightSection('funnel')} />

          {/* Top Products */}
          <TopProducts onViewAll={() => router.push("/products")} />

          {/* Add New Product & Quick List */}
          <QuickAddProduct
            onAddNew={() => router.push("/products")}
            onAddProduct={(name) => console.log("Add", name)}
          />
        </div>
      </div>
    </div>
  );
}
