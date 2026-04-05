'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { DEMO_CONTRACTS_INFO } from '@/lib/constants';

export interface DemoSelectorProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function DemoSelector({ onSelect, disabled = false }: DemoSelectorProps) {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const handleSelectDemo = (demoId: string) => {
    if (disabled) return;
    const demo = DEMO_CONTRACTS_INFO.find((d) => d.id === demoId);
    if (demo?.rawText) {
      onSelect(demo.rawText);
      setSelectedDemo(demoId);
    }
  };

  const getBadgeStyle = (score: number) => {
    if (score >= 70) {
      return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    }
    if (score >= 40) {
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
    }
    return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Start: Choose a Demo
        </h3>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 animate-pulse">
          Featured
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_CONTRACTS_INFO.map((demo) => (
          <Card
            key={demo.id}
            onClick={() => handleSelectDemo(demo.id)}
            className={`cursor-pointer transition-all duration-300 p-5 hover:shadow-xl flex flex-col items-start gap-3 h-full group overflow-hidden relative ${
              disabled ? 'opacity-50 pointer-events-none' : ''
            } ${
              selectedDemo === demo.id
                ? 'ring-2 ring-primary border-primary/40 bg-primary/[0.03] scale-[1.02]'
                : 'hover:border-primary/30 hover:-translate-y-1 bg-card/50 backdrop-blur-sm'
            }`}
          >
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-20 ${
              demo.expectedScore >= 70 ? 'bg-green-500' : demo.expectedScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />

            <div className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {demo.icon}
            </div>
            <div className="flex-1 space-y-1.5 relative z-10">
              <h4 className="font-bold text-foreground leading-tight text-lg group-hover:text-primary transition-colors">
                {demo.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {demo.description}
              </p>
            </div>
            <div className="mt-auto pt-3 w-full relative z-10">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getBadgeStyle(
                  demo.expectedScore
                )}`}
              >
                Expected Score: {demo.expectedScore}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
