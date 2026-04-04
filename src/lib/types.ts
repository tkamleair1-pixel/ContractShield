/**
 * ContractShield — TypeScript Type Definitions
 * Complete type system for AI-powered contract analysis.
 */

// ─── Enum-like Types ──────────────────────────────────────────────

/** Classification category for a contract clause */
export type ClauseCategory = 'red' | 'yellow' | 'green'

/** Overall risk level assessment */
export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'minimal'

/** Supported contract types for analysis */
export type ContractType =
  | 'rental_lease'
  | 'employment'
  | 'freelance'
  | 'terms_of_service'
  | 'nda'
  | 'other'

// ─── Core Interfaces ─────────────────────────────────────────────

/**
 * Represents a single clause extracted and analyzed from a contract.
 * Red and yellow clauses include additional fields for flagging and negotiation guidance.
 */
export interface Clause {
  /** Unique identifier for the clause within the analysis */
  id: number

  /** The original verbatim text of the clause from the contract */
  original_text: string

  /** Risk category: red (dangerous), yellow (caution), green (safe) */
  category: ClauseCategory

  /** Short descriptive title for the clause */
  title: string

  /** Plain-English explanation of what the clause means */
  plain_english: string

  /** Why this clause was flagged as risky (red/yellow clauses only) */
  why_flagged?: string

  /** Actionable recommendation for addressing this clause (red/yellow clauses only) */
  recommendation?: string

  /** Suggested script for negotiating changes to this clause (red/yellow clauses only) */
  negotiation_script?: string

  /** Severity score on a 0–10 scale (0 = benign, 10 = extremely risky) */
  severity: number

  /** Additional legal context or note from the AI analysis */
  legal_note?: string
}

/**
 * Represents a clause that should be present in the contract but is missing.
 */
export interface MissingClause {
  /** Description of the missing clause */
  clause: string

  /** How important it is to include this clause */
  importance: 'critical' | 'high' | 'medium' | 'low'

  /** Why the clause matters and what risks arise from its absence */
  explanation: string
}

/**
 * Detailed breakdown of scores across key contract quality dimensions.
 * All scores are on a 0–100 scale.
 */
export interface ScoreBreakdown {
  /** How fair and balanced the contract terms are (0–100) */
  fairness: number

  /** How clearly the contract language is written (0–100) */
  clarity: number

  /** How thoroughly the contract covers necessary terms (0–100) */
  completeness: number

  /** How well the contract complies with standard legal requirements (0–100) */
  legal_compliance: number

  /** How evenly power and obligations are distributed between parties (0–100) */
  balance_of_power: number
}

/**
 * The complete result of an AI-powered contract analysis.
 */
export interface AnalysisResult {
  /** Detected or specified contract type */
  contract_type: ContractType

  /** Human-readable label for the contract type (e.g., "Rental / Lease Agreement") */
  contract_type_label: string

  /** Overall trust score for the contract (0–100, higher is better) */
  trust_score: number

  /** Letter grade derived from trust_score (e.g., "A", "B+", "D") */
  trust_grade: string

  /** Overall risk level assessment */
  overall_risk_level: RiskLevel

  /** Executive summary of the contract analysis */
  summary: string

  /** All analyzed clauses from the contract */
  clauses: Clause[]

  /** Clauses that are expected but missing from the contract */
  missing_clauses: MissingClause[]

  /** Detailed score breakdown across quality dimensions */
  score_breakdown: ScoreBreakdown

  /** Top concerns identified in the contract */
  key_concerns: string[]

  /** Positive aspects found in the contract */
  positive_aspects: string[]

  /** Ordered list of clause IDs to prioritize during negotiation */
  negotiation_priority: number[]
}

// ─── Request / Response Interfaces ────────────────────────────────

/**
 * Payload sent to the analysis API endpoint.
 */
export interface AnalysisRequest {
  /** The full text content of the contract to analyze */
  contract_text: string

  /** Optional: pre-specified contract type to guide analysis */
  contract_type?: ContractType
}

/**
 * Response returned from the analysis API endpoint.
 */
export interface AnalysisResponse {
  /** Whether the analysis completed successfully */
  success: boolean

  /** The full analysis result (present when success is true) */
  data?: AnalysisResult

  /** Error message (present when success is false) */
  error?: string

  /** Whether this result was served from cache */
  cached?: boolean
}
