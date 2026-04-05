/**
 * ContractShield — Anthropic Claude API Integration
 * Handles communication with Claude 3.7 Sonnet for contract analysis.
 */

import { AnalysisResult, Clause, ClauseCategory, RiskLevel, ContractType } from './types'

/**
 * Send contract text to the Anthropic Claude API and receive a
 * structured AnalysisResult.
 */
export async function analyzeContractWithAnthropic(
  contractText: string,
  contractType: ContractType = 'other'
): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not defined in environment variables.');
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-7-sonnet-20250219", // Using the latest available Sonnet model
      max_tokens: 4000,
      system: "You are a senior legal counsel specializing in contract analysis for non-lawyers. Analyze the contract and return a JSON object only. Do not include any preamble or explanation outside the JSON.",
      messages: [{
        role: "user",
        content: `Analyze this contract and return a JSON object exactly matching this schema:
        {
          "trustScore": number (0-100),
          "summary": "string (2 sentence plain English summary)",
          "redFlags": ["string description of flag 1", "string description of flag 2"],
          "negotiationPoints": ["string point 1", "string point 2"],
          "clauses": [
            {
              "id": number,
              "title": "string",
              "original_text": "string",
              "category": "red" | "yellow" | "green",
              "plain_english": "string",
              "why_flagged": "string",
              "recommendation": "string",
              "severity": number (0-10)
            }
          ],
          "riskLevel": "critical" | "high" | "moderate" | "low" | "minimal",
          "scoreBreakdown": {
            "fairness": number (0-100),
            "clarity": number (0-100),
            "completeness": number (0-100),
            "legal_compliance": number (0-100),
            "balance_of_power": number (0-100)
          }
        }
        CONTRACT TYPE: ${contractType}
        CONTRACT TEXT: ${contractText}`
      }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  // Extract JSON from potential markdown fencing
  const jsonMatch = content.match(/(\{[\s\S]*\})/);
  const jsonText = jsonMatch ? jsonMatch[1] : content;
  
  const parsed = JSON.parse(jsonText);

  // Map to internal AnalysisResult type
  const result: AnalysisResult = {
    contract_type: contractType,
    contract_type_label: contractType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    trust_score: parsed.trustScore,
    trust_grade: calculateGrade(parsed.trustScore),
    overall_risk_level: parsed.riskLevel as RiskLevel,
    summary: parsed.summary,
    clauses: parsed.clauses.map((c: any) => ({
      ...c,
      category: c.category as ClauseCategory
    })),
    missing_clauses: [], // Anthropic could provide this too if prompt is updated
    score_breakdown: {
      fairness: parsed.scoreBreakdown.fairness,
      clarity: parsed.scoreBreakdown.clarity,
      completeness: parsed.scoreBreakdown.completeness,
      legal_compliance: parsed.scoreBreakdown.legal_compliance,
      balance_of_power: parsed.scoreBreakdown.balance_of_power
    },
    key_concerns: parsed.redFlags,
    positive_aspects: [],
    negotiation_priority: parsed.clauses
      .filter((c: any) => c.category !== 'green')
      .sort((a: any, b: any) => b.severity - a.severity)
      .map((c: any) => c.id)
  };

  return result;
}

function calculateGrade(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}
