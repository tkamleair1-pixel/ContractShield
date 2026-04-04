'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/lib/types';

// Display Component Imports
import { TrustScoreGauge } from '@/components/TrustScoreGauge';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';
import { ClauseList } from '@/components/ClauseList';
import { MissingClauses } from '@/components/MissingClauses';
import { AnalysisHeader } from '@/components/AnalysisHeader';

// UI Primitives
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Attempt local resolution of the JSON blob out of memory cache via Session Storage Map
    const stored = sessionStorage.getItem('analysis_result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnalysisResult;
        setAnalysis(parsed);
      } catch (e) {
        console.error('Failed to parse analysis result from session storage:', e);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  // Loading Shield
  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Handle printing document
  const handlePrint = () => {
    window.print();
  };

  // Fallback metric mapping just in case the JSON model skipped rendering pure categorical variables on edge cases
  const safeBreakdown = analysis.score_breakdown || {
    fairness: analysis.trust_score,
    clarity: analysis.trust_score,
    completeness: analysis.trust_score,
    legal_compliance: analysis.trust_score,
    balance_of_power: analysis.trust_score,
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Top action bar mapping cleanly around print contexts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 w-full sm:w-auto justify-start border border-gray-200 dark:border-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Contract</span>
        </Button>

        <Button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 border border-gray-200 dark:border-gray-700 shadow-xs w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Structural Flow */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs print:border-none print:shadow-none">
            <TrustScoreGauge score={analysis.trust_score} grade={analysis.trust_grade} />
          </Card>

          <ScoreBreakdown breakdown={safeBreakdown} />
        </div>

        {/* Right Column Structural Flow */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          <AnalysisHeader analysis={analysis} />

          {/* Protective wrapper for Missing Clauses if empty strictly evaluates to false */}
          {analysis.missing_clauses && analysis.missing_clauses.length > 0 && (
            <MissingClauses clauses={analysis.missing_clauses} />
          )}

          <div className="pt-2">
            <ClauseList clauses={analysis.clauses} />
          </div>
        </div>
      </div>

    </div>
  );
}
