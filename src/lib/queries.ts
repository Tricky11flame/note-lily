import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'

export const useNotes = () =>
  useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

export const useCreateNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from('notes').insert({ content })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  })
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries(['notes']),
  })
}
