import { NextRequest, NextResponse } from 'next/server';
import { analyzeContractWithGemini } from '@/lib/gemini';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { AnalysisRequest, AnalysisResponse } from '@/lib/types';
import { preprocessContract } from '@/lib/parser';
import { APP_CONFIG } from '@/lib/constants';

// --- Rate Limiting ---

/** Map of IP addresses to their recent request timestamps */
const rateLimitMap = new Map<string, number[]>();

/**
 * Check if the given IP address has exceeded the rate limit.
 *
 * @param ip - The IP address of the requester
 * @returns boolean indicating if the request should be allowed
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = APP_CONFIG.rateLimit.windowMs; // 3600000ms
  const maxRequests = APP_CONFIG.rateLimit.maxRequestsPerHour; // 10

  // Get existing requests for this IP
  const requests = rateLimitMap.get(ip) || [];

  // Filter out requests older than the window
  const recentRequests = requests.filter((timestamp) => now - timestamp < windowMs);

  if (recentRequests.length >= maxRequests) {
    // Limit exceeded, update the map with filtered requests and reject
    rateLimitMap.set(ip, recentRequests);
    return false;
  }

  // Allow request, add new timestamp
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

// --- Route Handlers ---

export async function POST(req: NextRequest) {
  try {
    // 1. Get IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // 2. Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        } as AnalysisResponse,
        { status: 429 }
      );
    }

    // 3. Parse body
    const body: AnalysisRequest = await req.json();
    const { contract_text, contract_type } = body;

    // 4. Validate contract_text
    if (!contract_text || typeof contract_text !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid contract_text.',
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (contract_text.length < APP_CONFIG.minContractLength) {
      return NextResponse.json(
        {
          success: false,
          error: \`Contract text is too short (minimum \${APP_CONFIG.minContractLength} characters).\`,
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    if (contract_text.length > APP_CONFIG.maxContractLength) {
      return NextResponse.json(
        {
          success: false,
          error: \`Contract text is too long (maximum \${APP_CONFIG.maxContractLength} characters).\`,
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    // 5. Preprocess
    const processedText = preprocessContract(contract_text);

    // 6. Build prompt
    const userPrompt = buildUserPrompt(processedText, contract_type);

    // 7. Call Gemini
    const analysis = await analyzeContractWithGemini(
      processedText,
      SYSTEM_PROMPT,
      userPrompt
    );

    // 8. Return success response
    return NextResponse.json({
      success: true,
      data: analysis,
      cached: false,
    } as AnalysisResponse);
  } catch (error: unknown) {
    console.error('[ContractShield] API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        error: message,
      } as AnalysisResponse,
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ContractShield Analysis API',
    version: '1.0.0',
  });
}
