import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../api/uploadApi';
import type { UploadResponse } from '../types/upload';
import { useState } from 'react';
import type { AxiosError } from 'axios';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation<UploadResponse, AxiosError<{ detail: string }>, File[]>({
    mutationFn: (files: File[]) => uploadFile(files, setProgress),
    onSettled: () => {
      // Keep progress at 100 for a moment before clearing if needed,
      // but typically we let the component handle resetting.
    }
  });

  return {
    ...mutation,
    progress,
    resetProgress: () => setProgress(0)
  };
};
