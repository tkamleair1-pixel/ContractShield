'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';
import { MissingClause } from '@/lib/types';
import { motion } from 'framer-motion';

export interface MissingClausesProps {
  clauses: MissingClause[];
}

// Utility to assign background and border hues based on graded severity scale
function getImportanceColor(importance: string) {
  switch (importance.toLowerCase()) {
    case 'critical':
      return 'border-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-500/50';
    case 'high':
      return 'border-orange-500 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-500/50';
    case 'medium':
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-500/50';
    case 'low':
      return 'border-gray-500 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-500/50';
    default:
      return 'border-gray-300 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700';
  }
}

// Generates explicit tailwind labels matching color scheme map
function getBadgeColor(importance: string) {
  switch (importance.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    case 'low':
      return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  }
}

// Converts generic string grading into a numerical sortable index
function getImportanceValue(importance: string) {
  switch (importance.toLowerCase()) {
    case 'critical':
      return 4;
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

export function MissingClauses({ clauses }: MissingClausesProps) {
  // Gracefully yield immediately if no clauses present
  if (!clauses || clauses.length === 0) return null;

  // Clone array and sort based on importance values (Critical => High => Medium => Low)
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
    <Card className="border-yellow-500 dark:border-yellow-600 shadow-xs overflow-hidden bg-white dark:bg-gray-900">
      {/* Alert Header Lockup */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-yellow-50/50 dark:bg-yellow-900/10 flex items-start sm:items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg uppercase tracking-tight">
            ⚠️ Missing Clauses Detected
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
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
              key={\`\${clause.clause_name}-\${index}\`}
              variants={itemVariants}
              className={\`p-4 border-l-4 rounded-r-md \${getImportanceColor(clause.importance)}\`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                  {clause.clause_name}
                </h4>
                <span
                  className={\`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 w-fit \${getBadgeColor(
                    clause.importance
                  )}\`}
                >
                  {clause.importance}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {clause.explanation}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Card>
  );
}
