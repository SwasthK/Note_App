'use client'

import { NoteCard } from "@/components/notes/NoteCard"
import { useNotes } from "@/lib/hooks/useNotes"
import { useStore } from "@/lib/store/useStore"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { data: notes = [], isLoading } = useNotes()
  const activeTab = useStore(state => state.activeTab)
  const setActiveTab = useStore(state => state.setActiveTab)
  const searchQuery = useStore(state => state.searchQuery)
  const sortBy = useStore(state => state.sortBy)
  const setSortBy = useStore(state => state.setSortBy)

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      // First apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        return note.title.toLowerCase().includes(searchLower) ||
               note.content.toLowerCase().includes(searchLower)
      }
      return true
    })
    .filter(note => {
      // Then apply tab filter
      switch (activeTab) {
        case 'favorites':
          return note.is_pinned
        case 'archived':
          return note.is_archived === true // Explicit comparison
        case 'all':
        default:
          return !note.is_archived // Show only non-archived notes in All
      }
    })
    .sort((a, b) => {
      // Finally apply sorting
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 py-6">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Notes</h1>
            <Button asChild>
              <Link href="/dashboard/notes/new">
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Link>
            </Button>
          </div>

          {/* Navigation and Sorting Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
                <TabsTrigger value="all">All Notes</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="updated">Last updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[200px] rounded-lg animate-pulse bg-zinc-800/50" />
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                  <NoteCard note={note} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <p className="text-lg">
                {activeTab === 'archived' ? 'No archived notes' :
                 activeTab === 'favorites' ? 'No favorite notes' :
                 searchQuery ? 'No notes match your search' : 'No notes found'}
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/dashboard/notes/new">Create your first note</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 