'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';
import { MissingClause } from '@/lib/types';
import { motion } from 'framer-motion';

export interface MissingClausesProps {
  clauses: MissingClause[];
}

function getImportanceColor(importance: string) {
  switch (importance.toLowerCase()) {
    case 'critical':
      return 'border-l-red-500 bg-red-500/5';
    case 'high':
      return 'border-l-orange-500 bg-orange-500/5';
    case 'medium':
      return 'border-l-yellow-500 bg-yellow-500/5';
    case 'low':
      return 'border-l-gray-400 bg-muted/30';
    default:
      return 'border-l-gray-400 bg-muted/30';
  }
}

function getBadgeColor(importance: string) {
  switch (importance.toLowerCase()) {
    case 'critical':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    case 'high':
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
    case 'low':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

function getImportanceValue(importance: string) {
  switch (importance.toLowerCase()) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
}

export function MissingClauses({ clauses }: MissingClausesProps) {
  if (!clauses || clauses.length === 0) return null;

  const sortedClauses = [...clauses].sort(
    (a, b) => getImportanceValue(b.importance) - getImportanceValue(a.importance)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <Card className="border-yellow-500/50 overflow-hidden">
      {/* Alert Header */}
      <div className="p-5 border-b border-border bg-yellow-500/5 flex items-start sm:items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <h3 className="font-bold text-foreground text-lg tracking-tight">
            ⚠️ Missing Clauses Detected
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            These protections are typically included but are absent from this contract.
          </p>
        </div>
      </div>

      <div className="p-6">
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {sortedClauses.map((clause, index) => (
            <motion.div
              key={`${clause.clause}-${index}`}
              variants={itemVariants}
              className={`p-4 border-l-4 rounded-r-xl ${getImportanceColor(clause.importance)}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h4 className="font-semibold text-foreground leading-tight">
                  {clause.clause}
                </h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 w-fit ${getBadgeColor(
                    clause.importance
                  )}`}
                >
                  {clause.importance}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {clause.explanation}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Card>
  );
}
