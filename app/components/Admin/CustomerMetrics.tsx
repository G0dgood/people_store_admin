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
}

const metrics: MetricItem[] = [
  { id: "active", value: "25k", label: "Active Customers", hasDivider: true },
  { id: "repeat", value: "5.6k", label: "Repeat Customers", hasDivider: true },
  { id: "visitor", value: "250k", label: "Shop Visitor", hasDivider: true },
  { id: "conversion", value: "5.5%", label: "Conversion Rate" },
];

export function CustomerMetrics({ activeMetric, onMetricClick }: CustomerMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start border-b border-gray-50 pb-4">
      {metrics.map((metric) => (
        <button
          key={metric.id}
          onClick={() => onMetricClick(metric.id)}
          className={`flex flex-col gap-1 items-start text-left transition-all group relative pr-4 
            ${metric.hasDivider ? "border-r border-gray-100" : ""}
          `}
        >
          <span className={`text-2xl font-bold transition-colors ${
            activeMetric === metric.id ? "text-blue-600" : "text-[#1D3557] group-hover:text-blue-500"
          }`}>
            {metric.value}
          </span>
          <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${
            activeMetric === metric.id ? "text-blue-400" : "text-gray-400"
          }`}>
            {metric.label}
          </span>
          
          {/* Active Indicator Bar */}
          <div className={`h-0.5 w-full mt-2 rounded-full transition-all duration-300 ${
            activeMetric === metric.id 
              ? "bg-blue-500 opacity-100 translate-y-0" 
              : "bg-blue-100 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
          }`}></div>
        </button>
      ))}
    </div>
  );
}
