import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { FilePreview } from './FilePreview';
import { UploadProgress } from './UploadProgress';
import { useUpload } from '../hooks/useUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { UploadResponse } from '../types/upload';

export interface UploadCardProps {
  onUploadSuccess?: (data: UploadResponse) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { 
    mutate: uploadFile, 
    isPending, 
    isSuccess, 
    error, 
    progress,
    reset 
  } = useUpload();

  const handleFileSelect = (file: File) => {
    setLocalError(null);
    setSelectedFile(file);
    reset(); // Reset previous upload states
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setLocalError(null);
    reset();
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile(selectedFile, {
        onSuccess: (data) => {
          onUploadSuccess?.(data);
        }
      });
    }
  };

  const displayError = localError || (error?.response?.data?.detail || error?.message) || null;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Upload Timetable</h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload your schedule file to get started with extraction.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <UploadZone 
                onFileSelect={handleFileSelect} 
                onError={(err) => setLocalError(err)} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <FilePreview 
                file={selectedFile} 
                onRemove={handleRemove} 
                disabled={isPending || isSuccess}
              />
              
              {isPending && <UploadProgress progress={progress} />}
              
              {isSuccess && (
                <div className="flex items-center p-4 bg-emerald-50 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm font-semibold">Upload complete</p>
                    <p className="text-xs opacity-90">Your file is ready for processing.</p>
                  </div>
                </div>
              )}
              
              {!isPending && !isSuccess && (
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all flex items-center"
                  >
                    Start Upload
                  </button>
                </div>
              )}
              
              {isPending && (
                 <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-lg cursor-not-allowed flex items-center"
                    >
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </button>
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {(displayError) && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {displayError}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
