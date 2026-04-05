import { NextRequest, NextResponse } from 'next/server';

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
    "termination": {
      "status": "present" | "missing" | "one-sided",
      "assessment": "<1-2 sentence evaluation>",
      "pointsDeducted": <integer 0-25>
    },
    "indemnification": {
      "status": "present" | "missing" | "one-sided",
      "assessment": "<1-2 sentence evaluation>",
      "pointsDeducted": <integer 0-25>
    },
    "liability": {
      "status": "present" | "missing" | "one-sided",
      "assessment": "<1-2 sentence evaluation>",
      "pointsDeducted": <integer 0-25>
    }
  },
  "redFlags": [
    {
      "risk": "<description of the risk>",
      "evidence": "<exact quote from the contract text>",
      "severity": "critical" | "high" | "medium"
    }
  ],
  "negotiationPoints": ["<actionable negotiation advice 1>", "<actionable advice 2>"]
}`;

function extractJSON(text: string): any {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const { contractText } = await req.json();

    if (!contractText || typeof contractText !== 'string') {
      return NextResponse.json({ error: 'Missing contract text.' }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY; // Switching to xAI Grok API
    if (!apiKey) {
      return NextResponse.json({ error: 'GROK_API_KEY not set in .env.local' }, { status: 500 });
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-beta", // or grok-2
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this contract:\n\n${contractText}` }
        ],
        temperature: 0.1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ContractShield] Grok API Error: ${response.status}`, errorText);
      return NextResponse.json({ error: 'Grok AI API returned an error.' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
       return NextResponse.json({ error: 'Empty response from Grok AI.' }, { status: 503 });
    }

    try {
      const parsed = extractJSON(content);
      return NextResponse.json({ result: JSON.stringify(parsed) });
    } catch (err) {
      console.error('[ContractShield] JSON Parse Error from Grok:', content);
      return NextResponse.json({ error: 'AI returned invalid data format.' }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error('[ContractShield] Fatal Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
