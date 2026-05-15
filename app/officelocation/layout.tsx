import React from "react";
import { OfficeLocationCartProvider } from "./context/CartContext";

export default function OfficeLocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OfficeLocationCartProvider>
      {children}
    </OfficeLocationCartProvider>
  );
}
