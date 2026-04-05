'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { getGradeColor } from '@/lib/utils';

export interface TrustScoreGaugeProps {
  score: number;
  grade: string;
}

function getColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

export function TrustScoreGauge({ score, grade }: TrustScoreGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const strokeColor = getColor(score);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gauge Container */}
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted transition-colors"
          />
          {/* Animated score circle */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Score text overlay */}
        <motion.div
          className="absolute flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span className="text-5xl font-bold" style={{ color: strokeColor }}>
            {score}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            / 100
          </span>
        </motion.div>
      </div>

      {/* Grade display */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Trust Grade
        </span>
        <span className={`text-3xl font-extrabold ${getGradeColor(score)}`}>
          {grade}
        </span>
      </motion.div>
    </div>
  );
}
