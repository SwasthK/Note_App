export interface Note {
  id: string
  title: string
  content: string
  user_id: string
  tag_id: string | null
  is_pinned: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
  tags?: {
    id: string
    name: string
    color: string
  }
}

export interface Tag {
  id: string
  name: string
  color: string
  user_id: string
  created_at: string
} 