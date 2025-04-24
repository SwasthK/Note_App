'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { 
  MoreHorizontal, 
  Star, 
  Archive, 
  Trash2,
  ExternalLink,
  MoreVertical,
  Trash,
} from 'lucide-react'
import { Note } from '@/lib/types'
import {
  Card,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useDeleteNote, useUpdateNote } from '@/lib/hooks/useNotes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from 'date-fns'

interface NoteCardProps {
  note: Note
  viewMode: 'grid' | 'list'
}

export function NoteCard({ note, viewMode }: NoteCardProps) {
  const router = useRouter()
  const { mutate: deleteNote } = useDeleteNote()
  const { mutate: updateNote } = useUpdateNote()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  console.log(setIsDeleting)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateNote(
      { id: note.id, is_pinned: !note.is_pinned },
      {
        onSuccess: () => {
          toast.success(note.is_pinned ? 'Removed from favorites' : 'Added to favorites')
        },
        onError: () => {
          toast.error('Failed to update note')
        }
      }
    )
  }

  const handleArchive = () => {
    updateNote(
      { 
        id: note.id, 
        is_archived: !note.is_archived 
      },
      {
        onSuccess: () => {
          toast.success(note.is_archived ? 'Note unarchived' : 'Note archived')
        },
        onError: (error) => {
          console.error('Archive error:', error)
          toast.error('Failed to update note')
        }
      }
    )
  }

  const tag = note.tags

  if (viewMode === 'list') {
    return (
      <div 
        className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => router.push(`/dashboard/notes/${note.id}`)}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`shrink-0 ${note.is_pinned ? 'text-yellow-500' : 'text-muted-foreground'}`}
          onClick={handleToggleFavorite}
        >
          <Star className="h-4 w-4" fill={note.is_pinned ? 'currentColor' : 'none'} />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{note.title}</h3>
          {tag && (
            <span 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs mt-1"
              style={{ 
                backgroundColor: `${tag.color}20`,
                color: tag.color 
              }}
            >
              {tag.name}
            </span>
          )}
          <p className="text-muted-foreground truncate">{note.content}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(note.updated_at), 'MMM d, yyyy')}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                router.push(`/dashboard/notes/${note.id}`)
              }}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className={cn(
                  "h-4 w-4",
                  note.is_archived && "text-yellow-400"
                )} />
                {note.is_archived ? 'Unarchive' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn(
      "group relative bg-zinc-900 border-zinc-800 hover:bg-zinc-900/80 transition-colors",
      note.is_archived && "opacity-75"
    )}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium line-clamp-1">{note.title}</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-yellow-400"
              onClick={handleToggleFavorite}
            >
              <Star className={cn("h-4 w-4", note.is_pinned && "fill-yellow-400 text-yellow-400")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className={cn(
                    "mr-2 h-4 w-4",
                    note.is_archived && "text-yellow-400"
                  )} />
                  {note.is_archived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="line-clamp-3 text-sm text-zinc-400">
          {note.content}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            {note.tags && (
              <span className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: note.tags.color }}
                />
                {note.tags.name}
              </span>
            )}
          </div>
          <time>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</time>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteNote.mutate(note.id, {
                  onSuccess: () => {
                    toast.success('Note deleted')
                    setShowDeleteDialog(false)
                  }
                })
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
} 