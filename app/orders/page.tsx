import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { OrdersList } from "../components/Orders/OrdersList";

export const metadata = {
  title: "My Orders | Bloom & Mist",
  description: "View and manage your order history",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black">
      <Header />

      <div className="flex-1 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-4 md:py-8 flex flex-col gap-4 md:gap-8 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none pb-2">
          <Link href="/" className="hover:text-brand-gold transition-colors">
            Home
          </Link>
          <Icon name="chevron_right" size="xs" />
          <span className="text-gray-600 font-bold">My Orders</span>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-outfit font-light text-gray-900 uppercase tracking-[0.1em]">
                Order <span className="font-bold">History</span>
              </h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Your recent transactions</p>
            </div>
          </div>

          <OrdersList />
        </div>
      </div>

      <Footer />
    </div>
  );
}
