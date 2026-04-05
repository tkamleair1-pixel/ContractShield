/**
 * ContractShield — Google Gemini API Integration
 * Handles communication with the Gemini 1.5 Flash model for contract analysis.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { AnalysisResult } from './types'

// ─── Client Initialisation ───────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// ─── Contract Analysis ──────────────────────────────────────────

/**
 * Send contract text to the Gemini 1.5 Flash model and receive a
 * structured AnalysisResult containing trust score, clause
 * breakdowns, risk assessment, and negotiation guidance.
 */
export async function analyzeContractWithGemini(
  contractText: string,
  systemPrompt: string,
  userPrompt: string
): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })

    // Combine system and user prompts into a single message
    const prompt = systemPrompt + '\n\n' + userPrompt

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // ── Extract JSON from the response ─────────────────────────
    let jsonText = text

    const fencedJsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
    if (fencedJsonMatch) {
      jsonText = fencedJsonMatch[1]
    } else {
      const fencedMatch = text.match(/```\s*([\s\S]*?)\s*```/)
      if (fencedMatch) {
        jsonText = fencedMatch[1]
      }
    }

    jsonText = jsonText.trim()

    // ── Parse and validate ─────────────────────────────────────
    const parsed = JSON.parse(jsonText) as AnalysisResult

    if (typeof parsed.trust_score !== 'number') {
      throw new Error('Response missing required field: trust_score')
    }

    if (!Array.isArray(parsed.clauses)) {
      throw new Error('Response missing required field: clauses')
    }

    return parsed
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[ContractShield] Gemini analysis error:', message)

    if (message.includes('API_KEY_INVALID') || message.includes('API key')) {
      throw new Error(
        'Invalid Gemini API key. Please check your GEMINI_API_KEY in .env.local and ensure it is a valid Google AI Studio key.'
      )
    }

    if (
      message.includes('RESOURCE_EXHAUSTED') ||
      message.includes('quota') ||
      message.includes('429')
    ) {
      throw new Error(
        'API quota exceeded. Please wait a few minutes and try again, or check your Google AI Studio usage limits.'
      )
    }

    if (message.includes('JSON') || message.includes('Unexpected token')) {
      throw new Error(
        'Failed to parse the AI response as JSON. The model returned an unexpected format. Please try again.'
      )
    }

    throw new Error('Failed to analyze contract. ' + message)
  }
}

// ─── Connection Test ─────────────────────────────────────────────

/**
 * Verify that the Gemini API key is valid and the service is reachable.
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent('Hello')
    const text = result.response.text()

    return text.length > 0
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[ContractShield] Gemini connection test failed:', message)
    return false
  }
}
