'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { DemoSelector } from './DemoSelector';
import { FileUpload } from './FileUpload';
import { APP_CONFIG } from '@/lib/constants';

export interface ContractInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export function ContractInput({ onAnalyze, isLoading }: ContractInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    setError(null);
    
    if (text.length < APP_CONFIG.minContractLength) {
      setError(`Contract is too short. Minimum ${APP_CONFIG.minContractLength} characters required.`);
      return;
    }
    
    if (text.length > APP_CONFIG.maxContractLength) {
      setError(`Contract is too long. Maximum ${APP_CONFIG.maxContractLength} characters allowed.`);
      return;
    }
    
    onAnalyze(text);
  };

  const charsRemaining = APP_CONFIG.minContractLength - text.length;
  const isReady = text.length >= APP_CONFIG.minContractLength && text.length <= APP_CONFIG.maxContractLength;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {APP_CONFIG.name}
        </h1>
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
          {APP_CONFIG.tagline}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {APP_CONFIG.description}
        </p>
      </div>

      {/* Auxiliary Input Controllers */}
      <DemoSelector onSelect={setText} disabled={isLoading} />

      {/* Main Textarea Input */}
      <div className="space-y-2">
        <label htmlFor="contract-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Paste your contract text here
        </label>
        <Textarea
          id="contract-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          disabled={isLoading}
          placeholder="Paste your rental agreement, employment contract, or terms of service here..."
          className="min-h-[400px] font-mono text-sm dark:bg-gray-900 border-gray-300 dark:border-gray-700"
        />
        
        {/* Character counter */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{text.length.toLocaleString()} characters</span>
          <span className={isReady ? 'text-green-600 dark:text-green-500 font-medium' : ''}>
            {text.length === 0 
              ? 'Waiting for input'
              : !isReady && text.length < APP_CONFIG.minContractLength
              ? `Need ${charsRemaining.toLocaleString()} more characters`
              : !isReady && text.length > APP_CONFIG.maxContractLength
              ? `Exceeded limit by ${(text.length - APP_CONFIG.maxContractLength).toLocaleString()} characters`
              : 'Ready to analyze'}
          </span>
        </div>
      </div>

      {/* Live Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Action buttons row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button 
          onClick={handleAnalyze} 
          disabled={!isReady || isLoading} 
          className="w-full sm:flex-1"
          size="lg"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Contract'}
        </Button>
        <div className="w-full sm:w-auto h-full flex items-stretch">
          <FileUpload onTextExtracted={setText} disabled={isLoading} />
        </div>
      </div>

      {/* Footer Meta */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
        🔒 We don't store your documents. Data is processed securely.
      </div>
    </div>
  );
}
