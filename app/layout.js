'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "@/redux/provider/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: "TV Management System",
  description: "TV Management System",
};

export default function RootLayout({ children }) {
  // Initialize variables for adminId and deviceId
  let storedAdminId = null;
  let storedDeviceId = null;

  // Check if the code is running in the browser
  if (typeof window !== 'undefined') {
    storedAdminId = localStorage.getItem('adminId');
    storedDeviceId = localStorage.getItem('deviceId');
  }

  return (
    <StoreProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SidebarProvider>
            <div className="flex flex-grow">
              {/* Render Sidebar Trigger only if adminId is available */}
              {storedAdminId ? <SidebarTrigger /> : null}
              <main className="w-full">
                <ToastContainer theme="dark" />
                {children}
              </main>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
