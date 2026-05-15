"use client";

import React from "react";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { getShopUrl } from "../utils/storeUtils";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface OfficeLocationBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const OfficeLocationBreadcrumbs: React.FC<OfficeLocationBreadcrumbsProps> = ({
  items,
  className = ""
}) => {
  const { storeContext } = useOfficeLocationInfo();
  const officeHomeUrl = getShopUrl("/", storeContext.subdomain, storeContext.officeId);

  return (
    <Breadcrumbs
      items={items}
      className={`pb-2 border-b border-gray-200 w-full ${className}`}
      rootLabel="Home"
      rootHref={officeHomeUrl}
    />
  );
};
