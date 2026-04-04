'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContractInput } from '@/components/ContractInput';
import { LoadingAnimation } from '@/components/LoadingAnimation';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (contractText: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contract_text: contractText }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        sessionStorage.setItem('analysis_result', JSON.stringify(result.data));
        router.push('/results');
      } else {
        alert(result.error || 'The analysis failed to complete. Please try another file.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full h-full py-12 px-4 lg:px-8">
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <ContractInput onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}
    </main>
  );
}
