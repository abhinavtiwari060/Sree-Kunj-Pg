'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Trash2,
  Film,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import {
  uploadMediaWithProgress,
  validateVideoFile,
  validateImageFile,
  UploadHandle,
  StorageFolder,
} from '@/lib/firebase';

export interface MediaUploaderProps {
  mediaType: 'video' | 'image';
  label: string;
  sublabel?: string;
  storageFolder: StorageFolder;
  currentUrl?: string;
  maxSizeBytes?: number; // e.g. 100MB for video, 10MB for image
  onUploadSuccess: (url: string) => void;
  onDelete?: () => void;
  aspectRatio?: 'video' | 'portrait' | 'cover' | 'square';
  placeholderText?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  mediaType,
  label,
  sublabel,
  storageFolder,
  currentUrl = '',
  maxSizeBytes,
  onUploadSuccess,
  onDelete,
  aspectRatio = 'video',
  placeholderText = 'Select or drop a file to upload',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const [status, setStatus] = useState<'idle' | 'selected' | 'uploading' | 'success' | 'error' | 'cancelled'>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressDetails, setProgressDetails] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fileSizeFormatted, setFileSizeFormatted] = useState<string>('');

  const uploadHandleRef = useRef<UploadHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with currentUrl prop if it changes externally
  useEffect(() => {
    if (status === 'idle' || status === 'success') {
      setPreviewUrl(currentUrl);
    }
  }, [currentUrl, status]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      if (uploadHandleRef.current) {
        uploadHandleRef.current.cancel();
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage('');
    
    // Validate file type & size
    const validation =
      mediaType === 'video'
        ? validateVideoFile(file, maxSizeBytes || 100 * 1024 * 1024)
        : validateImageFile(file, maxSizeBytes || 10 * 1024 * 1024);

    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file format or size.');
      setStatus('error');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Prepare preview
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setStatus('selected');
    setProgressPercent(0);
    setProgressDetails('');

    // Format file size
    const mb = (file.size / (1024 * 1024)).toFixed(2);
    setFileSizeFormatted(`${mb} MB`);
  };

  const startUpload = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setProgressPercent(0);
    const totalMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
    setProgressDetails(`0.0 MB / ${totalMB} MB`);
    setErrorMessage('');

    try {
      const handle = uploadMediaWithProgress(
        selectedFile,
        storageFolder,
        (info) => {
          setProgressPercent(info.percent);
          setProgressDetails(info.formattedProgress);
        }
      );

      uploadHandleRef.current = handle;

      const downloadUrl = await handle.promise;
      setStatus('success');
      setProgressPercent(100);
      setPreviewUrl(downloadUrl);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess(downloadUrl);
    } catch (err: any) {
      if (err.message && err.message.includes('cancelled')) {
        setStatus('cancelled');
      } else {
        setStatus('error');
        setErrorMessage(err.message || 'Upload failed. Please try again.');
      }
    } finally {
      uploadHandleRef.current = null;
    }
  };

  const cancelUpload = () => {
    if (uploadHandleRef.current) {
      uploadHandleRef.current.cancel();
      uploadHandleRef.current = null;
    }
    setStatus('cancelled');
    setProgressPercent(0);
  };

  const handleRetry = () => {
    if (selectedFile) {
      startUpload();
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearOrDelete = () => {
    if (uploadHandleRef.current) {
      uploadHandleRef.current.cancel();
      uploadHandleRef.current = null;
    }
    setSelectedFile(null);
    setPreviewUrl('');
    setStatus('idle');
    setProgressPercent(0);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onDelete) onDelete();
  };

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'portrait'
      ? 'aspect-[9/16] max-h-[380px]'
      : aspectRatio === 'cover'
      ? 'aspect-[16/9]'
      : 'aspect-square';

  return (
    <div className="bg-white rounded-2xl border border-pink-200 shadow-xs p-5 space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            {mediaType === 'video' ? (
              <Film className="w-4 h-4 text-pink-600" />
            ) : (
              <ImageIcon className="w-4 h-4 text-pink-600" />
            )}
            <h3 className="font-bold text-slate-900 text-sm">{label}</h3>
          </div>
          {sublabel && <p className="text-[11px] text-slate-500 mt-0.5">{sublabel}</p>}
        </div>

        {/* Status Badge */}
        <div>
          {status === 'uploading' && (
            <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold animate-pulse">
              Uploading {progressPercent}%
            </span>
          )}
          {status === 'success' && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          )}
          {status === 'error' && (
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Error
            </span>
          )}
          {status === 'cancelled' && (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              Cancelled
            </span>
          )}
          {status === 'selected' && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
              Ready to upload
            </span>
          )}
        </div>
      </div>

      {/* Main Preview / Dropzone Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left Preview Box */}
        <div className={`md:col-span-6 w-full ${aspectClass} rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-200 flex items-center justify-center shadow-inner`}>
          {previewUrl ? (
            mediaType === 'video' ? (
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-cover"
                playsInline
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="text-center p-6 text-slate-400 space-y-2">
              {mediaType === 'video' ? (
                <Film className="w-10 h-10 mx-auto text-slate-600" />
              ) : (
                <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
              )}
              <p className="text-xs font-semibold text-slate-400">{placeholderText}</p>
            </div>
          )}

          {/* Active Overlay during upload */}
          {status === 'uploading' && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white space-y-3 z-20">
              <div className="text-2xl font-black text-pink-400">{progressPercent}%</div>
              <div className="w-3/4 bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-pink-500 h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-200">{progressDetails || 'Uploading to Firebase...'}</p>
            </div>
          )}
        </div>

        {/* Right Controls & Info */}
        <div className="md:col-span-6 space-y-3 text-xs">
          
          {/* File input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === 'video' ? 'video/mp4,video/webm,video/quicktime,video/*' : 'image/jpeg,image/png,image/webp,image/*'}
            onChange={handleFileChange}
            className="hidden"
            disabled={status === 'uploading'}
          />

          {/* Selected File Details */}
          {selectedFile && (
            <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-pink-700 font-bold px-2 py-0.5 rounded-full bg-pink-100">
                  {fileSizeFormatted}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Format: {selectedFile.type || 'Custom'} • Target: <code className="text-pink-600">{storageFolder}</code>
              </p>
            </div>
          )}

          {/* Error display */}
          {status === 'error' && errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Upload Failed</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-snug">{errorMessage}</p>
            </div>
          )}

          {/* Cancelled state display */}
          {status === 'cancelled' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-[11px]">
              Upload was cancelled. You can select a different file or retry.
            </div>
          )}

          {/* Progress bar in controls column */}
          {status === 'uploading' && (
            <div className="space-y-1.5 p-3 bg-pink-50 rounded-xl border border-pink-200">
              <div className="flex justify-between items-center text-[11px] font-bold text-pink-900">
                <span>Uploading {mediaType === 'video' ? 'Video' : 'Cover'}...</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-pink-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-600 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {progressDetails && (
                <div className="text-[10px] text-pink-700 text-right font-mono">
                  {progressDetails}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {status !== 'uploading' && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold transition-colors flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4 text-pink-600" />
                <span>{previewUrl ? 'Replace File' : 'Select File'}</span>
              </button>
            )}

            {status === 'selected' && (
              <button
                type="button"
                onClick={startUpload}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md shadow-pink-600/20 transition-all flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Start Upload to Firebase</span>
              </button>
            )}

            {status === 'uploading' && (
              <button
                type="button"
                onClick={cancelUpload}
                className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4 text-rose-600" />
                <span>Cancel Upload</span>
              </button>
            )}

            {status === 'error' && selectedFile && (
              <button
                type="button"
                onClick={handleRetry}
                className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Upload</span>
              </button>
            )}

            {previewUrl && status !== 'uploading' && (
              <button
                type="button"
                onClick={handleClearOrDelete}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold transition-colors flex items-center gap-1.5"
                title="Remove Media"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Current URL indicator */}
          {previewUrl && previewUrl.startsWith('http') && (
            <div className="pt-1">
              <p className="text-[10px] text-slate-400 font-mono truncate" title={previewUrl}>
                URL: {previewUrl}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
