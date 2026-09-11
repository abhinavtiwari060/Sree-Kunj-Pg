import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
  StorageError,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'girls-pg.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'girls-pg',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'girls-pg.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '437602922888',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:437602922888:web:80954376c3e8db15d3ca3d',
};

// Initialize Firebase only if valid or client-side
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const storage = getStorage(app);

export interface UploadProgressInfo {
  percent: number;
  bytesTransferred: number;
  totalBytes: number;
  formattedProgress: string;
}

export interface UploadHandle {
  promise: Promise<string>;
  cancel: () => void;
  pause: () => boolean;
  resume: () => boolean;
}

export type StorageFolder =
  | 'hero/video'
  | 'hero/cover'
  | 'testimonials'
  | 'facilities'
  | 'rooms'
  | string;

/**
 * Validate video files before upload
 */
export function validateVideoFile(file: File, maxSizeBytes = 100 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/ogg'];
  const allowedExtensions = ['.mp4', '.webm', '.mov', '.mkv', '.ogg'];
  
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(ext);

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported video format. Allowed formats: MP4, WebM, MOV. (Selected: ${file.type || ext})`,
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
    const currentMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Video file is too large (${currentMB} MB). Maximum allowed size is ${maxMB} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Validate image files before upload
 */
export function validateImageFile(file: File, maxSizeBytes = 10 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(ext);

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported image format. Allowed formats: JPG, JPEG, PNG, WebP.`,
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
    const currentMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image file is too large (${currentMB} MB). Maximum allowed size is ${maxMB} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Maps technical Firebase Storage error codes to clear, actionable admin messages.
 */
export function formatFirebaseStorageError(error: any): string {
  if (!error) return 'An unknown error occurred during upload.';
  
  const code = (error as StorageError)?.code || '';
  const message = (error?.message || String(error)).toLowerCase();

  // Check for CORS, 404 preflight, network failures, or unexposed XHR status
  if (
    message.includes('cors') ||
    message.includes('preflight') ||
    message.includes('failed to fetch') ||
    message.includes('err_failed') ||
    message.includes('network error') ||
    (code === 'storage/unknown' && (!error?.serverResponse || error.serverResponse === ''))
  ) {
    const bucket = firebaseConfig.storageBucket;
    return `Firebase Storage CORS / Preflight Error:
Cross-Origin request blocked. Apply cors.json to bucket '${bucket}':
gcloud storage buckets update gs://${bucket} --cors-file=cors.json`;
  }

  if (code === 'storage/bucket-not-found' || message.includes('bucket-not-found') || message.includes('404')) {
    return `Firebase Storage Bucket '${firebaseConfig.storageBucket}' not found (HTTP 404). Please verify that Storage is enabled in Firebase Console and the bucket name in .env.local is correct.`;
  }

  switch (code) {
    case 'storage/unauthorized':
    case 'storage/permission-denied':
      return 'Firebase Storage permission denied. Please verify your Firebase Storage Security Rules allow authorized admin writes.';
    case 'storage/canceled':
      return 'Upload was cancelled by user.';
    case 'storage/quota-exceeded':
      return 'Firebase Storage quota exceeded. Please check your Firebase plan limit.';
    case 'storage/retry-limit-exceeded':
      return 'Network timeout: upload took too long or connection was interrupted. Please check your internet connection and retry.';
    case 'storage/invalid-checksum':
      return 'File corrupted during upload. Please retry.';
    case 'storage/invalid-argument':
      return 'Invalid file argument provided to Firebase Storage.';
    default:
      if (typeof error.message === 'string' && error.message.length > 0) {
        return error.message;
      }
      return 'Upload failed due to network or storage error. Please try again.';
  }
}

/**
 * Uploads media file to Firebase Storage with full real-time progress and cancellation control.
 */
export function uploadMediaWithProgress(
  file: File,
  folder: StorageFolder = 'rooms',
  onProgress?: (info: UploadProgressInfo) => void
): UploadHandle {
  let uploadTask: UploadTask | null = null;
  let isCanceled = false;

  const promise = new Promise<string>((resolve, reject) => {
    // If Firebase config is missing API key, fallback gracefully to data URL
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) {
          onProgress({
            percent: 100,
            bytesTransferred: file.size,
            totalBytes: file.size,
            formattedProgress: `${(file.size / (1024 * 1024)).toFixed(1)} MB / ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          });
        }
        resolve(reader.result as string);
      };
      reader.onerror = () => reject(new Error('Failed to read local file data.'));
      reader.readAsDataURL(file);
      return;
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageRef = ref(storage, `${folder}/${timestamp}_${sanitizedName}`);

    // Ensure proper content type so videos stream inline and play directly in browser
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };
    const resolvedContentType = file.type || mimeMap[ext] || 'application/octet-stream';

    uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: resolvedContentType,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (isCanceled) return;
        const total = snapshot.totalBytes || file.size || 1;
        const transferred = snapshot.bytesTransferred;
        const percent = Math.min(100, Math.round((transferred / total) * 100));

        const transferredMB = (transferred / (1024 * 1024)).toFixed(1);
        const totalMB = (total / (1024 * 1024)).toFixed(1);

        if (onProgress) {
          onProgress({
            percent,
            bytesTransferred: transferred,
            totalBytes: total,
            formattedProgress: `${transferredMB} MB / ${totalMB} MB`,
          });
        }
      },
      (error) => {
        const readableMsg = formatFirebaseStorageError(error);
        reject(new Error(readableMsg));
      },
      async () => {
        if (isCanceled) {
          reject(new Error('Upload was cancelled.'));
          return;
        }
        try {
          if (!uploadTask) {
            throw new Error('Upload task missing ref');
          }
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) {
            onProgress({
              percent: 100,
              bytesTransferred: file.size,
              totalBytes: file.size,
              formattedProgress: `${(file.size / (1024 * 1024)).toFixed(1)} MB / ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            });
          }
          resolve(downloadURL);
        } catch (urlError) {
          reject(new Error(formatFirebaseStorageError(urlError)));
        }
      }
    );
  });

  return {
    promise,
    cancel: () => {
      isCanceled = true;
      if (uploadTask) {
        try {
          uploadTask.cancel();
        } catch (e) {
          console.warn('Failed to cancel upload task:', e);
        }
      }
    },
    pause: () => {
      if (uploadTask) {
        return uploadTask.pause();
      }
      return false;
    },
    resume: () => {
      if (uploadTask) {
        return uploadTask.resume();
      }
      return false;
    },
  };
}

/**
 * Backward compatibility wrapper for standard upload without handle
 */
export async function uploadMediaToFirebase(
  file: File,
  folder: StorageFolder = 'rooms',
  onProgress?: (progress: number) => void
): Promise<string> {
  const handle = uploadMediaWithProgress(file, folder, (info) => {
    if (onProgress) onProgress(info.percent);
  });
  return handle.promise;
}
