'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, Loader2 } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';

export interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

export function FileUpload({ onTextExtracted, disabled = false }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract text from PDF');
      }

      onTextExtracted(data.text);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (files: File[]) => {
      if (files.length > 0) handleFileUpload(files[0]);
    },
    onDropRejected: (fileRejections: FileRejection[]) => {
      const rejectionMessage = fileRejections[0]?.errors[0]?.message || 'File rejected';
      setError(`Upload failed: ${rejectionMessage}`);
    },
    disabled: disabled || isUploading,
  });

  return (
    <div className="flex flex-col items-center sm:items-start w-full">
      <div {...getRootProps()} className="w-full">
        <input {...getInputProps()} />
        <Button
          type="button"
          variant="ghost" 
          disabled={disabled || isUploading}
          className={`w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 ${
            isDragActive ? 'border-indigo-500 ring-2 ring-indigo-500' : ''
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Upload PDF'}</span>
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
