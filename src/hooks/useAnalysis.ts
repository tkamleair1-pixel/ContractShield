/**
 * useAnalysis — Custom hook for managing contract analysis state and API calls.
 */

import { useState, useCallback } from 'react'
import type { AnalysisResult, AnalysisResponse } from '@/lib/types'
import { APP_CONFIG } from '@/lib/constants'

interface UseAnalysisReturn {
  /** The analysis result data, if available */
  result: AnalysisResult | null
  /** Whether an analysis is currently in progress */
  isLoading: boolean
  /** Error message, if any */
  error: string | null
  /** Name of the file being / that was analyzed */
  fileName: string | null
  /** Trigger analysis of a contract file (PDF) */
  analyzeFile: (file: File) => Promise<void>
  /** Trigger analysis of raw contract text */
  analyzeText: (text: string) => Promise<void>
  /** Clear the current result and error state */
  reset: () => void
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setFileName(null)
    setIsLoading(false)
  }, [])

  const handleResponse = useCallback(async (response: Response) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(data.error || `Server error (${response.status})`)
    }

    const data: AnalysisResponse = await response.json()

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Analysis returned no results')
    }

    setResult(data.data)
  }, [])

  const analyzeFile = useCallback(
    async (file: File) => {
      // Validate file size
      if (file.size > APP_CONFIG.maxFileSize) {
        const maxMB = APP_CONFIG.maxFileSize / (1024 * 1024)
        setError(`File too large. Maximum size is ${maxMB}MB.`)
        return
      }

      // Validate file type
      const validType = APP_CONFIG.supportedFileTypes.includes(
        file.type as (typeof APP_CONFIG.supportedFileTypes)[number]
      )
      if (!validType && !file.name.endsWith('.txt')) {
        setError('Unsupported file type. Please upload a PDF or TXT file.')
        return
      }

      setIsLoading(true)
      setError(null)
      setFileName(file.name)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        })

        await handleResponse(response)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(message)
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    },
    [handleResponse]
  )

  const analyzeText = useCallback(
    async (text: string) => {
      // Validate text length
      if (text.length < APP_CONFIG.minContractLength) {
        setError(
          `Contract text is too short (minimum ${APP_CONFIG.minContractLength} characters).`
        )
        return
      }

      if (text.length > APP_CONFIG.maxContractLength) {
        setError(
          `Contract text is too long (maximum ${APP_CONFIG.maxContractLength.toLocaleString()} characters).`
        )
        return
      }

      setIsLoading(true)
      setError(null)
      setFileName('Pasted text')

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contract_text: text }),
        })

        await handleResponse(response)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(message)
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    },
    [handleResponse]
  )

  return {
    result,
    isLoading,
    error,
    fileName,
    analyzeFile,
    analyzeText,
    reset,
  }
}
