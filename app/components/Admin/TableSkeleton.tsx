"use client";

import React from "react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  hasCheckbox?: boolean;
  hasAction?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  columns, 
  rows = 10, 
  hasCheckbox = true, 
  hasAction = true 
}) => {
  return (
    <div className="admin-table-container">
      <table className="w-full">
        <thead>
          <tr>
            {hasCheckbox && <th className="w-10 pl-8"><div className="h-4 w-4 bg-gray-100 rounded animate-pulse" /></th>}
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}><div className="h-3 w-20 bg-gray-100 rounded animate-pulse" /></th>
            ))}
            {hasAction && <th className="text-right pr-8"><div className="h-3 w-16 bg-gray-100 rounded animate-pulse ml-auto" /></th>}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {hasCheckbox && <td className="w-10 pl-8"><div className="h-4 w-4 bg-gray-50 rounded animate-pulse" /></td>}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div className={`h-3 ${colIndex === 0 ? 'w-32' : 'w-24'} bg-gray-50 rounded animate-pulse`} />
                </td>
              ))}
              {hasAction && (
                <td className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <div className="w-8 h-8 rounded bg-gray-50 animate-pulse" />
                    <div className="w-8 h-8 rounded bg-gray-50 animate-pulse" />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
