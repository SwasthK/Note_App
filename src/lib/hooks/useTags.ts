import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tag } from '../types'
import { toast } from "sonner"

const DEFAULT_CATEGORIES = [
  { name: 'Personal', color: '#3b82f6' },
  { name: 'Work', color: '#10b981' },
  { name: 'Ideas', color: '#f59e0b' }
]

export function useTags() {
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()

  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // First check if user has any tags
      const { data: existingTags, error: fetchError } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (fetchError) {
        console.error('Tags fetch error:', fetchError)
        throw fetchError
      }

      // If no tags exist, create default categories
      if (!existingTags || existingTags.length === 0) {
        const { data: newTags, error: createError } = await supabase
          .from('tags')
          .insert(
            DEFAULT_CATEGORIES.map(category => ({
              ...category,
              user_id: user.id
            }))
          )
          .select()

        if (createError) {
          console.error('Default tags creation error:', createError)
          throw createError
        }

        return newTags as Tag[]
      }

      return existingTags as Tag[]
    },
  })

  const createTag = useMutation({
    mutationFn: async (tag: { name: string; color: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('tags')
        .insert([{ ...tag, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success("Tag created successfully")
    },
    onError: (error) => {
      toast.error("Failed to create tag")
      console.error(error)
    },
  })

  const updateTag = useMutation({
    mutationFn: async (tag: { id: string; name: string; color: string }) => {
      const { data, error } = await supabase
        .from('tags')
        .update({ name: tag.name, color: tag.color })
        .eq('id', tag.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success("Tag updated successfully")
    },
    onError: (error) => {
      toast.error("Failed to update tag")
      console.error(error)
    },
  })

  const deleteTag = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success("Tag deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete tag")
      console.error(error)
    },
  })

  return {
    tags,
    isLoading,
    createTag,
    updateTag,
    deleteTag,
  }
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  const supabase = createClientComponentClient()

  return useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name,
          color,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  const supabase = createClientComponentClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // First update all notes with this tag to have no tag
      await supabase
        .from('notes')
        .update({ tag_id: null })
        .eq('tag_id', id)

      // Then delete the tag
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
} 