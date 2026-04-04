'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { ScoreBreakdown as ScoreBreakdownType } from '@/lib/types';
import { motion } from 'framer-motion';

export interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
}

const METRICS = [
  { key: 'fairness', label: 'Fairness & Balance', icon: '⚖️' },
  { key: 'clarity', label: 'Clarity of Language', icon: '📝' },
  { key: 'completeness', label: 'Completeness', icon: '✅' },
  { key: 'legal_compliance', label: 'Legal Compliance', icon: '⚖️' },
  { key: 'balance_of_power', label: 'Balance of Power', icon: '🤝' },
] as const;

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500!';
  if (score >= 60) return 'bg-yellow-500!';
  if (score >= 40) return 'bg-orange-500!';
  return 'bg-red-500!';
}

function getTextStyle(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  // Stagger container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // Item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <Card className="w-full shadow-xs dark:bg-gray-900 overflow-hidden border-gray-200 dark:border-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800/50 pb-4 bg-gray-50/50 dark:bg-gray-800/20">
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100 font-bold">
          Score Breakdown
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          How we calculated the trust score
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {METRICS.map(({ key, label, icon }) => {
            const scoreValue = breakdown[key as keyof ScoreBreakdownType] || 0;
            const barFillColor = getScoreColor(scoreValue);
            const textFillColor = getTextStyle(scoreValue);

            return (
              <motion.div
                key={key}
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 sm:gap-6 items-center"
              >
                {/* Label Row */}
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center">
                  <Progress
                    value={scoreValue}
                    className={\`h-2.5 dark:bg-gray-800 [&>div]:\${barFillColor}\`}
                  />
                </div>

                {/* Number Display */}
                <div className="text-right sm:w-12">
                  <span className={\`text-lg font-bold \${textFillColor}\`}>
                    {scoreValue}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
