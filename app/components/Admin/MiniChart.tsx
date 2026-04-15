"use client";

import React from "react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';

// Register necessary components for MiniChart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

interface MiniChartProps {
  type: "sparkline" | "bar" | "area";
  data: number[];
  color?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({ 
  type, 
  data, 
  color = "#2196F3", 
  width = "100%", 
  height = 40,
  className = ""
}) => {
  if (!data || data.length === 0) return null;

  const chartData: ChartData<any> = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data: data,
        borderColor: color,
        backgroundColor: type === "area" ? `${color}1A` : color, // 1A is ~10% opacity in hex
        fill: type === "area",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        borderRadius: type === "bar" ? 2 : 0,
      },
    ],
  };

  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Disable for performance
    events: [], // Disable interactions for performance
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: type === "bar" },
    },
  };

  return (
    <div className={className} style={{ width, height: height || '100%' }}>
      {type === "bar" ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};
