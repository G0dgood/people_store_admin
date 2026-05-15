"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OfficeLocationHeader } from "../components/OfficeLocationHeader";
import { GoBackButton } from "../components/go-back-button";
import OrderSuccessModal from "../components/Modal/OrderSuccessModal";
import HomeDeliveryModal, { DeliveryDetails } from "../components/Modal/HomeDeliveryModal";
import OrderReviewModal from "../components/Modal/OrderReviewModal";
import Dropdown from "@/app/components/Form/Dropdown";
import { CustomerCheckoutSkeleton } from "../components/Skeleton/CustomerCheckoutSkeleton";
import { useCart, CartItem } from "@/app/officelocation/context/CartContext";
import { useOfficeLocationInfo } from "@/app/context/OfficeLocationContext";
import { getShopUrl, getStoreUrl, parseStoreContextFromUrl } from "../utils/storeUtils";
import { usePayOrderCashMutation, useCreateOrderPaymentIntentMutation, useVerifyOrderPaymentQuery } from "@/lib/redux/services/orderApi";
import { toast } from "sonner";
import { useApiError } from "@/app/hooks/useApiError";
import { InfoBanner } from "@/app/officelocation/components/InfoBanner";
import { SVGLoaderFetch } from "@/app/components/Options";
import { useGetOfficeBySubdomainQuery } from "@/lib/redux/services/officeApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentUser } from "@/lib/redux/features/authSlice";

