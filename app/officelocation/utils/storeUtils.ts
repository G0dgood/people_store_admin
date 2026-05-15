export const getStoreUrl = (subdomain?: string | null, officeId?: string | null) => {
  const params = new URLSearchParams();
  if (subdomain) params.set("subdomain", subdomain);
  if (officeId) params.set("officeId", officeId);
  
  const queryString = params.toString();
  return `/officelocation${queryString ? `?${queryString}` : ""}`;
};

export const getShopUrl = (path: string, subdomain?: string | null, officeId?: string | null) => {
  const params = new URLSearchParams();
  if (subdomain) params.set("subdomain", subdomain);
  if (officeId) params.set("officeId", officeId);
  
  const queryString = params.toString();
  const fullPath = path.startsWith("/officelocation") ? path : `/officelocation${path}`;
  
  if (!queryString) return fullPath;
  
  // Handle case where fullPath might already have a query string (unlikely here but safe)
  const separator = fullPath.includes("?") ? "&" : "?";
  return `${fullPath}${separator}${queryString}`;
};

export const parseStoreContextFromUrl = (searchParams: URLSearchParams, searchString: string) => {
  const subdomain = searchParams.get("subdomain");
  const officeId = searchParams.get("officeId");
  
  if (subdomain || officeId) {
    return { subdomain, officeId };
  }
  return null;
};
