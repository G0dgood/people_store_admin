import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Outfit, Lato } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full font-inter">
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
