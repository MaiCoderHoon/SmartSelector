import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming shadcn/ui utils is here

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, onError, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const errorMsg = rejection.errors.map(e => e.message).join(', ');
        onError(errorMsg);
        return;
      }
      
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer overflow-hidden',
        isDragActive
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-6 text-center z-10">
        <div className={cn(
          "p-4 rounded-full mb-4 transition-colors duration-200",
          isDragActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500"
        )}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <p className="mb-2 text-sm text-slate-600 font-medium">
          <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-500">
          CSV, PNG, JPG (max. 10MB)
        </p>
      </div>
      
      {/* Decorative background glow */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300",
        isDragActive && "opacity-100"
      )} />
    </div>
  );
};
