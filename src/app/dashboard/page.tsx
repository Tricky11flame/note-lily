'use client'

import { useState } from 'react'
import { useNotes, useCreateNote, useDeleteNote } from '@/lib/queries'
import { summarizeNote } from '@/lib/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DashboardPage() {
  const [content, setContent] = useState('')
  const [summaries, setSummaries] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const { data: notes, isLoading } = useNotes()
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()

  const handleSummarize = async (id: string, content: string) => {
    setLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const summary = await summarizeNote(content)
      setSummaries((prev) => ({ ...prev, [id]: summary }))
    } catch (err) {
      setSummaries((prev) => ({ ...prev, [id]: '❌ Error summarizing' }))
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={() => createNote.mutate(content)}>Add</Button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {notes?.map((note:any) => (
            <li key={note.id} className="border rounded p-3 space-y-2">
              <div className="flex justify-between">
                <span>{note.content}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteNote.mutate(note.id)}
                >
                  Delete
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={loading[note.id]}
                onClick={() => handleSummarize(note.id, note.content)}
              >
                {loading[note.id] ? 'Summarizing...' : 'Summarize'}
              </Button>

              {summaries[note.id] && (
                <p className="text-sm text-muted-foreground">
                  ➤ {summaries[note.id]}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
