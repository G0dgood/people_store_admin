"use client";

import React from "react";
import { Icon } from "../Icon";

const ProductDescription = ({ product }: { product: any }) => {
  if (!product) return null;

  const rows = [
    { label: "Brand", value: product.brand?.name || "Artisanal House" },
    { label: "Category", value: product.category?.name || "Boutique Collection" },
    { label: "Gender", value: product.gender || "Unisex" },
    { label: "Size", value: product.size || "Standard" },
    { label: "Volume", value: product.volume || "N/A" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 max-w-[800px]">
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {product.description || "No description available for this artisanal piece."}
        </p>

        <table className="w-full border-collapse border border-gray-200 text-sm mt-4">
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 last:border-0">
                <td className="bg-gray-50 text-gray-400 p-3 w-48 font-bold uppercase tracking-widest text-[10px]">{row.label}</td>
                <td className="text-gray-600 p-3 font-medium">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tags / Features */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Highlights</h4>
          {product.tags.map((tag: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
              <Icon name="check" size="xs" className="text-brand-gold" />
              <span className="font-medium">{tag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductDescription };
