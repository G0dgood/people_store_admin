"use client";

import React from "react";
import { FavoriteButton } from "./FavoriteButton";
import { Icon } from "../Icon";

/**
 * A reusable Heart Icon component.
 * This can be used as a simple icon or as an interactive favorite button.
 */
export const HeartIcon: React.FC<any> = ({ interactive = false, ...props }) => {
  if (interactive) {
    return <FavoriteButton {...props} />;
  }

  return <Icon name="favorite" {...props} />;
};
