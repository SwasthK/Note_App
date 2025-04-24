'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  PenSquare,
  Archive,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
  BookTemplate,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTags } from '@/lib/hooks/useTags'
import { CreateTagDialog, DeleteTagDialog } from './CreateTagDialog'
import { useStore } from '@/lib/store/useStore'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from 'sonner'
import { Tag } from '@/lib/types'


export function Sidebar() {
  const pathname = usePathname()
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<{ id: string; name: string } | null>(null)
  const { tags = [], deleteTag } = useTags()
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  
  // Add sidebar collapse state
  const isSidebarOpen = useStore(state => state.isSidebarOpen)
  const toggleSidebar = useStore(state => state.toggleSidebar)

  return (
    <div className={cn(
      "border-r h-screen bg-[#18181B] border-dashed transition-all duration-300",
      isSidebarOpen ? "w-64" : "w-[60px]"
    )}>
      <div className="flex items-center justify-end p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-3.5rem)] py-4">
        <div className={cn(
          "space-y-6",
          isSidebarOpen ? "px-3" : "px-2"
        )}>
          {/* Main Navigation */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <span className={cn(
                "flex items-center py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === '/dashboard' && 'bg-accent',
                isSidebarOpen ? "px-3" : "px-2 justify-center"
              )}>
                <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Dashboard</span>}
              </span>
            </Link>
            <Link href="/dashboard/notes/new">
              <span className={cn(
                "flex items-center py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === '/dashboard/notes/new' && 'bg-accent',
                isSidebarOpen ? "px-3" : "px-2 justify-center"
              )}>
                <PenSquare className="h-4 w-4 flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">New Note</span>}
              </span>
            </Link>
            {/* <Link href="/dashboard/favorites">
              <span className={cn(
                "flex items-center py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === '/dashboard/favorites' && 'bg-accent',
                isSidebarOpen ? "px-3" : "px-2 justify-center"
              )}>
                <Star className="h-4 w-4 flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Favorites</span>}
              </span>
            </Link>
            <Link href="/dashboard/archived">
              <span className={cn(
                "flex items-center py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === '/dashboard/archived' && 'bg-accent',
                isSidebarOpen ? "px-3" : "px-2 justify-center"
              )}>
                <Archive className="h-4 w-4 flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Archived</span>}
              </span>
            </Link> */}
          </div>

          {isSidebarOpen && (
            <>
              {/* Categories Section */}
              <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <div className="flex items-center justify-between px-3">
                  <h2 className="text-sm font-semibold">Categories</h2>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setIsTagDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent className="space-y-1 mt-1">
                  {tags.map((tag: Tag) => (
                    <div key={tag.id} className="flex items-center group">
                      <Link 
                        href={`/dashboard/category/${tag.id}`}
                        className="flex-1"
                      >
                        <span className={cn(
                          "flex items-center w-full py-2 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          pathname === `/dashboard/category/${tag.id}` && 'bg-accent'
                        )}>
                          <div 
                            className="h-3 w-3 rounded-full mr-2"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setTagToDelete({ id: tag.id, name: tag.name })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

            </>
          )}
        </div>
      </ScrollArea>

      <CreateTagDialog 
        open={isTagDialogOpen} 
        onOpenChange={setIsTagDialogOpen}
      />

      <DeleteTagDialog
        open={!!tagToDelete}
        onOpenChange={(open) => !open && setTagToDelete(null)}
        tagId={tagToDelete?.id || ''}
        tagName={tagToDelete?.name || ''}
      />
    </div>
  )
} 