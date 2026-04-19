"use client";

import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { AdminChart } from "./AdminChart";

interface DashboardInsightsDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   activeSection?: 'revenue' | 'funnel' | 'traffic' | null;
}

export function DashboardInsightsDrawer({ isOpen, onClose, activeSection }: DashboardInsightsDrawerProps) {
   const getTitle = () => {
      switch (activeSection) {
         case 'revenue': return "Revenue Insights";
         case 'funnel': return "Conversion Breakdown";
         case 'traffic': return "Market Intelligence";
         default: return "Platform Insights";
      }
   };

   return (
      <Drawer isOpen={isOpen} onClose={onClose} title={getTitle()} width="max-w-xl">
         <div className="flex flex-col gap-10 pb-8">
            {/* Growth Forecast Section */}
            <div className={`flex flex-col gap-6 p-2 rounded-2xl transition-all duration-500 ${activeSection === 'revenue' ? 'ring-2 ring-brand-blue/20 bg-brand-blue/[0.02]' : ''}`}>
               <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col gap-1">
                     <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Revenue Distribution</h4>
                     <p className="text-[13px] font-bold text-[#1D3557]">Projected vs. Actual Growth</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-blue"></div>
                        <span className="text-[10px] font-bold text-gray-500">Actual</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-100"></div>
                        <span className="text-[10px] font-bold text-gray-500">Projected</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="h-48 w-full">
                     <AdminChart
                        type="line"
                        data={{
                           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                           datasets: [
                              {
                                 label: 'Actual',
                                 data: [20, 25, 40, 60, 80, 110],
                                 borderColor: '#2196F3',
                                 borderWidth: 3,
                                 fill: true,
                                 backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                 tension: 0.4,
                              },
                              {
                                 label: 'Projected',
                                 data: [22, 30, 45, 75, 95, 130],
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
                                    callback: (value: string | number) => `$${value}k`
                                 }
                              }
                           }
                        }}
                     />
                  </div>
               </div>
            </div>

            {/* Conversion Funnel */}
            <div className={`flex flex-col gap-6 p-2 rounded-2xl transition-all duration-500 ${activeSection === 'funnel' ? 'ring-2 ring-brand-blue/20 bg-brand-blue/[0.02]' : ''}`}>
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Conversion Funnel</h4>
               <div className="flex flex-col gap-2">
                  {[
                     { label: "Website Visits", value: "240.5k", perc: 100, color: "bg-blue-600" },
                     { label: "Product Views", value: "180.2k", perc: 75, color: "bg-blue-500" },
                     { label: "Add to Cart", value: "45.8k", perc: 19, color: "bg-blue-400" },
                     { label: "Successful Orders", value: "12.4k", perc: 5, color: "bg-blue-300" },
                  ].map((step, i) => (
                     <div key={i} className="group flex items-center gap-4">
                        <div className="flex-1 h-12 bg-gray-50 rounded-xl border border-transparent group-hover:border-gray-200 transition-all flex items-center px-4 gap-4 relative overflow-hidden">
                           <div className={`absolute left-0 top-0 bottom-0 ${step.color} transition-all duration-1000 origin-left`} style={{ width: `${step.perc}%`, opacity: 0.1 }}></div>
                           <span className="text-[13px] font-black text-[#1D3557] z-10">{step.label}</span>
                           <div className="ml-auto flex items-center gap-2 z-10">
                              <span className="text-sm font-black text-[#1D3557]">{step.value}</span>
                              <span className="text-[10px] font-bold text-gray-400">({step.perc}%)</span>
                           </div>
                        </div>
                        {i < 3 && (
                           <div className="w-4 flex flex-col items-center gap-0.5 opacity-20 group-hover:opacity-40 transition-opacity">
                              <Icon name="arrow_downward" size="xs" />
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>

            {/* Audience Intelligence */}
            <div className={`grid grid-cols-2 gap-6 p-2 rounded-2xl transition-all duration-500 ${activeSection === 'traffic' ? 'ring-2 ring-brand-blue/20 bg-brand-blue/[0.02]' : ''}`}>
               <div className="flex flex-col gap-4">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Traffic Sources</h4>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
                     <div className="relative w-32 h-32 mx-auto">
                        <AdminChart
                           type="doughnut"
                           data={{
                              labels: ['Direct', 'Social', 'Other'],
                              datasets: [{
                                 data: [60, 30, 10],
                                 backgroundColor: ['#2196F3', '#60A5FA', '#93C5FD'],
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
                           <span className="text-lg font-black text-[#1D3557]">85%</span>
                           <span className="text-[8px] font-bold text-gray-400 uppercase">Retention</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center px-1">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-[10px] font-bold text-gray-500">Direct</span>
                           </div>
                           <span className="text-[10px] font-black text-[#1D3557]">60%</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                              <span className="text-[10px] font-bold text-gray-500">Social</span>
                           </div>
                           <span className="text-[10px] font-black text-[#1D3557]">30%</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Top Regions</h4>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm h-[230px]">
                     <AdminChart
                        type="bar"
                        data={{
                           labels: ["North America", "Europe", "Africa", "Asia"],
                           datasets: [{
                              label: 'Revenue',
                              data: [120, 85, 45, 15],
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
               <button className="mt-5 w-fit bg-brand-blue text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest relative z-10 shadow-lg shadow-black/20 group-hover:bg-white group-hover:text-brand-blue transition-colors">
                  Run Audit Now
               </button>
            </div>
         </div>
      </Drawer>
   );
}
