'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./pcomponents/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button } from "@/components/ui/button";
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
  return (
    <StoreProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <SidebarProvider>
          <div className="flex flex-grow">

         <AppSidebar/>
         {/* <Button className="bg-red-500">Submit</Button> */}
         
         <main className="w-full">
        {/* <Navbar/> */}
        <SidebarTrigger/>
        <ToastContainer theme="dark"/>
        {children}
        </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
    </StoreProvider>

  );
  
}
