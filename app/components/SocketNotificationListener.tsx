"use client";

import React, { useEffect } from "react";
import { useSocket } from "@/app/context/SocketContext";
import { toast } from "sonner";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { toastSuccess, toastInfo } from "../utils/toastWithSound";
import { OrderDeliveredModal } from "./Modal/OrderDeliveredModal";
import { useDispatch } from "react-redux";
import { Icon } from "./Icon";
import { roleApi } from "@/lib/redux/services/roleApi";
import { cartApi } from "@/lib/redux/services/cartApi";
import { getIsNavigating } from "../utils/navigationState";

export const SocketNotificationListener = () => {
  const { on, off, isConnected } = useSocket();
  const { customer } = useCustomerAuth();
  const dispatch = useDispatch();
  const [isDeliveredModalOpen, setIsDeliveredModalOpen] = React.useState(false);
  const [deliveredOrder, setDeliveredOrder] = React.useState<any>(null);

  useEffect(() => {
    if (!isConnected) return;

    const handlePermissionsUpdated = (data: any) => {

      // Force refresh the role privileges globally
      if (data.roleId) {
        dispatch(roleApi.util.invalidateTags([{ type: 'Role', id: data.roleId }]));
      } else {
        dispatch(roleApi.util.invalidateTags(['Role']));
      }

      toast.info("Access Privileges Updated", {
        description: data.description || "Your access permissions have been modified. Your dashboard is updating...",
        duration: 8000,
        icon: (
          <div className="bg-brand-gold/10 p-1.5 rounded-full ring-4 ring-brand-gold/5">
            <Icon name="verified_user" folder="icon" size="xs" className="text-brand-gold" />
          </div>
        ),
      });
    };

    const handleNewCustomer = (data: any) => {

      toast.success("New Member Joined!", {
        description: `${data.name} just created an account.`,
        duration: 5000,
        icon: <div className="bg-brand-gold/10 p-1 rounded-full"><Icon name="group" size="xs" className="text-brand-gold" /></div>,
        action: {
          label: "View Profile",
          onClick: () => console.log("Navigate to customer profile", data.id)
        }
      });
    };

    const handleRefundUpdate = (data: any) => {

      const isNew = data.status === "Pending";

      toast(isNew ? "New Refund Request" : "Refund Status Updated", {
        description: isNew
          ? `A new refund request for Order ${data.order?.orderId || "..."} has been submitted.`
          : `Refund request for ${data.order?.orderId || "..."} is now ${data.status}.`,
        duration: 6000,
        icon: (
          <div className={`p-1 rounded-full ${isNew ? "bg-amber-100" : "bg-blue-100"}`}>
            <Icon
              name={isNew ? "cached" : "verified"}
              folder="icon"
              size="xs"
              className={isNew ? "text-amber-600" : "text-blue-600"}
            />
          </div>
        ),
      });
    };

    const handleOrderStatusChanged = (order: any) => {
      // Only show for the customer who owns the order
      if (customer && (order.customer?._id === customer._id || order.customer === customer._id)) {
        toastInfo("Order Status Updated", {
          description: `Your order #${order.orderId || order._id.slice(-6).toUpperCase()} is now ${order.status}.`,
          duration: 8000,
          icon: (
            <div className="bg-brand-gold/10 p-1.5 rounded-full ring-4 ring-brand-gold/5">
              <Icon name="shopping_bag" size="xs" className="text-brand-gold" />
            </div>
          ),
        });

        // If delivered, show the special modal
        if (order.status === "Delivered") {
          setDeliveredOrder(order);
          setIsDeliveredModalOpen(true);
        }
      }
    };

    const handleCartUpdated = (data: any) => { 

      // Invalidate cart tags to trigger a re-fetch on this device
      dispatch(cartApi.util.invalidateTags(["Cart"]));

      // Optional: show a small notification if it's a significant change
      if (data.message && !getIsNavigating()) {
        // We might want to be careful not to show too many toasts
        // toastInfo("Cart Synced", { description: data.message });
      }
    };

    on("permissions_updated", handlePermissionsUpdated);
    on("newCustomer", handleNewCustomer);
    on("refund:update", handleRefundUpdate);
    on("orderStatusChanged", handleOrderStatusChanged);
    on("cart_updated", handleCartUpdated);

    return () => {
      off("permissions_updated", handlePermissionsUpdated);
      off("newCustomer", handleNewCustomer);
      off("refund:update", handleRefundUpdate);
      off("orderStatusChanged", handleOrderStatusChanged);
      off("cart_updated", handleCartUpdated);
    };
  }, [isConnected, on, off, dispatch]);

  return (
    <OrderDeliveredModal
      isOpen={isDeliveredModalOpen}
      onClose={() => setIsDeliveredModalOpen(false)}
      order={deliveredOrder}
    />
  );
};
