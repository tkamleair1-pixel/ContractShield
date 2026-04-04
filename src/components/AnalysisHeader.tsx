'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatContractType, getRiskLevelColor } from '@/lib/utils';
import { AnalysisResult } from '@/lib/types';
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

export interface AnalysisHeaderProps {
  analysis: AnalysisResult;
}

export function AnalysisHeader({ analysis }: AnalysisHeaderProps) {
  // Clause categorical tally
  const redCount = analysis.clauses.filter((c) => c.category === 'red').length;
  const yellowCount = analysis.clauses.filter((c) => c.category === 'yellow').length;
  const greenCount = analysis.clauses.filter((c) => c.category === 'green').length;

  // Icon mapping helper specific to contextual risk payload
  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case 'moderate':
        return <Shield className="w-8 h-8 text-yellow-500" />;
      case 'low':
        return <ShieldCheck className="w-8 h-8 text-green-500" />;
      default:
        return <Shield className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-xs">
      {/* 1. Top Banner (Gradient background) */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50/50 dark:from-gray-800/40 dark:to-blue-900/10 p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {analysis.contract_type_label || formatContractType(analysis.contract_type)}
            </h2>
          </div>
          <Badge
            className={\`px-3 py-1 uppercase tracking-wider font-bold text-sm shadow-xs border \${getRiskLevelColor(
              analysis.overall_risk_level
            )}\`}
          >
            {analysis.overall_risk_level} Risk
          </Badge>
        </div>

        {/* 2. Executive Summary Context Row */}
        <div className="flex items-start gap-4 p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg shadow-xs border border-white/40 dark:border-gray-700/50 backdrop-blur-xs">
          <div className="shrink-0 mt-1">{getRiskIcon(analysis.overall_risk_level)}</div>
          <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed md:text-lg">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* 3. Stats Ribbon (3 Columns) */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-2xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
            🔴 <span className="tracking-tight">{redCount}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">Red Flags</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
            🟡 <span className="tracking-tight">{yellowCount}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">Negotiable</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-2xl font-bold text-green-600 dark:text-green-500 flex items-center gap-2">
            🟢 <span className="tracking-tight">{greenCount}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">Standard</span>
        </div>
      </div>

      {/* 4. Highlights & Concerns (Split Mapping) */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900">
        
        {/* Key Concerns */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Key Concerns
          </h3>
          {analysis.key_concerns && analysis.key_concerns.length > 0 ? (
            <ul className="space-y-2 mt-3">
              {analysis.key_concerns.slice(0, 5).map((concern, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-red-500 mt-1 shrink-0 text-[10px]">🔴</span>
                  <span className="leading-relaxed">{concern}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic mt-3">No major concerns identified.</p>
          )}
        </div>

        {/* Positive Aspects */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Positive Aspects
          </h3>
          {analysis.positive_aspects && analysis.positive_aspects.length > 0 ? (
            <ul className="space-y-2 mt-3">
              {analysis.positive_aspects.slice(0, 5).map((aspect, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5 shrink-0 text-base leading-none">✓</span>
                  <span className="leading-relaxed">{aspect}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic mt-3">No specific positive aspects highlighted.</p>
          )}
        </div>

      </div>
    </Card>
  );
}
