'use client'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { useStore } from "@/lib/store/useStore"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isSidebarOpen = useStore(state => state.isSidebarOpen)

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={cn(
          "flex-1 overflow-y-auto bg-zinc-900 transition-all duration-300",
          isSidebarOpen ? "md:pl-8" : "md:pl-[60px]"
        )}>
          {children}
        </main>
      </div>
    </div>
  )
} 