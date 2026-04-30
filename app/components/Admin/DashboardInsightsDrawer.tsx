"use client";

import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { AdminChart } from "./AdminChart";

interface DashboardInsightsDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   activeSection?: 'revenue' | 'funnel' | 'traffic' | null;
}

import { useGetRevenueHistoryQuery, useGetOrderStatsQuery, useGetFunnelStatsQuery, useGetMarketIntelligenceQuery } from "@/lib/redux/services/orderApi";
import { SVGLoaderFetch } from "../Options";

export function DashboardInsightsDrawer({ isOpen, onClose, activeSection }: DashboardInsightsDrawerProps) {
   const { data: historyResponse, isLoading: isLoadingHistory } = useGetRevenueHistoryQuery();
   const { data: statsResponse } = useGetOrderStatsQuery();
   const { data: funnelResponse, isLoading: isLoadingFunnel } = useGetFunnelStatsQuery();
   const { data: marketResponse, isLoading: isLoadingMarket } = useGetMarketIntelligenceQuery();

   const history = historyResponse?.data || [];
   const totalRevenue = statsResponse?.data?.totalRevenue || 0;
   const funnelSteps = funnelResponse?.data || [];
   const marketData = marketResponse?.data;

   const getTitle = () => {
      switch (activeSection) {
         case 'revenue': return "Revenue Insights";
         case 'funnel': return "Conversion Breakdown";
         case 'traffic': return "Market Intelligence";
         default: return "Platform Insights";
      }
   };

   // Prepare chart data from history
   const labels = history.map((h: any) => {
      const date = new Date(h.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
   });
   const revenueData = history.map((h: any) => h.revenue);

   // Forecast calculation based on recent performance trends
   const lastThree = revenueData.slice(-3);
   const trendVelocity = lastThree.length >= 2
      ? (lastThree[lastThree.length - 1] - lastThree[0]) / lastThree.length
      : (revenueData[revenueData.length - 1] || 0) * 0.05;

   const projectedData = revenueData.map((v: number, i: number) => {
      const forecast = v + (trendVelocity * (i + 1));
      return Math.max(v * 1.05, forecast);
   });

   return (
      <Drawer isOpen={isOpen} onClose={onClose} title={getTitle()} width="max-w-xl">
         <div className="flex flex-col gap-10 pb-8">
            {/* Growth Forecast Section */}
            <div className={`flex flex-col gap-6 p-2 rounded-2xl transition-all duration-500 ${activeSection === 'revenue' ? 'ring-2 ring-brand-gold/20 bg-brand-gold/[0.02]' : ''}`}>
               <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col gap-1">
                     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Growth Analytics</h4>
                     <p className="text-[13px] font-bold text-[#1D3557]">Current Volume: ₦{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-gold"></div>
                        <span className="text-[10px] font-bold text-gray-500">Actual</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-100"></div>
                        <span className="text-[10px] font-bold text-gray-500">Projected</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  {isLoadingHistory ? (
                     <div className="h-48 flex items-center justify-center"><SVGLoaderFetch asTable={false} text="Loading history..." /></div>
                  ) : (
                     <div className="h-48 w-full">
                        <AdminChart
                           type="line"
                           data={{
                              labels: labels,
                              datasets: [
                                 {
                                    label: 'Actual',
                                    data: revenueData,
                                    borderColor: '#2196F3',
                                    borderWidth: 3,
                                    fill: true,
                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                    tension: 0.4,
                                 },
                                 {
                                    label: 'Projected',
                                    data: projectedData,
                                    borderColor: '#BFDBFE',
                                    borderWidth: 2,
                                    borderDash: [5, 5],
                                    fill: true,
                                    backgroundColor: 'rgba(191, 219, 254, 0.05)',
                                    tension: 0.4,
                                 }
                              ]
                           }}
                           options={{
                              scales: {
                                 y: {
                                    ticks: {
                                       callback: (value: string | number) => `₦${Number(value).toLocaleString()}`
                                    }
                                 }
                              }
                           }}
                        />
                     </div>
                  )}
               </div>
            </div>

            {/* Conversion Funnel */}
            <div className={`flex flex-col gap-6 p-2 rounded-2xl transition-all duration-500 ${activeSection === 'funnel' ? 'ring-2 ring-brand-gold/20 bg-brand-gold/[0.02]' : ''}`}>
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Conversion Funnel</h4>
               <div className="flex flex-col gap-2">
                  {isLoadingFunnel ? (
                     <div className="h-48 flex items-center justify-center"><SVGLoaderFetch asTable={false} text="Loading funnel..." /></div>
                  ) : funnelSteps.length === 0 ? (
                     <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase">No funnel data available</div>
                  ) : (
                     funnelSteps.map((step: any, i: number) => (
                        <div key={i} className="group flex items-center gap-4">
                           <div className="flex-1 h-12 bg-gray-50 rounded-xl border border-transparent group-hover:border-gray-200 transition-all flex items-center px-4 gap-4 relative overflow-hidden">
                              <div className={`absolute left-0 top-0 bottom-0 ${step.color} transition-all duration-1000 origin-left`} style={{ width: `${step.perc}%`, opacity: 0.1 }}></div>
                              <span className="text-[13px] font-black text-[#1D3557] z-10">{step.label}</span>
                              <div className="ml-auto flex items-center gap-2 z-10">
                                 <span className="text-sm font-black text-[#1D3557]">{step.value.toLocaleString()}</span>
                                 <span className="text-[10px] font-bold text-gray-400">({step.perc}%)</span>
                              </div>
                           </div>
                           {i < funnelSteps.length - 1 && (
                              <div className="w-4 flex flex-col items-center gap-0.5 opacity-20 group-hover:opacity-40 transition-opacity">
                                 <Icon name="arrow_downward" size="xs" />
                              </div>
                           )}
                        </div>
                     ))
                  )}
               </div>
            </div>

            {/* Audience Intelligence */}
            <div className={`grid grid-cols-2 gap-6 p-2 rounded-2xl transition-all duration-500 ${activeSection === 'traffic' ? 'ring-2 ring-brand-gold/20 bg-brand-gold/[0.02]' : ''}`}>
               <div className="flex flex-col gap-4">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Traffic Sources</h4>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
                     {isLoadingMarket ? (
                        <div className="h-32 flex items-center justify-center"><SVGLoaderFetch asTable={false} text="Loading sources..." /></div>
                     ) : (
                        <>
                           <div className="relative w-32 h-50 mx-auto">
                              <AdminChart
                                 type="doughnut"
                                 data={{
                                    labels: marketData?.trafficSources.map((s: any) => s.label) || [],
                                    datasets: [{
                                       data: marketData?.trafficSources.map((s: any) => s.value) || [],
                                       backgroundColor: marketData?.trafficSources.map((s: any) => s.color) || [],
                                       borderWidth: 0,
                                       cutout: '75%',
                                    }]
                                 }}
                                 options={{
                                    plugins: {
                                       tooltip: { enabled: true }
                                    }
                                 }}
                              />
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                 <span className="text-lg font-black text-[#1D3557]">{marketData?.trafficSources?.[0]?.value || 0}%</span>
                                 <span className="text-[8px] font-bold text-gray-400 uppercase">Top Source</span>
                              </div>
                           </div>
                           <div className="flex flex-col gap-3">
                              {marketData?.trafficSources.map((source: any, i: number) => (
                                 <div key={i} className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: source.color }}></div>
                                       <span className="text-[10px] font-bold text-gray-500">{source.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#1D3557]">{source.value}%</span>
                                 </div>
                              ))}
                           </div>
                        </>
                     )}
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Top Regions</h4>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm h-[230px]">
                     {isLoadingMarket ? (
                        <div className="h-full flex items-center justify-center"><SVGLoaderFetch asTable={false} text="Loading regions..." /></div>
                     ) : (
                        <AdminChart
                           type="bar"
                           data={{
                              labels: marketData?.regions.map((r: any) => r.label) || [],
                              datasets: [{
                                 label: 'Orders',
                                 data: marketData?.regions.map((r: any) => r.value) || [],
                                 backgroundColor: '#2196F3',
                                 borderRadius: 4,
                                 indexAxis: 'y',
                              }]
                           }}
                           options={{
                              scales: {
                                 x: {
                                    display: false,
                                 },
                                 y: {
                                    grid: { display: false },
                                    ticks: {
                                       color: '#1D3557',
                                       font: { size: 11, weight: 'bold' }
                                    }
                                 }
                              }
                           }}
                        />
                     )}
                  </div>
               </div>
            </div>

            {/* Global Action */}
            <div className="mt-4 p-6 rounded-2xl bg-[#1D3557] relative overflow-hidden group cursor-pointer">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500"></div>
               <div className="flex flex-col gap-1 relative z-10">
                  <h5 className="text-white text-sm font-black tracking-tight">Generate Advanced Audit Report</h5>
                  <p className="text-white/60 text-[10px] font-medium max-w-[280px]">Deep-dive into every transaction, user behavior, and operational bottleneck.</p>
               </div>
               <button className="mt-5 w-fit bg-brand-gold text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest relative z-10 shadow-lg shadow-black/20 group-hover:bg-white group-hover:text-brand-gold transition-colors">
                  Run Audit Now
               </button>
            </div>
         </div>
      </Drawer>
   );
}
