/**
 * ContractShield — Application-Wide Constants
 * Central configuration for the contract analysis platform.
 */

import type { ClauseCategory } from './types'

// ─── Application Configuration ───────────────────────────────────

/** Core application settings and limits */
export const APP_CONFIG = {
  /** Application display name */
  name: 'ContractShield',

  /** Short tagline used in hero sections and meta tags */
  tagline: 'Understand before you sign',

  /** Extended description for SEO and about sections */
  description:
    'AI-powered contract analysis that highlights red flags, negotiation points, and gives you a trust score.',

  /** Maximum allowed contract text length in characters */
  maxContractLength: 50000,

  /** Minimum contract text length required for meaningful analysis */
  minContractLength: 100,

  /** Maximum uploaded file size in bytes (5 MB) */
  maxFileSize: 5 * 1024 * 1024,

  /** MIME types accepted for file upload */
  supportedFileTypes: ['application/pdf'] as const,

  /** Rate limiting configuration for the analysis API */
  rateLimit: {
    /** Maximum number of analysis requests per window */
    maxRequestsPerHour: 10,
    /** Rate limit window duration in milliseconds (1 hour) */
    windowMs: 3600000,
  },
} as const

// ─── Clause Category Definitions ─────────────────────────────────

/** Visual and labeling configuration for each clause risk category */
export const CLAUSE_CATEGORIES = {
  red: {
    label: 'Red Flag',
    icon: '🔴',
    color: '#ef4444',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-300',
    badgeClass: 'bg-red-100 text-red-800',
  },
  yellow: {
    label: 'Negotiate',
    icon: '🟡',
    color: '#eab308',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-300',
    badgeClass: 'bg-yellow-100 text-yellow-800',
  },
  green: {
    label: 'Standard',
    icon: '🟢',
    color: '#22c55e',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-300',
    badgeClass: 'bg-green-100 text-green-800',
  },
} as const satisfies Record<
  ClauseCategory,
  {
    label: string
    icon: string
    color: string
    bgClass: string
    borderClass: string
    badgeClass: string
  }
>

// ─── Demo Contracts ──────────────────────────────────────────────

/** Pre-loaded demo contracts for showcasing the analysis engine */
export const DEMO_CONTRACTS_INFO = [
  {
    id: 'nightmare_rental',
    title: 'Nightmare Rental Lease',
    description:
      'A landlord-heavy lease packed with hidden fees, one-sided termination clauses, and privacy-invading inspection rights. Great for testing red flag detection.',
    expectedScore: 28,
    icon: '🏠',
  },
  {
    id: 'tricky_freelance',
    title: 'Tricky Freelance Contract',
    description:
      'A client-drafted freelance agreement with vague payment terms, aggressive IP transfer, and a non-compete that could limit future work.',
    expectedScore: 45,
    icon: '💼',
  },
  {
    id: 'fair_employment',
    title: 'Fair Employment Offer',
    description:
      'A well-balanced employment contract with clear terms, reasonable benefits, and standard protections for both employer and employee.',
    expectedScore: 85,
    icon: '👔',
  },
] as const
