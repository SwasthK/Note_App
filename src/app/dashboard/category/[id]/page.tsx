'use client'

import { useNotes } from "@/lib/hooks/useNotes"
import { useTags } from "@/lib/hooks/useTags"
import { NoteCard } from "@/components/notes/NoteCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CategoryPage({ params }: { params: { id: string } }) {
  const { data: tag, isLoading: tagLoading } = useTags()
  const { data: notes = [], isLoading: notesLoading } = useNotes({ tagId: params.id })

  if (tagLoading || notesLoading) {
    return <div>Loading...</div>
  }

  if (!tag) {
    return <div>Category not found</div>
  } 

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <h1 className="text-2xl font-bold">{tag.name}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                <NoteCard note={note} />
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-zinc-400">
              <p className="text-lg">No notes in this category</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/notes/new">Create a note</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 