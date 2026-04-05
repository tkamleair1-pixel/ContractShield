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

function getScoreBarColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getTextStyle(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="border-b border-border pb-4 bg-muted/30">
        <CardTitle className="text-xl font-bold">
          Score Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
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
            const barColor = getScoreBarColor(scoreValue);
            const textColor = getTextStyle(scoreValue);

            return (
              <motion.div
                key={key}
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 sm:gap-6 items-center"
              >
                {/* Label */}
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="text-sm font-semibold text-foreground/80">
                    {label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center">
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${scoreValue}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                </div>

                {/* Number */}
                <div className="text-right sm:w-12">
                  <span className={`text-lg font-bold ${textColor}`}>
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
