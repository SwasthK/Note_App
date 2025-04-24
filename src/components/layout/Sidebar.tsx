'use client'

import { useStore } from "@/lib/store/useStore"
import { Button } from "@/components/ui/button"
import { useTags } from "@/lib/hooks/useTags"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Sidebar() {
  const isSidebarOpen = useStore(state => state.isSidebarOpen)
  const toggleSidebar = useStore(state => state.toggleSidebar)
  const { tags, isLoading } = useTags()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Categories</h2>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/tags/new">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New category</span>
                </Link>
              </Button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                tags?.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive(`/dashboard/tags/${tag.id}`) && "bg-accent"
                    )}
                    asChild
                  >
                    <Link href={`/dashboard/tags/${tag.id}`}>
                      <div
                        className="mr-2 h-3 w-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </Link>
                  </Button>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          "fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-[280px] border-r bg-background md:block",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/tags/new">
                <Plus className="h-4 w-4" />
                <span className="sr-only">New category</span>
              </Link>
            </Button>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              tags?.map((tag) => (
                <Button
                  key={tag.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive(`/dashboard/tags/${tag.id}`) && "bg-accent"
                  )}
                  asChild
                >
                  <Link href={`/dashboard/tags/${tag.id}`}>
                    <div
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </Link>
                </Button>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  )
} 