import React, { useEffect, useState } from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, disabled }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const isImage = file.type.startsWith('image/');

  useEffect(() => {
    if (isImage) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file, isImage]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100 overflow-hidden mr-4">
        {isImage && previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : isImage ? (
          <ImageIcon className="w-6 h-6 text-slate-400" />
        ) : (
          <FileText className="w-6 h-6 text-slate-400" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-sm font-medium text-slate-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-slate-500">
          {formatSize(file.size)}
        </p>
      </div>

      {!disabled && (
        <button
          onClick={onRemove}
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
