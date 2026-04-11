"use client";

import React from "react";
import { Icon } from "../Icon";

const ProductDescription = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 max-w-[800px]">
        <p className="text-gray-600 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

        <table className="w-full border-collapse border border-gray-100 text-sm">
          <tbody>
            {[
              { label: "Model", value: "#8786867" },
              { label: "Style", value: "Classic style" },
              { label: "Certificate", value: "ISO-8989" },
              { label: "Size", value: "34mm x 450mm x 19mm" },
              { label: "Memory", value: "36GB RAM" },
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="bg-gray-50 text-gray-400 p-3 w-48 font-medium">{row.label}</td>
                <td className="text-gray-600 p-3">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature List */}
      <div className="flex flex-col gap-3">
        {[
          "Some our feature goes here",
          "Lorem ipsum dolor sit amet, consectetur",
          "Duis aute irure dolor in reprehenderit",
          "Some our feature goes here",
        ].map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
            <Icon name="check" size="xs" className="text-gray-400" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProductDescription };
