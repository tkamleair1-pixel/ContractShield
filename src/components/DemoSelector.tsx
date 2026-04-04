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
  const [demoTexts, setDemoTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadDemos() {
      try {
        const fetchPromises = DEMO_CONTRACTS_INFO.map(async (demo) => {
          const response = await fetch(`/demo-contracts/${demo.id}.txt`);
          if (!response.ok) return [demo.id, ''];
          const text = await response.text();
          return [demo.id, text];
        });

        const results = await Promise.all(fetchPromises);
        const newDemoTexts = Object.fromEntries(results);
        setDemoTexts(newDemoTexts);
      } catch (error) {
        console.error('Failed to load demo contracts:', error);
      }
    }

    loadDemos();
  }, []);

  const handleSelectDemo = (demoId: string) => {
    if (disabled) return;
    const text = demoTexts[demoId];
    if (text) {
      onSelect(text);
      setSelectedDemo(demoId);
    }
  };

  const getBadgeColor = (score: number) => {
    if (score >= 70) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    }
    if (score >= 40) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-orange-900/30 dark:text-orange-400 border-yellow-200 dark:border-orange-800';
    }
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        Try a demo contract
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_CONTRACTS_INFO.map((demo) => (
          <Card
            key={demo.id}
            onClick={() => handleSelectDemo(demo.id)}
            className={`cursor-pointer transition-all duration-200 p-5 hover:shadow-lg dark:hover:shadow-black/40 flex flex-col items-start gap-3 h-full ${
              disabled ? 'opacity-50 pointer-events-none' : ''
            } ${
              selectedDemo === demo.id
                ? 'ring-2 ring-blue-500 border-transparent dark:ring-blue-500'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700/50'
            }`}
          >
            <div className="text-3xl">{demo.icon}</div>
            <div className="flex-1 space-y-1.5">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {demo.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {demo.description}
              </p>
            </div>
            <div className="mt-auto pt-4 w-full">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(
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
