'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronDown, ChevronUp, Copy, CheckCircle2 } from 'lucide-react';
import { Clause } from '@/lib/types';
import { CLAUSE_CATEGORIES } from '@/lib/constants';
import { copyToClipboard } from '@/lib/utils';

export interface ClauseCardProps {
  clause: Clause;
}

const categoryStyles = {
  red: {
    border: 'border-l-red-500',
    bg: 'bg-red-500/5',
    badge: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  yellow: {
    border: 'border-l-yellow-500',
    bg: 'bg-yellow-500/5',
    badge: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  },
  green: {
    border: 'border-l-green-500',
    bg: 'bg-green-500/5',
    badge: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
};

export function ClauseCard({ clause }: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const config = CLAUSE_CATEGORIES[clause.category] || CLAUSE_CATEGORIES['yellow'];
  const styles = categoryStyles[clause.category] || categoryStyles.yellow;

  const handleCopy = async () => {
    if (clause.negotiation_script) {
      try {
        await copyToClipboard(clause.negotiation_script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // silently fail
      }
    }
  };

  let severityColor = '#22c55e';
  if (clause.severity !== undefined) {
    if (clause.severity >= 7) severityColor = '#ef4444';
    else if (clause.severity >= 4) severityColor = '#f97316';
  }

  return (
    <Card
      className={`border-l-4 ${styles.border} ${styles.bg} p-5 transition-all w-full flex flex-col gap-4`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground flex-1 leading-snug">
          <span className="text-xl shrink-0" aria-hidden="true">
            {config.icon}
          </span>
          <span>
            {clause.id}. {clause.title}
          </span>
        </h3>
        <span
          className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full shrink-0 ${styles.badge}`}
        >
          {config.label}
        </span>
      </div>

      {/* Original Quoted Text */}
      <blockquote className="border-l-4 border-border pl-4 py-2 text-sm text-muted-foreground italic bg-muted/30 rounded-r-lg">
        &ldquo;{clause.original_text}&rdquo;
      </blockquote>

      {/* Plain English translation */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <span className="text-base text-primary">💬</span>
          <span>In plain English:</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {clause.plain_english}
        </p>
      </div>

      {/* Flagged Section */}
      {(clause.category === 'red' || clause.category === 'yellow') && (
        <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-border/50">
          {clause.why_flagged && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <span className="text-base">⚠️</span>
                <span>Why this is a concern:</span>
              </div>
              <p className="text-sm text-foreground/80">
                {clause.why_flagged}
              </p>
            </div>
          )}

          {clause.recommendation && (
            <div className="p-3.5 bg-muted/50 rounded-xl border border-border/50 space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <span className="text-base text-green-500">✅</span>
                <span>Recommendation:</span>
              </div>
              <p className="text-sm text-foreground/80">
                {clause.recommendation}
              </p>
            </div>
          )}

          {/* Negotiation script */}
          {clause.negotiation_script && (
            <div className="pt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                type="button"
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isExpanded ? 'Hide Negotiation Script' : 'View Negotiation Script'}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'mt-3 opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
                }`}
              >
                <div className="relative group p-4 bg-primary/5 border border-primary/10 rounded-xl text-sm text-foreground/90 font-medium italic">
                  &ldquo;{clause.negotiation_script}&rdquo;
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 bg-card rounded-lg border border-border hover:bg-muted transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Copy to clipboard"
                    type="button"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Severity Bar */}
      {clause.severity !== undefined && (
        <div className="mt-2 space-y-1.5 border-t border-border/50 pt-3">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Risk Severity</span>
            <span>{clause.severity} / 10</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${(clause.severity / 10) * 100}%`,
                backgroundColor: severityColor 
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
