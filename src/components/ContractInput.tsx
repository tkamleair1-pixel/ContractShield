'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { DemoSelector } from './DemoSelector';
import { FileUpload } from './FileUpload';
import { ThemeToggle } from './ThemeToggle';
import { APP_CONFIG } from '@/lib/constants';
import { Shield } from 'lucide-react';

export interface ContractInputProps {
  onAnalyze: () => void;
  isLoading: boolean;
  contractText: string;
  setContractText: (text: string) => void;
}

export function ContractInput({ onAnalyze, isLoading, contractText = '', setContractText }: ContractInputProps) {
  const [error, setError] = useState<string | null>(null);
  console.log('[ContractShield] Rendering input with text length:', contractText?.length);

  const handleAnalyze = () => {
    setError(null);

    if (contractText.length < APP_CONFIG.minContractLength) {
      setError(`Contract is too short. Minimum ${APP_CONFIG.minContractLength} characters required.`);
      return;
    }

    if (contractText.length > APP_CONFIG.maxContractLength) {
      setError(`Contract is too long. Maximum ${APP_CONFIG.maxContractLength} characters allowed.`);
      return;
    }

    onAnalyze();
  };

  const charsRemaining = APP_CONFIG.minContractLength - contractText.length;
  const isReady = contractText.length >= APP_CONFIG.minContractLength && contractText.length <= APP_CONFIG.maxContractLength;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header section */}
      <div className="text-center space-y-6 relative overflow-hidden pb-4">
        <div className="absolute top-0 right-0 p-4">
          <ThemeToggle />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest mb-2 animate-bounce">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen AI Analysis
        </div>

        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="relative">
             <Shield className="w-12 h-12 text-primary relative z-10" />
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black gradient-text tracking-tighter">
            {APP_CONFIG.name}
          </h1>
        </div>
        <p className="text-2xl font-semibold text-foreground/90 max-w-2xl mx-auto leading-tight">
          {APP_CONFIG.tagline}
        </p>
        <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {APP_CONFIG.description}
        </p>
      </div>

      {/* Demo Contracts Section */}
      <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <DemoSelector onSelect={setContractText} disabled={isLoading} />
      </div>

      {/* Main Textarea Input */}
      <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between">
          <label htmlFor="contract-text" className="text-sm font-bold text-foreground/80 uppercase tracking-wide">
            Draft or Paste Contract
          </label>
           <button 
            onClick={() => setContractText('')}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Clear Text
          </button>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
          <Textarea
            id="contract-text"
            value={contractText}
            onChange={(e) => {
              setContractText(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            placeholder="Paste your rental agreement, employment contract, or technical TOS here..."
            className="min-h-[400px] font-mono text-sm relative z-10 bg-card/80 backdrop-blur-md border-border/50 focus:border-primary/50 transition-all rounded-xl p-6 shadow-sm"
          />
        </div>

        {/* Character counter and status */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium text-muted-foreground">
               {contractText.length.toLocaleString()} chars
             </span>
             {contractText.length > 0 && (
               <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-500 ${isReady ? 'bg-green-500' : 'bg-primary'}`} 
                   style={{ width: `${Math.min(100, (contractText.length / APP_CONFIG.minContractLength) * 100)}%` }}
                 />
               </div>
             )}
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${isReady ? 'text-green-500' : 'text-muted-foreground'}`}>
            {contractText.length === 0
              ? 'Empty document'
              : !isReady && contractText.length < APP_CONFIG.minContractLength
              ? `Need ${charsRemaining.toLocaleString()} more`
              : !isReady && contractText.length > APP_CONFIG.maxContractLength
              ? `Too long by ${(contractText.length - APP_CONFIG.maxContractLength).toLocaleString()}`
              : '✨ Document Ready for Shield'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl font-bold flex items-center gap-2 animate-shake">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch pt-2 animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !contractText}
          className={`flex-1 h-14 text-lg font-bold shadow-xl transition-all duration-500 ${
            isReady && !isLoading ? 'bg-primary hover:scale-[1.02] hover:shadow-primary/25' : ''
          }`}
          size="lg"
        >
          {isLoading ? "Analyzing..." : "Analyze Contract"}
        </Button>
        <FileUpload onTextExtracted={setContractText} disabled={isLoading} />
      </div>

      {/* Footer Meta */}
      <div className="flex flex-col items-center gap-2 pt-8 text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 grayscale opacity-60">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Secure AES-256</span>
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-60">
            <span className="text-xs font-bold uppercase tracking-wider">Privacy Guaranteed</span>
          </div>
        </div>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">
           &copy; 2024 {APP_CONFIG.name} AI Lab. No data is ever stored.
        </p>
      </div>
    </div>
  );
}
