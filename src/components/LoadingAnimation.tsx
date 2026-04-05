'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

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

  React.useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(messageInterval);
  }, []);

  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const bump = Math.random() * (100 - prev) * 0.15;
        return prev + bump;
      });
    }, 500);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col items-center p-10 rounded-2xl glass-card shadow-2xl">
        
        {/* Animated Shield Icon with Radar Pulse */}
        <div className="relative mb-6">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
          <motion.div
            className="relative z-10 text-primary"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shield className="h-16 w-16 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
          </motion.div>
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
              className="absolute text-center text-sm font-medium text-foreground/80"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>

      </div>
    </div>
  );
}
