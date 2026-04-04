/**
 * ContractShield — Utility Functions
 * Shared helpers for styling, formatting, and browser interactions.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Class Name Merging ──────────────────────────────────────────

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines `clsx` for conditional classes and `tailwind-merge`
 * to intelligently resolve conflicting utility classes.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-indigo-500', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Formatting Helpers ──────────────────────────────────────────

/** Map of internal contract type codes to human-readable labels */
const CONTRACT_TYPE_LABELS: Record<string, string> = {
  rental_lease: 'Rental/Lease Agreement',
  employment: 'Employment Contract',
  freelance: 'Freelance/Contractor Agreement',
  terms_of_service: 'Terms of Service',
  nda: 'Non-Disclosure Agreement',
  other: 'General Contract',
}

/**
 * Convert a contract type code to a human-readable label.
 *
 * @param type - Internal contract type code (e.g. 'rental_lease')
 * @returns Formatted label (e.g. 'Rental/Lease Agreement')
 *
 * @example
 * formatContractType('employment') // → 'Employment Contract'
 * formatContractType('unknown')    // → 'Unknown Contract Type'
 */
export function formatContractType(type: string): string {
  return CONTRACT_TYPE_LABELS[type] ?? 'Unknown Contract Type'
}

// ─── Color / Style Utilities ─────────────────────────────────────

/**
 * Return a Tailwind text color class based on a trust/grade score (0–100).
 *
 * @param score - Numeric score between 0 and 100
 * @returns Tailwind text color class string
 *
 * @example
 * getGradeColor(85) // → 'text-green-600'
 * getGradeColor(55) // → 'text-yellow-600'
 */
export function getGradeColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

/**
 * Return Tailwind badge classes (background + text) for a given risk level.
 *
 * @param level - Risk level string (e.g. 'critical', 'high', 'moderate', 'low', 'minimal')
 * @returns Combined Tailwind class string for badge styling
 *
 * @example
 * getRiskLevelColor('critical') // → 'bg-red-100 text-red-800'
 * getRiskLevelColor('low')      // → 'bg-green-100 text-green-800'
 */
export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'minimal':
    case 'low':
      return 'bg-green-100 text-green-800'
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'critical':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// ─── Browser Utilities ───────────────────────────────────────────

/**
 * Trigger a JSON file download in the browser.
 * Creates a temporary anchor element, triggers the download, then cleans up.
 *
 * @param data - Any serialisable value to save as JSON
 * @param filename - Desired filename for the download (e.g. 'report.json')
 *
 * @example
 * downloadJSON(analysisResult, 'contract-analysis.json')
 */
export function downloadJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Copy text to the user's clipboard using the Clipboard API.
 *
 * @param text - The string to copy
 * @returns A promise that resolves when the text has been copied
 *
 * @example
 * await copyToClipboard('Hello, world!')
 */
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
