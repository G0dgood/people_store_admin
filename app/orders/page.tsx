import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { OrdersList } from "../components/Orders/OrdersList";

export const metadata = {
  title: "My Orders | Storefront",
  description: "View and manage your order history",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-inter">
      <Header />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="text-sm text-gray-500 mb-6 hidden md:flex items-center gap-2">
           <span>Home</span>
           <span className="text-gray-300">/</span>
           <span className="text-gray-900 font-medium">My Orders</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6 font-outfit">Order History</h1>
        
        <OrdersList />
      </main>

      <Footer />
    </div>
  );
}