function OfficeLocationCheckoutPageContent() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { storeContext, updateStoreContext, officelocation } = useOfficeLocationInfo();
  const user = useAppSelector(selectCurrentUser);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: officeRes, isLoading: isLoadingOffice } = useGetOfficeBySubdomainQuery(
    storeContext?.subdomain || "",
    { skip: !storeContext?.subdomain }
  );
  const office = officeRes?.data;

  const [payOrderCash, { isLoading: isPaying, isError, error }] = usePayOrderCashMutation();
  const [createPaymentIntent, { isLoading: isInitializingPayment, isError: isPaymentError, error: paymentError }] = useCreateOrderPaymentIntentMutation();

  useApiError(isError, error, "Failed to process order");
  useApiError(isPaymentError, paymentError, "Failed to initialize payment");

  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isHomeDeliveryModalOpen, setIsHomeDeliveryModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<{ details: DeliveryDetails; paymentType: "paystack" | "instore" } | null>(null);
  const [orderStatus, setOrderStatus] = useState("Pending in-store payment");

  // Payment verification logic
  const trxref = searchParams.get("trxref");
  const reference = searchParams.get("reference") || trxref;

  const {
    isLoading: isVerifying,
    isSuccess: isVerified,
    isError: isVerificationError,
    error: verificationError
  } = useVerifyOrderPaymentQuery(reference ? { reference } : (undefined as any), {
    skip: !reference
  });

  useApiError(isVerificationError, verificationError, "Payment verification failed");

  useEffect(() => {
    const searchString = window.location.search.substring(1);
    const context = parseStoreContextFromUrl(searchParams, searchString);

    if (context) {
      // Deep comparison to prevent infinite loop
      // Only update if subdomain changed OR if the URL provides a DIFFERENT non-empty ID
      const isDifferent =
        context.subdomain !== storeContext?.subdomain ||
        (context.officeId && context.officeId !== storeContext?.officeId);

      if (isDifferent) {
        updateStoreContext({
          subdomain: context.subdomain,
          officeId: context.officeId || storeContext?.officeId,
          officeName: storeContext?.officeName,
        });
      }
    } else if (storeContext?.subdomain && !reference) {
      // If no context in URL but we have it in state, redirect to include it
      const newUrl = getShopUrl("/officelocation/checkout", storeContext.subdomain, storeContext?.officeId);
      router.replace(newUrl);
    }

  }, [searchParams, updateStoreContext, storeContext, router, reference]);



  useEffect(() => {
    if (isVerified) {
      setOrderStatus("Payment Successful (Order Confirmed)");
      setIsSuccessModalOpen(true);
      clearCart();
    }
  }, [isVerified, clearCart]);

  useEffect(() => {
    // If we have success=true but no reference (legacy or other), show success anyway
    // but the verification logic above should handle it if a reference exists.
    const success = searchParams.get("success");
    if (success === "true" && !reference) {
      setOrderStatus("Order Confirmed");
      setIsSuccessModalOpen(true);
      clearCart();
    }
  }, [searchParams, clearCart, reference]);

  const deliveryOptions = [
    { value: "home", label: "Home Delivery" },
    { value: "pickup", label: "Pickup Station" },
  ];

  // Calculations
  const estimatedTotal = subtotal;

  const handlePayment = (type: "paystack" | "instore" | "home") => {
    if (type === "paystack" && !officelocation) {
      toast.error("Please login to proceed with online payment");
      return;
    }

    if (type === "home" && !officelocation) {
      toast.error("Please login to proceed with home delivery");
      return;
    }



    if (type === "paystack" || type === "instore") {
      setReviewData({
        details: {
          address: "Pickup Station",
          fullName: officelocation?.fullName || user?.fullName || "Guest Customer",
          phoneNumber: officelocation?.phoneNumber || user?.phoneNumber || "",
          email: officelocation?.email || user?.email || "",
        },
        paymentType: type
      });
      setIsReviewModalOpen(true);
    } else if (type === "home") {
      setIsHomeDeliveryModalOpen(true);
    }
  };

  const handleHomeDeliverySave = (details: DeliveryDetails, paymentType: "paystack" | "instore") => {
    setReviewData({ details, paymentType });
    setIsHomeDeliveryModalOpen(false);
    setIsReviewModalOpen(true);
  };

  const handleOrderConfirm = async () => {
    if (!reviewData) return;
    const { details, paymentType } = reviewData;

    if (paymentType === "instore") {
      const payload = {
        officeId: storeContext?.officeId || "",
        customerEmail: details.email || officelocation?.email || "",
        customerId: officelocation?.id || officelocation?._id || undefined,
        items: items?.map((item: CartItem) => ({
          officeInventoryId: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        })),
        billingAddress: {
          address: details.address,
          fullName: details.fullName,
          phoneNumber: details.phoneNumber,
          email: details.email
        },
        deliveryAddress: {
          address: details.address,
          fullName: details.fullName,
          phoneNumber: details.phoneNumber,
          email: details.email
        },
        payment: {
          method: "CASH" as const
        }
      };

      try {
        await payOrderCash(payload).unwrap();
        setOrderStatus(`${deliveryMethod === "home" ? "Home delivery order" : "Pickup order"} placed successfully`);
        setIsReviewModalOpen(false);
        setIsSuccessModalOpen(true);
        clearCart();
      } catch {
        // useApiError hook will handle the toast notification
      }
    } else if (paymentType === "paystack") {
      const payload = {
        officeId: storeContext?.officeId || "",
        customerEmail: details.email || officelocation?.email || "",
        customerId: officelocation?.id || officelocation?._id || "",
        items: items?.map(item => ({
          officeInventoryId: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        })),
        billingAddress: {
          address: details.address,
          fullName: details.fullName,
          phoneNumber: details.phoneNumber,
          email: details.email
        },
        deliveryAddress: {
          address: details.address,
          fullName: details.fullName,
          phoneNumber: details.phoneNumber,
          email: details.email
        },
        payment: {
          method: "CARD" as const
        },
        callback_url: `${window.location.origin}${getStoreUrl(storeContext?.subdomain, storeContext?.officeId)}`
      };



      try {
        const response = await createPaymentIntent(payload).unwrap();
        if (response?.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          toast.error("Failed to get payment link");
        }
      } catch {
        // useApiError hook will handle the toast notification
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoadingOffice && !office && !reference) {
    return <CustomerCheckoutSkeleton />;
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <SVGLoaderFetch text="Verifying your payment..." asTable={false} />
        <p className="mt-4 text-sm text-[rgba(31,31,31,0.5)] font-sans">
          Please do not refresh the page or close your browser.
        </p>

        {isVerificationError && (
          <div className="mt-8">
            <button
              onClick={() => router.push(getStoreUrl(storeContext?.subdomain, storeContext?.officeId))}
              className="text-[#156BB6] underline underline-offset-4 font-sans text-sm"
            >
              Return to shopping
            </button>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      <OfficeLocationHeader />

      <section className="mx-auto max-w-[1440px] px-6 pt-12 pb-32 md:pb-16 md:px-12">
        <div className="mb-6">
          <GoBackButton href={getShopUrl("/officelocation/cart", storeContext?.subdomain, storeContext?.officeId)} />
        </div>

        <h1 className="mb-8 font-sans font-normal text-[25px] leading-[42px] tracking-[-0.03em] text-[#1F1F1F]">
          Checkout
        </h1>

        {!deliveryMethod && (
          <InfoBanner
            message="Please select a Delivery Method to see available payment options."
            type="info"
            className="mb-8"
          />
        )}

        <section className="mb-12 ">
          <h2 className="mb-4 font-sans font-normal text-[14px] leading-[23px] tracking-[-0.02em] text-black">
            Delivery Methods
          </h2>
          <div className="md:w-[300px] w-full">
            <Dropdown
              value={deliveryMethod}
              onChange={setDeliveryMethod}
              options={deliveryOptions}
              placeholder="Choose delivery method"
              className="w-full"
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 font-sans font-normal text-[14px] leading-[23px] tracking-[-0.02em] text-black">
            Items Ordered
          </h2>
          <div className="flex flex-col gap-4">
            {items.map((item: CartItem) => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between items-center text-[14px] font-sans">
                <div className="flex flex-col">
                  <span className="font-medium text-[#1F1F1F]">{item.name}</span>
                  {item.selectedColor && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-[rgba(31,31,31,0.5)]">Color:</span>
                      <div
                        className="h-3 w-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: item.selectedColor }}
                        title={item.selectedColor}
                      />
                    </div>
                  )}
                  {item.selectedSize && (
                    <span className="text-[12px] text-[rgba(31,31,31,0.5)]">Size: {item.selectedSize}</span>
                  )}
                </div>
                <span className="text-[rgba(31,31,31,0.5)]">
                  {item.quantity} {item.stockUnit || "Units"} × {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12  border-b border-[#F4F4F4] py-8">
          <div className="flex flex-col gap-6">            <div className="border-t border-b border-[#F4F4F4]">
            <div className="flex justify-between items-center mt-10">
              <span className="font-sans font-normal text-[14px] leading-[42px] tracking-[-0.03em] text-black">
                Subtotal <span className="font-sans font-normal text-[12px] leading-[23px] tracking-[-0.03em] text-[rgba(31,31,31,0.5)]">({totalItems} items)</span>
              </span>
              <span className="font-sans font-normal text-[18px] leading-[42px] tracking-[-0.02em] text-[rgba(31,31,31,0.5)]">{formatCurrency(subtotal)}</span>
            </div>
          </div>


          </div>

          <div className="mt-12 flex justify-between items-center ">
            <span className="font-sans font-normal text-[18px] leading-[42px] tracking-[-0.03em] text-[#1F1F1F]">Estimated Total</span>
            <span className="ffont-sans  text-[18px] leading-[42px] tracking-[-0.03em] text-[#156BB6] !font-bold">{formatCurrency(estimatedTotal)}</span>
          </div>
        </section>

        {deliveryMethod && (
          <section className="mt-8 transition-all duration-300">
            <h2 className="mb-2 font-sans font-normal text-[14px] leading-[42px] tracking-[-0.03em] text-black">
              {deliveryMethod === "home" ? "Home Delivery" : "Payment Methods"}
            </h2>
            <p className="font-sans font-normal text-[12px] leading-[23px] tracking-[-0.02em] text-[rgba(31,31,31,0.5)]">
              {deliveryMethod === "home"
                ? "Complete your order with home delivery"
                : "There are two payments methods available choose from the methods below"}
            </p>

            <div className="flex flex-row justify-between items-center gap-4 mt-10">
              {deliveryMethod === "home" ? (
                <button
                  onClick={() => handlePayment("home")}
                  className="box-border flex flex-row items-center justify-center gap-[10px] px-[23px] py-[18px] w-full h-[50px] bg-[rgba(217,217,217,0.11)] border border-[rgba(217,217,217,0.35)] rounded-[10px] text-[#1F1F1F] transition-all hover:border-[#156BB6] hover:bg-[#F0F7FF] hover:text-[#156BB6] font-sans font-medium text-[14px] leading-[23px] tracking-[-0.02em] "
                >
                  Home Delivery
                </button>
              ) : (
                <>
                  {!user && (
                    <button
                      onClick={() => handlePayment("paystack")}
                      className={`box-border flex flex-row items-center justify-center gap-[10px] px-[23px] py-[18px] !h-[50px] bg-[rgba(217,217,217,0.11)] border border-[rgba(217,217,217,0.35)] rounded-[10px] text-[#1F1F1F] transition-all hover:border-[#156BB6] hover:bg-[#F0F7FF] hover:text-[#156BB6] font-sans font-medium text-[14px] leading-[23px] tracking-[-0.02em] w-full`}
                    >
                      Pay Online (Paystack)
                    </button>
                  )}
                  {user && (
                    <button
                      onClick={() => handlePayment("instore")}
                      className="box-border flex flex-row items-center justify-center gap-[10px] px-[23px] py-[18px] w-full h-[50px] bg-[rgba(217,217,217,0.11)] border border-[rgba(217,217,217,0.35)] rounded-[10px] text-[#1F1F1F] transition-all hover:border-[#156BB6] hover:bg-[#F0F7FF] hover:text-[#156BB6] font-sans font-medium text-[14px] leading-[23px] tracking-[-0.02em] "
                    >
                      Pay In-Store
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </section>

      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push(getStoreUrl(storeContext?.subdomain, storeContext?.officeId));
        }}
        status={orderStatus}
      />

      <HomeDeliveryModal
        isOpen={isHomeDeliveryModalOpen}
        onClose={() => setIsHomeDeliveryModalOpen(false)}
        onSave={handleHomeDeliverySave}
        initialData={{
          fullName: officelocation?.fullName || "",
          email: officelocation?.email || "",
          phoneNumber: officelocation?.phoneNumber || "",
          address: officelocation?.address || "",
        }}
      />

      {reviewData && (
        <OrderReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onConfirm={handleOrderConfirm}
          isProcessing={isPaying || isInitializingPayment}
          orderDetails={{
            items: items.map(i => ({
              id: i?.id,
              name: i?.name,
              quantity: i?.quantity,
              price: i?.price,
              stockUnit: i?.stockUnit,
              selectedColor: i?.selectedColor,
              selectedSize: i?.selectedSize,
              variantId: i?.variantId
            })),
            deliveryDetails: reviewData.details,
            paymentMethod: reviewData.paymentType,
            summary: {
              subtotal,
              deliveryFee: 0,
              gatewayFee: 0,
              total: estimatedTotal
            }
          }}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CustomerCheckoutSkeleton />}>
      <OfficeLocationCheckoutPageContent />
    </Suspense>
  );
}
