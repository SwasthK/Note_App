import { useState } from 'react'
import { toast } from 'sonner'

export function useOpenRouter() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const summarize = async (text: string) => {
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
      const siteUrl = process.env.NEXT_PUBLIC_BASE_URL
      const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "NOTE APP"
      
      if (!apiKey) {
        throw new Error('OpenRouter API key is not configured')
      }

      if (!text || text.trim() === '') {
        throw new Error('No text provided for summarization')
      }

      console.log('Making API call to OpenRouter...')
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': siteUrl || 'https://yoursite.com',
          'X-Title': siteName || 'Your Application',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes text concisely.'
            },
            {
              role: 'user',
              content: `Please summarize the following text in 2-3 sentences:\n\n${text}`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      })

      console.log('API Response status:', response.status)
      const responseText = await response.text()
      console.log('API Response:', responseText)

      // Store the debug info for troubleshooting
      try {
        setDebugInfo({
          status: response.status,
          responseText: responseText,
          parsed: responseText ? JSON.parse(responseText) : null
        })
      } catch (parseError) {
        setDebugInfo({
          status: response.status,
          responseText: responseText,
          parseError: (parseError as Error).message
        })
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${responseText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Failed to parse API response: ${(parseError as Error).message}`)
      }

      // More detailed checking of response structure
      if (!data) {
        throw new Error('Empty response from API')
      }
      
      if (!data.choices) {
        throw new Error(`API response missing 'choices' array: ${JSON.stringify(data)}`)
      }
      
      if (data.choices.length === 0) {
        throw new Error('API returned empty choices array')
      }
      
      if (!data.choices[0].message) {
        throw new Error(`First choice missing 'message' object: ${JSON.stringify(data.choices[0])}`)
      }
      
      if (data.choices[0].message.content === undefined) {
        throw new Error(`Message missing 'content' field: ${JSON.stringify(data.choices[0].message)}`)
      }

      return data.choices[0].message.reasoning;
    } catch (error) {
      console.error('Error in useOpenRouter:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
      toast.error(`Failed to generate summary: ${errorMessage}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback to use if OpenRouter API fails
  const summarizeFallback = async (text: string) => {
    // Simple rule-based summarization as fallback
    // This is very basic and not a real substitute for AI summarization
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    if (sentences.length <= 3) {
      return text
    }
    
    // Select first and last sentences as a very basic summary
    return `${sentences[0]}. ${sentences[sentences.length-1]}.`
  }

  return {
    summarize,
    summarizeFallback,
    isLoading,
    error,
    debugInfo
  }
}