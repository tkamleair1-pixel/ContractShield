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

export function ClauseCard({ clause }: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback map mapping category index directly to our standard configs mapping 
  // (ensures it won't crash if an obscure type drops in)
  const config = CLAUSE_CATEGORIES[clause.category] || CLAUSE_CATEGORIES['yellow'];

  const handleCopy = async () => {
    if (clause.negotiation_script) {
      const success = await copyToClipboard(clause.negotiation_script);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Resolve severity scaling color metrics
  let severityColor = 'bg-green-500';
  if (clause.severity !== undefined) {
    if (clause.severity >= 7) severityColor = 'bg-red-500';
    else if (clause.severity >= 4) severityColor = 'bg-orange-500';
  }

  return (
    <Card
      className={\`border-l-4 p-5 transition-all w-full flex flex-col gap-4 \${config.bgClass} \${config.borderClass}\`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100 flex-1 leading-snug">
          <span className="text-xl shrink-0" aria-hidden="true">
            {config.icon}
          </span>
          <span>
            {clause.id}. {clause.title}
          </span>
        </h3>
        <span
          className={\`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md shrink-0 \${config.badgeClass}\`}
        >
          {config.label}
        </span>
      </div>

      {/* Original Quoted Text */}
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 italic bg-white/40 dark:bg-gray-900/30 rounded-r-md shadow-xs">
        "{clause.original_text}"
      </blockquote>

      {/* Plain English translation lockup */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
          <span className="text-base text-blue-500">💬</span>
          <span>In plain English:</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {clause.plain_english}
        </p>
      </div>

      {/* Flagged Section (Why flagged + Recommendation) */}
      {(clause.category === 'red' || clause.category === 'yellow') && (
        <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
          {clause.why_flagged && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <span className="text-base">⚠️</span>
                <span>Why this is a concern:</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {clause.why_flagged}
              </p>
            </div>
          )}

          {clause.recommendation && (
            <div className="p-3.5 bg-white/70 dark:bg-gray-950/40 rounded-md border border-gray-200/50 dark:border-gray-700/50 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <span className="text-base text-green-500">✅</span>
                <span>Recommendation:</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {clause.recommendation}
              </p>
            </div>
          )}

          {/* Negotiate script expansion */}
          {clause.negotiation_script && (
            <div className="pt-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                type="button"
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isExpanded ? 'Hide Negotiation Script' : 'View Negotiation Script'}
              </button>

              <div
                className={\`transition-all duration-300 overflow-hidden \${
                  isExpanded ? 'mt-3 opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
                }\`}
              >
                <div className="relative group p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-900/40 rounded-md text-sm text-gray-800 dark:text-gray-200 font-medium italic shadow-inner">
                  "{clause.negotiation_script}"
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Copy to clipboard"
                    type="button"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Embedded Severity Progress */}
      {clause.severity !== undefined && (
        <div className="mt-2 space-y-1.5 border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span>Risk Severity</span>
            <span>{clause.severity} / 10</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={\`h-full rounded-full \${severityColor} transition-all duration-1000 ease-out\`}
              style={{ width: \`\${(clause.severity / 10) * 100}%\` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
