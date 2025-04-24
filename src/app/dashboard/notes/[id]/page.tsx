'use client'

import { useRouter } from 'next/navigation'
import { useNote } from '@/lib/hooks/useNotes'
import { useState } from 'react'
import { useDeleteNote } from '@/lib/hooks/useNotes'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Edit, Trash2, ArrowLeft } from 'lucide-react'
import { DeleteNoteDialog } from '@/components/notes/DeleteNoteDialog'
import { Loading } from '@/components/ui/loading'

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params // ✅ destructure here normally
  const { data: note, isLoading } = useNote(id)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteNote = useDeleteNote()

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Loading text="Loading note..." />
        </CardContent>
      </Card>
    )
  }

  if (!note) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Note not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/notes/${note.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          {note.content}
        </div>
      </CardContent>
      <DeleteNoteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          deleteNote.mutate(note.id, {
            onSuccess: () => {
              toast.success('Note deleted successfully')
              router.push('/dashboard')
            },
            onError: () => {
              toast.error('Failed to delete note')
            },
          })
        }}
      />
    </Card>
  )
}
