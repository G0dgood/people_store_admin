"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./Table";
import { Icon } from "../Icon";

interface CollapsibleGroup {
  id: string;
  heading: string;
  count?: number;
  rows: any[];
}

interface CollapsibleTableProps {
  groups: CollapsibleGroup[];
  renderRow: (row: any, index: number) => React.ReactNode;
  columns?: string[];
  className?: string;
}

const CollapsibleTable: React.FC<CollapsibleTableProps> = ({ 
  groups, 
  renderRow,
  columns,
  className = "" 
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map(g => [g.id, true])) // Default all expanded
  );

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Table className={className}>
      {columns && (
        <TableHeader>
          <TableRow className="bg-gray-50/50">
             {columns.map((col, idx) => (
                <TableCell key={idx} isHeader align={idx === columns.length - 1 ? "right" : "left"}>
                  {col}
                </TableCell>
             ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {groups.map((group) => (
          <React.Fragment key={group.id}>
            {/* Group Header */}
            <TableRow 
              className="bg-brand-gold-light/10 cursor-pointer select-none border-b border-gray-200"
              onClick={() => toggleGroup(group.id)}
            >
              <TableCell colSpan={columns ? columns.length - 1 : 1} className="py-3">
                <div className="flex items-center gap-2">
                  <Icon 
                    name="expand_more" 
                    size="sm" 
                    className={`text-brand-gold transition-transform duration-200 ${expandedGroups[group.id] ? "" : "-rotate-90"}`} 
                  />
                  <span className="text-sm font-bold text-brand-gold">{group.heading}</span>
                </div>
              </TableCell>
              <TableCell align="right" className="py-3">
                <span className="text-sm font-medium text-gray-500">{group.count}</span>
              </TableCell>
            </TableRow>

            {/* Group Rows */}
            {expandedGroups[group.id] && group.rows.map((row, idx) => renderRow(row, idx))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export { CollapsibleTable };
