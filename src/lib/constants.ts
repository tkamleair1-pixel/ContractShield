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
  minContractLength: 50,

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
      'A landlord-heavy lease packed with hidden fees, one-sided termination clauses, and privacy-invading inspection rights.',
    expectedScore: 28,
    icon: '🏠',
    rawText: `RESIDENTIAL LEASE AGREEMENT (NIGHTMARE VERSION)

1. LATE FEES: Tenant shall pay a late fee of $200 per day for any rent not received by the 1st of the month. No grace period applies.

2. INSPECTIONS: Landlord reserves the right to enter the premises at any time, without prior notice, for any reason or no reason at all, including during the hours of 12:00 AM and 6:00 AM.

3. MAINTENANCE: Tenant is responsible for all maintenance and repairs, regardless of cause. If the roof leaks or the heating system fails due to old age, the Tenant shall bear 100% of the replacement costs within 48 hours.

4. TERMINATION: Landlord may terminate this lease at any time with 24 hours notice. Tenant may not terminate this lease under any circumstances for the full 24-month duration. If Tenant vacates early, the entire remaining balance of the lease becomes immediately due and payable.

5. GUESTS: No guests are permitted at any time. Any person found on the property who is not the Tenant will be considered a trespasser, and the Tenant will be fined $1,000 per occurrence.

6. SECURITY DEPOSIT: The security deposit of $5,000 is non-refundable under all circumstances, including but not limited to the property being returned in perfect condition.`,
  },
  {
    id: 'tricky_freelance',
    title: 'Tricky Freelance Contract',
    description:
      'A client-drafted agreement with vague payment terms, aggressive IP transfer, and a non-compete that locks you in.',
    expectedScore: 45,
    icon: '💼',
    rawText: `INDEPENDENT CONTRACTOR AGREEMENT

1. INTELLECTUAL PROPERTY: Contractor hereby assigns to Client all right, title, and interest in and to all Intellectual Property created, conceived, or reduced to practice by Contractor during the term of this Agreement, whether or not related to the Services, and whether created during or outside of project scope or working hours.

2. PAYMENT: Client shall pay Contractor for Services rendered within 180 days of receipt of an approved invoice. Approval of invoices is at the sole and absolute discretion of the Client.

3. NON-COMPETE: For a period of five (5) years following the termination of this Agreement, Contractor shall not, directly or indirectly, perform any services for any company that operates in the same industry as the Client, anywhere in the world.

4. INDEMNIFICATION: Contractor shall indemnify, defend, and hold harmless Client from any and all claims, damages, or losses, including legal fees, arising from the Contractor's performance, even if such claims result from the Client's own negligence.

5. TERMINATION FOR CONVENIENCE: Client may terminate this Agreement immediately for any reason. In the event of such termination, Client shall have no obligation to pay for any work performed prior to the date of termination.`,
  },
  {
    id: 'fair_employment',
    title: 'Fair Employment Offer',
    description:
      'A well-balanced employment contract with clear terms, reasonable benefits, and standard protections.',
    expectedScore: 92,
    icon: '👔',
    rawText: `EMPLOYMENT AGREEMENT

1. COMPENSATION: Employee shall be paid an annual salary of $120,000, payable in semi-monthly installments. Employee is eligible for a performance-based bonus of up to 15% annually.

2. BENEFITS: Employee shall receive 20 days of Paid Time Off (PTO) per calendar year, plus all federal holidays. Company provides comprehensive health, dental, and vision insurance with 90% of premiums covered by the Company.

3. TERM AND TERMINATION: Employment is at-will. Either party may terminate the relationship at any time with or without cause. However, Company agrees to provide four weeks of severance pay if termination is without cause.

4. CONFIDENTIALITY: Employee agrees to keep Company's trade secrets confidential during and after employment. This does not prevent Employee from using general skills and knowledge acquired during employment in future roles.

5. INTELLECTUAL PROPERTY: Intellectual Property created by the Employee that is directly related to the Company's business and created during working hours using Company resources shall belong to the Company. Any IP created on the Employee's own time using their own resources belongs to the Employee.`,
  },
] as const
