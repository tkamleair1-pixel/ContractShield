'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ClauseCard } from './ClauseCard';
import { Clause, ClauseCategory } from '@/lib/types';
import { motion } from 'framer-motion';

export interface ClauseListProps {
  clauses: Clause[];
  initialFilter?: ClauseCategory | 'all';
}

export function ClauseList({ clauses, initialFilter = 'all' }: ClauseListProps) {
  const [activeFilter, setActiveFilter] = useState<ClauseCategory | 'all'>(initialFilter);

  const redCount = clauses.filter((c) => c.category === 'red').length;
  const yellowCount = clauses.filter((c) => c.category === 'yellow').length;
  const greenCount = clauses.filter((c) => c.category === 'green').length;

  const filteredClauses =
    activeFilter === 'all' ? clauses : clauses.filter((c) => c.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const filters: Array<{ id: ClauseCategory | 'all'; label: string; count: number; colorClass: string }> = [
    {
      id: 'all',
      label: 'All',
      count: clauses.length,
      colorClass: 'bg-muted text-muted-foreground',
    },
    {
      id: 'red',
      label: 'Red Flags',
      count: redCount,
      colorClass: 'bg-red-500/10 text-red-500',
    },
    {
      id: 'yellow',
      label: 'Negotiate',
      count: yellowCount,
      colorClass: 'bg-yellow-500/10 text-yellow-500',
    },
    {
      id: 'green',
      label: 'Standard',
      count: greenCount,
      colorClass: 'bg-green-500/10 text-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">
        Detailed Analysis
      </h2>

      <Tabs value={activeFilter} onValueChange={(val) => setActiveFilter(val as ClauseCategory | 'all')}>
        <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          <TabsList className="inline-flex min-w-max p-1 bg-muted border border-border rounded-xl">
            {filters.map((filter) => (
              <TabsTrigger
                key={filter.id}
                value={filter.id}
                className="gap-2 px-4 py-2 text-sm font-medium rounded-lg"
              >
                {filter.label}
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${filter.colorClass}`}
                >
                  {filter.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {filters.map((filter) => (
          <TabsContent key={filter.id} value={filter.id} className="mt-4">
            {filteredClauses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-2xl border-border bg-muted/30">
                <span className="text-3xl mb-3">📭</span>
                <p className="text-muted-foreground font-medium">
                  No {filter.id !== 'all' ? filter.label.toLowerCase() : ''} clauses found in this document.
                </p>
              </div>
            ) : (
              <motion.div
                className="flex flex-col gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={activeFilter}
              >
                {filteredClauses.map((clause) => (
                  <motion.div key={clause.id} variants={itemVariants}>
                    <ClauseCard clause={clause} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
