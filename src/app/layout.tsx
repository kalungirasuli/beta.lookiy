import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import LoadingProvider from "@/components/LoadingProvider";
import AppWrapper from "@/components/AppWrapper";
import { UserProvider } from "@/contexts/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lookiy - Discover and Join Networks Instantly",
  description: "Search for networks in real-time and connect with nodes around the world.",
  icons: {
    icon: '/logomin.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} antialiased`}
      >
        <LoadingProvider>
          <UserProvider>
            <AppWrapper>
              <div className="overflow-scroll-container">
                {children}
              </div>
            </AppWrapper>
          </UserProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
