'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateNote, useUpdateNote } from '@/lib/hooks/useNotes'
import { useOpenRouter } from '@/lib/hooks/useDeepseek'
import { useTags } from '@/lib/hooks/useTags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Wand2, Save, Tag, RefreshCw, AlertCircle, ArrowDown } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NoteEditorProps {
  initialData?: {
    id?: string
    title?: string
    content?: string
    tags?: string[]
  }
}

export function NoteEditor({ initialData }: NoteEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [selectedTag, setSelectedTag] = useState<string | null>(initialData?.tags?.[0] || null)
  const [summary, setSummary] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const { tags = [], isLoading: isTagsLoading } = useTags()
  const { 
    summarize, 
    summarizeFallback, 
    isLoading: isSummarizing, 
  } = useOpenRouter()

  const { mutate: createNote, isPending: isCreating } = useCreateNote()
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote()

  const handleSave = () => {
    if (!title || !content) {
      toast.error('Title and content are required')
      return
    }

    if (initialData?.id) {
      updateNote(
        {
          id: initialData.id,
          title,
          content,
          tag_id: selectedTag === "none" ? null : selectedTag,
        },
        {
          onSuccess: () => {
            toast.success('Note updated successfully')
            router.push(`/dashboard/notes/${initialData.id}`)
          },
          onError: () => {
            toast.error('Failed to update note')
          },
        }
      )
    } else {
      createNote(
        {
          title,
          content,
          tag_id: selectedTag === "none" ? null : selectedTag,
        },
        {
          onSuccess: () => {
            toast.success('Note created successfully')
            router.push('/dashboard')
          },
          onError: () => {
            toast.error('Failed to create note')
          },
        }
      )
    }
  }

  const handleGenerateSummary = async () => {
    if (!content) {
      toast.error('Please add some content to summarize')
      return
    }
  
    setSummary(null)
    setSummaryError(null)
  
    try {
      const result = await summarize(content)

      console.log("Rs : "+result)

      if (typeof result === 'string' && result.trim()) {
        setSummary(result)
        toast.success('Summary generated successfully')
      } else {
        throw new Error('No summary text returned')
      }
    } catch (error) {
      console.error('Error from summarize:', error)
      toast.info('Trying fallback summarization...')
  
      try {
        const fallbackResult = await summarizeFallback(content)
        console.log('Fallback summarize result:', fallbackResult)
  
        if (fallbackResult?.trim()) {
          setSummary(fallbackResult)
          setSummaryError('Used fallback due to API error')
          toast.success('Fallback summary generated')
        } else {
          throw new Error('Fallback failed: empty result')
        }
      } catch (fallbackError) {
        console.error('Fallback summarize error:', fallbackError)
        setSummaryError('Could not generate summary. Please try again later.')
        toast.error('Both primary and fallback summarization failed')
      }
    }
  }
  
  

  const handleUseSummaryAsContent = () => {
    if (summary) {
      // Append the AI-generated summary to the existing content
      const updatedContent = content + "\n\n## AI Summary\n" + summary
      setContent(updatedContent)
      toast.success('Summary added to note content')
    }
  }

  if (isCreating || isUpdating) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Loading text={initialData?.id ? "Saving changes..." : "Creating note..."} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-none px-4 focus-visible:ring-0"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-6">
          {isTagsLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading categories...</span>
            </div>
          ) : tags.length > 0 ? (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Category:
              </label>
              <Select value={selectedTag || "none"} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[200px] rounded-md border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">No category</span>
                  </SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <Tag className="mr-3 h-5 w-5 text-amber-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                No categories available
              </span>
            </div>
          )}
        </div>

        <Textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] resize-none"
        />

        {summary && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Summary</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUseSummaryAsContent}
                  disabled={isSummarizing}
                >
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Add to Content
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateSummary}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? (
                    <Loading size="sm" className="mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Regenerate
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{summary}</p>
            
            {summaryError && (
              <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">{summaryError}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-6">
        <Button
          variant="outline"
          onClick={handleGenerateSummary}
          disabled={isSummarizing || !content}
        >
          {isSummarizing ? (
            <Loading size="sm" className="mr-2" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {summary ? 'Regenerate Summary' : 'Generate Summary'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={isCreating || isUpdating || !title || !content}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Note
        </Button>
      </CardFooter>
    </Card>
  )
}