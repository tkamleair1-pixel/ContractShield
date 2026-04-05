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
  const redCount = analysis.clauses.filter((c) => c.category === 'red').length;
  const yellowCount = analysis.clauses.filter((c) => c.category === 'yellow').length;
  const greenCount = analysis.clauses.filter((c) => c.category === 'green').length;

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
      case 'critical':
        return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case 'moderate':
        return <Shield className="w-8 h-8 text-yellow-500" />;
      case 'low':
      case 'minimal':
        return <ShieldCheck className="w-8 h-8 text-green-500" />;
      default:
        return <Shield className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Top Banner */}
      <div className="bg-muted/50 p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {analysis.contract_type_label || formatContractType(analysis.contract_type)}
          </h2>
          <Badge
            className={`px-3 py-1.5 uppercase tracking-wider font-bold text-xs shadow-sm border ${getRiskLevelColor(
              analysis.overall_risk_level
            )}`}
          >
            {analysis.overall_risk_level} Risk
          </Badge>
        </div>

        {/* Executive Summary */}
        <div className="flex items-start gap-4 p-4 bg-card/80 rounded-xl border border-border/50 backdrop-blur-sm">
          <div className="shrink-0 mt-1">{getRiskIcon(analysis.overall_risk_level)}</div>
          <p className="text-foreground/90 font-medium leading-relaxed md:text-lg">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-card">
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-2xl font-bold text-red-500 flex items-center gap-2">
            🔴 <span className="tracking-tight">{redCount}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Red Flags</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
            🟡 <span className="tracking-tight">{yellowCount}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Negotiable</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-2xl font-bold text-green-500 flex items-center gap-2">
            🟢 <span className="tracking-tight">{greenCount}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Standard</span>
        </div>
      </div>

      {/* Highlights & Concerns */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-card">
        
        {/* Key Concerns */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Key Concerns
          </h3>
          {analysis.key_concerns && analysis.key_concerns.length > 0 ? (
            <ul className="space-y-2.5 mt-3">
              {analysis.key_concerns.slice(0, 5).map((concern, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <span className="text-red-500 mt-0.5 shrink-0 text-xs">●</span>
                  <span className="leading-relaxed">{concern}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic mt-3">No major concerns identified.</p>
          )}
        </div>

        {/* Positive Aspects */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground border-b border-border pb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Positive Aspects
          </h3>
          {analysis.positive_aspects && analysis.positive_aspects.length > 0 ? (
            <ul className="space-y-2.5 mt-3">
              {analysis.positive_aspects.slice(0, 5).map((aspect, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <span className="leading-relaxed">{aspect}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic mt-3">No specific positive aspects highlighted.</p>
          )}
        </div>

      </div>
    </Card>
  );
}
