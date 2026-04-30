import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Outfit, Lato } from "next/font/google";
import "./globals.css";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { MobileMenuSidebar } from "./components/Mobile/MobileMenuSidebar";
import { PageWrapper } from "./components/Mobile/PageWrapper";
import { AuthModal } from "./components/Modal/AuthModal";
import { Toaster } from "sonner";
import { SocketProvider } from "@/app/context/SocketContext";
import { SocketNotificationListener } from "./components/SocketNotificationListener";
import OfflineBanner from "@/app/components/ui/OfflineBanner";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import { FilterProvider } from "./context/FilterContext";
import StoreProvider from "@/lib/redux/StoreProvider";
import { AuthPersistence } from "./components/Auth/AuthPersistence";
import { SessionProvider } from "./context/SessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Bloom & Mist",
  description: "Bloom & Mist - Luxury Perfumes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full font-inter">
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
        <Toaster richColors closeButton position="bottom-right" />
        <StoreProvider>
          <SessionProvider>
            <CustomerAuthProvider>
              <RecentlyViewedProvider>
                <FilterProvider>
                  <AuthPersistence>
                    <SocketProvider>
                      <SocketNotificationListener />
                      <OfflineBanner />
                      <AuthModalProvider>
                        <CartProvider>
                          <WishlistProvider>
                            <MobileMenuProvider>
                              <MobileMenuSidebar />
                              <PageWrapper>
                                {children}
                              </PageWrapper>
                            </MobileMenuProvider>
                          </WishlistProvider>
                        </CartProvider>
                        <AuthModal />
                      </AuthModalProvider>
                    </SocketProvider>
                  </AuthPersistence>
                </FilterProvider>
              </RecentlyViewedProvider>
            </CustomerAuthProvider>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
