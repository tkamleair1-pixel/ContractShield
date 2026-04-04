/**
 * ContractShield — Text Preprocessing & Detection
 * Functions for cleaning raw contract text and detecting contract types.
 */

import type { ContractType } from './types'

// ─── Text Preprocessing ─────────────────────────────────────────

/**
 * Clean and normalise raw contract text extracted from PDFs or pasted input.
 * Removes artefacts like page numbers, form-feed characters, and excessive
 * whitespace so the text is ready for AI analysis.
 *
 * @param text - Raw contract text (may contain PDF artefacts)
 * @returns Cleaned, normalised contract text
 *
 * @example
 * const clean = preprocessContract(rawPdfText)
 */
export function preprocessContract(text: string): string {
  let processed = text

  // Remove excessive whitespace (collapse multiple spaces to one)
  processed = processed.replace(/\s+/g, ' ')

  // Remove page number markers (e.g. "Page 3 of 12")
  processed = processed.replace(/Page\s+\d+\s+of\s+\d+/gi, '')

  // Remove PDF form-feed characters
  processed = processed.replace(/\f/g, '')

  // Normalise line breaks to Unix-style
  processed = processed.replace(/\r\n/g, '\n')
  processed = processed.replace(/\r/g, '\n')

  // Collapse 3+ consecutive line breaks to double line break
  processed = processed.replace(/\n{3,}/g, '\n\n')

  return processed.trim()
}

// ─── Contract Type Detection ─────────────────────────────────────

/** Pattern-to-type mapping for contract classification */
const CONTRACT_TYPE_PATTERNS: { pattern: RegExp; type: ContractType }[] = [
  {
    pattern: /(rental|lease|landlord|tenant|premises|security deposit)/i,
    type: 'rental_lease',
  },
  {
    pattern: /(employment|employee|employer|salary|benefits|termination)/i,
    type: 'employment',
  },
  {
    pattern: /(freelance|independent contractor|deliverables|work-for-hire)/i,
    type: 'freelance',
  },
  {
    pattern: /(terms of service|privacy policy|user agreement|acceptable use)/i,
    type: 'terms_of_service',
  },
  {
    pattern: /(non-disclosure|confidential information|nda)/i,
    type: 'nda',
  },
]

/**
 * Detect the type of contract from its text content using keyword matching.
 * Tests the text against known patterns and returns the first match.
 *
 * @param text - Contract text to classify
 * @returns A {@link ContractType} code (e.g. `'rental_lease'`, `'employment'`)
 *
 * @example
 * detectContractType('This Lease Agreement between Landlord and Tenant...')
 * // → 'rental_lease'
 *
 * detectContractType('Some unknown document...')
 * // → 'other'
 */
export function detectContractType(text: string): ContractType {
  const lower = text.toLowerCase()

  for (const { pattern, type } of CONTRACT_TYPE_PATTERNS) {
    if (pattern.test(lower)) {
      return type
    }
  }

  return 'other'
}

// ─── Text Truncation ─────────────────────────────────────────────

/**
 * Truncate contract text to a maximum length for API consumption.
 * Appends a truncation notice if the text exceeds the limit.
 *
 * @param text - Full contract text
 * @param maxLength - Maximum character count (default: 40 000)
 * @returns Original text if within limit, or truncated text with notice
 *
 * @example
 * truncateText(longContract, 30000)
 * // → 'First 30000 chars...\n\n[Document truncated for analysis]'
 */
export function truncateText(text: string, maxLength: number = 40000): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength) + '\n\n[Document truncated for analysis]'
}
