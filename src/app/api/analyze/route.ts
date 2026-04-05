import { NextRequest, NextResponse } from 'next/server';
import { analyzeContractWithAnthropic } from '@/lib/anthropic';
import { AnalysisRequest, AnalysisResponse } from '@/lib/types';
import { preprocessContract } from '@/lib/parser';
import { APP_CONFIG } from '@/lib/constants';

// --- Rate Limiting ---
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = APP_CONFIG.rateLimit.windowMs;
  const maxRequests = APP_CONFIG.rateLimit.maxRequestsPerHour;

  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter((timestamp) => now - timestamp < windowMs);

  if (recentRequests.length >= maxRequests) {
    rateLimitMap.set(ip, recentRequests);
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        } as AnalysisResponse,
        { status: 429 }
      );
    }

    const body: AnalysisRequest = await req.json();
    const { contract_text, contract_type } = body;

    if (!contract_text || typeof contract_text !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid contract_text.',
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    const processedText = preprocessContract(contract_text);
    
    // Using the new Anthropic integration
    const analysis = await analyzeContractWithAnthropic(
      processedText,
      contract_type || 'other'
    );

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
