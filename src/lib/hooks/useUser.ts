import { useQuery } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/auth-helpers-nextjs'

export function useUser() {
  const supabase = createClientComponentClient()

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
  })
}

// Add type for user metadata
declare module '@supabase/auth-helpers-nextjs' {
  interface UserMetadata {
    avatar_url?: string
    full_name?: string
  }
} 