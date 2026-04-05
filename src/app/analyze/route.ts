import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Act as a legal document auditor. Analyze the contract and provide a risk score based strictly on the specific clauses found in this document.

Instructions:
1. Context Extraction: Identify the specific parties, dates, and governing law mentioned.
2. Clause Check: Evaluate the Termination, Indemnification, and Liability clauses. If a clause is missing or heavily favors one party, deduct points from the score.
3. Dynamic Scoring: Calculate a score out of 100. Do not use a default score. The score must be a direct reflection of the risks identified in this specific text.
4. Authentication: For every risk identified, quote the specific sentence or section number from the contract as evidence.

Return ONLY a raw JSON object. No markdown, no code fences, no explanation — pure JSON only.

Return this EXACT structure:
{
  "trustScore": <integer 0-100, dynamically calculated based on actual risks found>,
  "parties": {
    "partyA": "<name or role of first party>",
    "partyB": "<name or role of second party>"
  },
  "governingLaw": "<jurisdiction or 'Not specified'>",
  "contractType": "<detected type: employment, rental, freelance, NDA, etc.>",
  "summary": "<exactly 2 sentences: one about what the contract covers, one about the overall risk level>",
  "clauseAnalysis": {
    "termination": { "status": "present" | "missing" | "one-sided", "assessment": "...", "pointsDeducted": 0 },
    "indemnification": { "status": "present" | "missing" | "one-sided", "assessment": "...", "pointsDeducted": 0 },
    "liability": { "status": "present" | "missing" | "one-sided", "assessment": "...", "pointsDeducted": 0 }
  },
  "redFlags": [{ "risk": "...", "evidence": "...", "severity": "high" }],
  "negotiationPoints": ["..."]
}`;

function extractJSON(text: string): any {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];
  return JSON.parse(cleaned);
}

// ─── Direct Gemini Analysis ─────────────────────────────────────────
async function tryGemini(contractText: string, apiKey: string): Promise<any | null> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([SYSTEM_PROMPT, `Analyze this contract:\n\n${contractText}`]);
    const text = result.response.text();
    return extractJSON(text);
  } catch (err) {
    console.error('[ContractShield] Direct Gemini failed:', err);
    return null;
  }
}

// ─── OpenRouter Fallback ──────────────────────────────────────────── (Silent backup)
async function tryOpenRouter(contractText: string, apiKey: string): Promise<any | null> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: `Analyze this contract:\n\n${contractText}` }],
        temperature: 0.1
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return extractJSON(data.choices[0].message.content);
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { contractText } = await req.json();
    if (!contractText) return NextResponse.json({ error: 'No text.' }, { status: 400 });

    // 1. Try Direct Gemini first
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const res = await tryGemini(contractText, geminiKey);
      if (res) return NextResponse.json({ result: JSON.stringify(res) });
    }

    // 2. Try OpenRouter backup if Gemini fails
    const orKey = process.env.OPENROUTER_API_KEY;
    if (orKey) {
      const res = await tryOpenRouter(contractText, orKey);
      if (res) return NextResponse.json({ result: JSON.stringify(res) });
    }

    return NextResponse.json({ error: 'All AI models are busy. Try again in 10s.' }, { status: 503 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Analyze error.' }, { status: 500 });
  }
}
