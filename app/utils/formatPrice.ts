/**
 * Formats a number or string as a currency string with commas and 2 decimal places.
 * Example: 42337050.00 -> ₦42,337,050.00
 */
export const formatPrice = (price: string | number): string => {
  if (price === undefined || price === null || price === "") return "₦0.00";
  
  const numericPrice = typeof price === "string" 
    ? parseFloat(price.replace(/[₦$,]/g, "")) 
    : price;
    
  if (isNaN(numericPrice)) return "₦0.00";
  
  return "₦" + numericPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
