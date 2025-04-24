import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useNotes(options?: { tagId?: string }) {
  const supabase = createClientComponentClient()

  return useQuery({
    queryKey: ['notes', options?.tagId],
    queryFn: async () => {
      let query = supabase
        .from('notes')
        .select(`
          *,
          tags (
            id,
            name,
            color
          )
        `)

      if (options?.tagId) {
        query = query.eq('tag_id', options.tagId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
  })
}

export function useNote(id: string) {
  const supabase = createClientComponentClient()

  return useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Note
    },
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  const supabase = createClientComponentClient()

  const mutation = useMutation({
    mutationFn: async (note: {
      title: string
      content: string
      tag_id: string | null
    }) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          ...note,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending, // ✅ alias for consistency with queries
  }
}

export function useUpdateNote() {
  const queryClient = useQueryClient()
  const supabase = createClientComponentClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  const supabase = createClientComponentClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Add this to ensure proper typing
export type Note = {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  tag_id: string | null
  is_pinned: boolean
  is_archived: boolean
  tags?: {
    id: string
    name: string
    color: string
  } | null
} 