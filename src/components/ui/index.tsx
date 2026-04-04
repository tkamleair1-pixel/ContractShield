'use client'

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Badge ───────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'red' | 'yellow' | 'green' | 'outline-solid'
  className?: string
}

const badgeVariants: Record<string, string> = {
  default: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  outline: 'bg-transparent text-gray-400 border-white/10',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// ─── Glass Card ──────────────────────────────────────────────────

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  variant?: 'default' | 'strong'
  hover?: boolean
  className?: string
}

export function GlassCard({
  children,
  variant = 'default',
  hover = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl',
        variant === 'strong' ? 'glass-strong' : 'glass',
        hover && 'hover:border-indigo-400/20 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Score Ring ───────────────────────────────────────────────────

interface ScoreRingProps {
  score: number
  maxScore?: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  className?: string
}

export function ScoreRing({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 8,
  color,
  label,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / maxScore) * circumference
  const resolvedColor =
    color || (score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444')

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color: resolvedColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        {label && (
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton Loader ─────────────────────────────────────────────

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg bg-white/5 animate-pulse"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

// ─── Progress Bar ────────────────────────────────────────────────

interface ProgressBarProps {
  value: number
  maxValue?: number
  color?: string
  label?: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value,
  maxValue = 100,
  color,
  label,
  showValue = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const resolvedColor =
    color || (percentage >= 70 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444')

  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showValue && (
            <span className="font-medium" style={{ color: resolvedColor }}>
              {value}/{maxValue}
            </span>
          )}
        </div>
      )}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: resolvedColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
