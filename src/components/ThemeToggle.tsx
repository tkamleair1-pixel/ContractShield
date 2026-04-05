'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('contractshield-theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('contractshield-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('contractshield-theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative p-2.5 rounded-xl transition-all duration-300 
        bg-gray-100 dark:bg-white/[0.06] 
        hover:bg-gray-200 dark:hover:bg-white/[0.12] 
        border border-gray-200 dark:border-white/[0.08]
        text-gray-600 dark:text-gray-300
        hover:text-gray-900 dark:hover:text-white
        hover:scale-105 active:scale-95
        group"
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="w-[18px] h-[18px] transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
