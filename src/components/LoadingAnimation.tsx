'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const LOADING_MESSAGES = [
  "Reading the fine print...",
  "Checking for hidden fees...",
  "Analyzing clause fairness...",
  "Calculating trust score...",
  "Identifying red flags...",
  "Preparing negotiation strategies..."
];

export function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  // Cycle messages every 2 seconds
  React.useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  // Update fake progress bar
  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          // Pause at 95% until genuinely finished.
          return prev;
        }
        // Slowing increment rate organically as it scales up
        const bump = Math.random() * (100 - prev) * 0.15;
        return prev + bump;
      });
    }, 500);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gray-50/50 backdrop-blur-xs dark:bg-black/50">
      <Card className="flex w-full max-w-sm flex-col items-center p-8 shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        
        {/* Animated Spinner */}
        <div className="mb-6 flex animate-spin items-center justify-center text-blue-600 dark:text-blue-500">
          <Loader2 className="h-12 w-12" />
        </div>

        {/* Dynamic Messaging */}
        <div className="relative flex h-8 w-full items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="absolute text-center text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Fake Progress */}
        <div className="mt-6 w-full space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out dark:bg-blue-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

      </Card>
    </div>
  );
}
