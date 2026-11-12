import type { Metadata, Viewport } from "next";
import { Geist_Mono, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { PageWrapper } from "./components/Mobile/PageWrapper";
import { AuthModal } from "./components/Modal/AuthModal";
import { DynamicToaster } from "./components/ui/DynamicToaster";
import { SocketProvider } from "@/app/context/SocketContext";
import { SocketNotificationListener } from "./components/SocketNotificationListener";
import OfflineBanner from "@/app/components/ui/OfflineBanner";
import { FilterProvider } from "./context/FilterContext";
import StoreProvider from "@/lib/redux/StoreProvider";
import { AuthPersistence } from "./components/Auth/AuthPersistence";
import { AdminSessionProvider } from "./context/AdminSessionContext";
import { OfficeLocationProvider } from "./context/OfficeLocationContext";
import { AdminLayoutWrapper } from "./components/Admin/AdminLayoutWrapper";
import Script from "next/script";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "People Store Admin",
  description: "People Store Admin Dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
        <DynamicToaster />
        <StoreProvider>
          <AdminSessionProvider>
            <OfficeLocationProvider>
              <FilterProvider>
                <AuthPersistence>
                  <SocketProvider>
                    <SocketNotificationListener />
                    <OfflineBanner />
                    <AuthModalProvider>
                      <MobileMenuProvider>
                        <PageWrapper>
                          <AdminLayoutWrapper>
                            {children}
                          </AdminLayoutWrapper>
                        </PageWrapper>
                      </MobileMenuProvider>
                      <AuthModal />
                    </AuthModalProvider>
                  </SocketProvider>
                </AuthPersistence>
              </FilterProvider>
            </OfficeLocationProvider>
          </AdminSessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
