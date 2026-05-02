"use client";

import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export function DynamicToaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Toaster 
      richColors 
      closeButton 
      position={isMobile ? "top-right" : "bottom-right"} 
    />
  );
}
