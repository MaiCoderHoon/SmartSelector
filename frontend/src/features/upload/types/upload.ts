export interface UploadResponse {
  success: boolean;
  filename: string;
  size: number;
  content_type: string;
  message: string;
}

export interface UploadError {
  detail: string;
}
