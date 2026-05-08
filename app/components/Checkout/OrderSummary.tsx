import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/utils/formatPrice";
import { useCustomerAuth } from "@/app/context/CustomerAuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SectionHeaderSimple } from "../ui/SectionHeaderSimple";
import { SummarySection } from "../Cart/SummarySection";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export const OrderSummary: React.FC = () => {
  const { cartItems, appliedCoupon } = useCart();

  const parsePrice = (priceStr: string) => {
    const p = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
    return p;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  const productDiscount = cartItems.reduce((acc, item) => {
    if (!item.originalPrice) return acc;
    const original = parseFloat(String(item.originalPrice).replace(/[₦$,]/g, ""));
    const current = parsePrice(item.price);

    if (!isNaN(original) && !isNaN(current) && original > current) {
      return acc + (original - current) * item.quantity;
    }
    return acc;
  }, 0);

  const couponDiscount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    const discountVal = parseFloat(appliedCoupon.discount.replace(/[%₦$,]/g, ""));
    if (isNaN(discountVal)) return 0;

    if (appliedCoupon.type === "Percentage") {
      return (subtotal * discountVal) / 100;
    } else if (appliedCoupon.type === "Fixed Rate") {
      return discountVal;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const discount = productDiscount + couponDiscount;
  const estimatedTax = subtotal > 0 ? Math.round((subtotal - discount) * 0.075) : 0; // 7.5% VAT
  const total = Math.max(0, subtotal - discount + estimatedTax);

  const { customer, isAuthenticated } = useCustomerAuth();
  const router = useRouter();

  const handleCompleteOrder = async () => {
    if (!isAuthenticated || !customer) {
      toast.error("Please log in to complete your purchase");
      return;
    }

    if (cartItems.length === 0) return;

    // 1. Create a "Pending" order first (Mocking here, usually you call an API)
    const orderData = {
      customer: customer._id,
      items: cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: parsePrice(item.price)
      })),
      totalAmount: total,
      shippingAddress: customer.address || "Main Street, Lagos", // Fallback for testing
    };

    try {
      // Create the order on the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });
      const orderResult = await response.json();

      if (!orderResult.success) {
        throw new Error(orderResult.message || "Failed to create order");
      }

      const orderId = orderResult.data._id;

      // 2. Initialize Paystack
      if (!window.PaystackPop) {
        throw new Error("Paystack is not loaded. Please refresh the page.");
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: customer.email,
        amount: Math.round(total * 100), // in kobo
        currency: 'NGN',
        ref: `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        reference: `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        onClose: () => {
          toast.warning("Payment cancelled");
        },
        callback: (response: any) => {
          const loadingToast = toast.loading("Verifying payment...");

          // Use an IIFE to handle the async verification
          (async () => {
            try {
              // 3. Verify on backend
              const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/transactions/verify-paystack`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                  reference: response.reference,
                  orderId: orderId
                })
              });

              const verifyResult = await verifyResponse.json();

              if (verifyResult.success) {
                toast.dismiss(loadingToast);
                toast.success("Payment successful!");
                router.push(`/checkout/success?orderId=${orderId}`);
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (err: any) {
              toast.dismiss(loadingToast);
              toast.error(err.message || "Something went wrong during verification");
            }
          })();
        }
      });

      handler.openIframe();
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment");
    }
  };

  return (
    <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 sticky top-28">
      <section className="bg-white border border-[#1C1C1C1A] rounded-[6px] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-200 flex items-center justify-between">
          <SectionHeaderSimple title="Order Summary" className="!p-0 !border-0" />
          <Icon name="shopping_cart" size="md" className="text-brand-gold opacity-10" />
        </div>

        <div className="p-6 md:p-8">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-col gap-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-white rounded-2xl border border-gray-200 flex-shrink-0 relative overflow-hidden   group-hover:shadow-md transition-all duration-300">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" sizes="80px" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link href="/products/detail">
                        <h4 className="font-bold text-gray-900 text-[13px] line-clamp-2 leading-tight group-hover:text-brand-gold cursor-pointer transition-colors">
                          {item.title}
                        </h4>
                      </Link>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1.5 block">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-brand-gold text-sm tracking-tight">{formatPrice(parsePrice(item.price) * item.quantity)}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <Icon name="shopping_bag" size="lg" className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-bold">Your cart is empty</p>
              </div>
            )}
          </motion.div>

          <SummarySection
            variant="checkout"
            subtotal={subtotal}
            discount={discount}
            tax={estimatedTax}
            total={total}
            className="!p-0 !border-0"
            title="Summary Details"
          />

          <Button
            shape="rounded-sm"
            onClick={handleCompleteOrder}
            className={`w-full text-base h-[60px] text-white shadow-xl transition-all font-black rounded-2xl flex items-center justify-center gap-3 ${cartItems.length > 0
              ? "bg-brand-gold shadow-brand-gold/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-[0.98]"
              : "bg-gray-400 cursor-not-allowed opacity-50"
              }`}
            disabled={cartItems.length === 0}
          >
            <span>Complete Order</span>
            <Icon name="arrow_forward" size="md" className="opacity-60" />
          </Button>

          <div className="mt-8 flex flex-col gap-4">

            <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <Image src="/payment/Payment=payment, Pay-type=visa.png" alt="Visa" width={32} height={20} className="object-contain grayscale hover:grayscale-0 transition-all cursor-crosshair" />
              <Image src="/payment/Payment=payment, Pay-type=mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain grayscale hover:grayscale-0 transition-all cursor-crosshair" />
              <div className="w-[1px] h-3 bg-gray-300 mx-1" />
              <Icon name="security" size="sm" className="text-gray-400" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
