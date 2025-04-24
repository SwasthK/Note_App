import { useMutation } from '@tanstack/react-query'

export function useAiSummary() {
  return useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      const data = await response.json()
      return data.summary
    },
  })
} 