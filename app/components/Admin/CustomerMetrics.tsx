"use client";

import React from "react";

export type MetricType = "active" | "repeat" | "visitor" | "conversion";

interface MetricItem {
  id: MetricType;
  value: string;
  label: string;
  hasDivider?: boolean;
}

interface CustomerMetricsProps {
  activeMetric: MetricType;
  onMetricClick: (metric: MetricType) => void;
  stats?: any;
}

export function CustomerMetrics({ activeMetric, onMetricClick, stats }: CustomerMetricsProps) {
  const metricsData: MetricItem[] = [
    { id: "active", value: stats?.activeCustomers?.toString() || "0", label: "Active Customers", hasDivider: true },
    { id: "repeat", value: stats?.repeatCustomers?.toString() || "0", label: "Repeat Customers", hasDivider: true },
    { id: "visitor", value: stats?.visitorCount?.toString() || "0", label: "Shop Visitor", hasDivider: true },
    { id: "conversion", value: (stats?.conversionRate || 0).toString() + "%", label: "Conversion Rate" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 items-start border-b border-gray-50 pb-6 md:pb-4">
      {metricsData.map((metric) => (
        <button
          key={metric.id}
          onClick={() => onMetricClick(metric.id)}
          className="flex flex-col gap-1 items-start text-left transition-all group relative pr-4 md:border-r md:border-gray-200 last:border-r-0"
        >
          <span className={`text-2xl font-bold transition-colors ${
            activeMetric === metric.id ? "text-brand-gold" : "text-[#121212] group-hover:text-brand-gold/80"
          }`}>
            {metric.value}
          </span>
          <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${
            activeMetric === metric.id ? "text-brand-gold/60" : "text-gray-400"
          }`}>
            {metric.label}
          </span>
          
          {/* Active Indicator Bar */}
          <div className={`h-0.5 w-full mt-2 rounded-full transition-all duration-300 ${
            activeMetric === metric.id 
              ? "bg-brand-gold opacity-100 translate-y-0" 
              : "bg-brand-gold/10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
          }`}></div>
        </button>
      ))}
    </div>
  );
}
