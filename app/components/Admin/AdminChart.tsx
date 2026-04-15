"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdminChartProps {
  type: "line" | "bar" | "doughnut";
  data: ChartData<any>;
  options?: ChartOptions<any>;
  height?: number | string;
  className?: string;
}

export const AdminChart: React.FC<AdminChartProps> = ({ 
  type, 
  data, 
  options, 
  height, 
  className = "" 
}) => {
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1D3557',
        titleFont: { size: 12, weight: 'bold', family: 'Inter' },
        bodyFont: { size: 11, family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: { display: false },
        ticks: { 
            color: '#94a3b8', 
            font: { size: 10, weight: 'bold', family: 'Inter' } 
        },
        border: { display: false }
      },
      y: {
        grid: { color: '#F1F5F9' },
        ticks: { 
            color: '#94a3b8', 
            font: { size: 10, weight: 'bold', family: 'Inter' },
            callback: (value: any) => value >= 1000 ? `${value / 1000}k` : value
        },
        border: { display: false }
      },
    } : {},
  };

  const combinedOptions = { ...defaultOptions, ...options };

  return (
    <div className={className} style={{ height: height || '100%', width: '100%' }}>
      {type === "line" && <Line data={data} options={combinedOptions} />}
      {type === "bar" && <Bar data={data} options={combinedOptions} />}
      {type === "doughnut" && <Doughnut data={data} options={combinedOptions} />}
    </div>
  );
};
