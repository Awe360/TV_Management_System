'use client'


import { Calendar, Home, Inbox, LogOut, Search, Settings, Tv, Upload, User, Video } from "lucide-react"
import { BsDisplay } from "react-icons/bs";

import { MdSmartDisplay } from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";


// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  // {
  //   title: "Display",
  //   url: "/display",
  //   icon: Video,
  // },
  {
    title: "Upload",
    url: "/tvupload",
    icon: Upload,
  },
  {
    title: "Register new TV",
    url: "/newtv",
    icon: Tv,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]
const account=[{
  title:"Profile",
  url:"/profile",
  icon:User,
},
{
  title:"Logout",
  url:"#",
  icon:LogOut,
},
]

export function AppSidebar() {
  const adminId = typeof window !== 'undefined' ? localStorage.getItem('adminId') : null;
  const deviceId = typeof window !== 'undefined' ? localStorage.getItem('deviceId') : null;
  const deviceType=useSelector((state)=>state.tvReducer.deviceType);
  const router=usePathname();
  // const isActive=router.includes(`/${item.url}`)
console.log("awoke",router);
console.log("device:",deviceType);
if(deviceId || (!adminId && !deviceId)){
  return null;
}
  return (
    
    <Sidebar className="bg-blue-900 text-white w-64  border-t-2 ">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-10 text-gray-400 text-2xl mb-5 ">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="">
              {items.map((item) => (
               <SidebarMenuItem
  key={item.title}
  className={`group flex items-center gap-3 px-4 py-2 ${
    router.includes(`${item.url}`)
      ? 'bg-blue-500  shadow-lg rounded-xl' 
      : '  hover:bg-blue-500 rounded-xl'
  } my-1 transition-all duration-300`}
>
                  <SidebarMenuButton asChild className="w-full">
                    <a
                      href={item.url}
                      className="flex items-center px-4 py-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white"
                    >
                      <item.icon className="mr-3"  />
                      <span className="text-xl">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup>
          <SidebarGroupLabel className="mt-5 text-gray-400 text-2xl mb-5 ">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="">
              {account.map((item) => (
               <SidebarMenuItem
  key={item.title}
  className={`group flex items-center gap-3 px-4 py-2 ${
    router.includes(`${item.url}`) 
      ? 'bg-blue-500  shadow-lg rounded-xl' 
      : '  hover:bg-blue-500 rounded-xl'
  } my-1 transition-all duration-300`}
>
                  <SidebarMenuButton asChild className="w-full">
                    <a
                      href={item.url}
                      className="flex items-center px-4 py-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white"
                    >
                      <item.icon className="mr-3"  />
                      <span className="text-xl">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
