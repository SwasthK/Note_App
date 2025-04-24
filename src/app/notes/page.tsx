'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type Note = {
  id: string
  title: string
  content: string
  created_at: string
  user_id: string
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
    } else {
      setNotes(notes || [])
    }
  }

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault()
    
    const { error } = await supabase.from('notes').insert([
      {
        title,
        content,
      },
    ])

    if (error) {
      console.error('Error creating note:', error)
    } else {
      setTitle('')
      setContent('')
      fetchNotes()
    }
  }

  async function handleDeleteNote(id: string) {
    const { error } = await supabase.from('notes').delete().match({ id })

    if (error) {
      console.error('Error deleting note:', error)
    } else {
      fetchNotes()
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <button
            onClick={handleSignOut}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <form onSubmit={handleCreateNote} className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border p-2"
            required
          />
          <textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-32 w-full rounded-lg border p-2"
            required
          />
          <button
            type="submit"
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Create Note
          </button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg bg-white p-4 shadow"
            >
              <h3 className="mb-2 text-xl font-bold">{note.title}</h3>
              <p className="mb-4 text-gray-600">{note.content}</p>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 