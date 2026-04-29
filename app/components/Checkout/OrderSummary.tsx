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
  const { cartItems } = useCart();

  const parsePrice = (priceStr: string) => {
    const p = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
    return p;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  const estimatedTax = subtotal * 0.05; // 5% tax
  const total = subtotal + estimatedTax;
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
        ref: `ORD_${Math.floor(Math.random() * 1000000000 + 1)}`,
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
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order Summary</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Review items</p>
          </div>
          <Icon name="shopping_cart" size="md" className="text-brand-blue opacity-10" />
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
                  <div className="w-20 h-20 bg-white rounded-2xl border border-gray-200 flex-shrink-0 relative overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" sizes="80px" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link href="/products/detail">
                        <h4 className="font-bold text-gray-900 text-[13px] line-clamp-2 leading-tight group-hover:text-brand-blue cursor-pointer transition-colors">
                          {item.title}
                        </h4>
                      </Link>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1.5 block">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-brand-blue text-sm tracking-tight">{formatPrice(parsePrice(item.price) * item.quantity)}</span>
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

          <div className="space-y-4 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-200/50">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
              <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
              <span className="text-blue-600 font-bold uppercase tracking-widest text-[11px]">{subtotal > 0 ? "Free" : formatPrice(0)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Estimated Tax</span>
              <span className="text-gray-900 font-bold">{formatPrice(estimatedTax)}</span>
            </div>

            <div className="h-px bg-gray-200/50 my-2"></div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Total</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Incl. VAT</span>
              </div>
              <span className="text-3xl font-black text-brand-blue leading-none tracking-tighter">{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            shape="rounded-sm"
            onClick={handleCompleteOrder}
            className={`w-full text-base h-[60px] text-white shadow-xl transition-all font-black rounded-2xl flex items-center justify-center gap-3 ${cartItems.length > 0
              ? "bg-brand-blue shadow-brand-blue/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-[0.98]"
              : "bg-gray-400 cursor-not-allowed opacity-50"
              }`}
            disabled={cartItems.length === 0}
          >
            <span>Complete Order</span>
            <Icon name="arrow_forward" size="md" className="opacity-60" />
          </Button>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-brand-blue-light rounded-full w-fit mx-auto border border-blue-100 shadow-sm shadow-blue-100/50">
              <Icon name="verified_user" size="xs" className="text-blue-600" />
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Secure 256-bit SSL encryption</span>
            </div>

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
