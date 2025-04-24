'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateNote } from '@/lib/hooks/useNotes'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTags } from '@/lib/hooks/useTags'

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const router = useRouter()
  const { tags: tags = [] } = useTags()
  const { mutate: createNote, isLoading } = useCreateNote()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content) {
      toast.error('Please fill in all required fields')
      return
    }

    createNote(
      {
        title,
        content,
        tag_id: selectedTag || null,
      },
      {
        onSuccess: () => {
          toast.success('Note created successfully')
          onOpenChange(false)
          setTitle('')
          setContent('')
          setSelectedTag('')
          router.refresh()
        },
        onError: () => {
          toast.error('Failed to create note')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
          
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none"
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 