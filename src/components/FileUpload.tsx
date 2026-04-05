'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, FileText } from 'lucide-react';

export interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

export function FileUpload({ onTextExtracted, disabled = false }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Use pdf.js via CDN to avoid bundler issues with Object.defineProperty
    const pdfjsLib = (window as any).pdfjsLib;
    
    if (!pdfjsLib) {
      // Dynamically load pdf.js from CDN
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
        script.type = 'module';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PDF parser'));
        document.head.appendChild(script);
      });
    }

    // Fallback: read as text if pdf.js isn't available
    const lib = (window as any).pdfjsLib;
    if (!lib) {
      // Try a simple raw text extraction as fallback
      const text = await file.text();
      if (text.length > 100) return text;
      throw new Error('PDF parser failed to load. Try uploading a .txt file instead.');
    }

    lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      textParts.push(pageText);
    }
    
    return textParts.join('\n\n');
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      let extractedText = '';

      if (file.type === 'text/plain') {
        extractedText = await file.text();
      } else if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else {
        throw new Error('Please upload a PDF or TXT file.');
      }

      const trimmed = extractedText.trim();
      if (!trimmed || trimmed.length < 50) {
        throw new Error('Could not extract enough text. The document might be image-based or empty.');
      }

      onTextExtracted(trimmed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-uploaded
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-stretch w-full sm:w-auto">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        onChange={handleChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled || isUploading}
        size="lg"
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-2.5"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <FileText className="w-4 h-4 text-muted-foreground" />
        )}
        <span>{isUploading ? 'Extracting text...' : 'Upload PDF / TXT'}</span>
      </Button>

      {error && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
