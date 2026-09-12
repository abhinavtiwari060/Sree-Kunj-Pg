/**
 * ImageKit Upload Service
 * Replaces Firebase Storage for all media uploads.
 * - Never exposes IMAGEKIT_PRIVATE_KEY to client code.
 * - Uses secure serverless signature from /api/imagekit/auth.
 * - Streams upload directly to ImageKit CDN with real-time byte-level progress.
 */

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

export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  filePath: string;
  url: string;
  size: number;
  fileType: string;
  uploadedAt: string;
}

export type StorageFolder =
  | 'hero/video'
  | 'hero/cover'
  | 'testimonials'
  | 'facilities'
  | 'rooms'
  | string;

// --- Validation ---

export function validateVideoFile(
  file: File,
  maxSizeBytes = 100 * 1024 * 1024
): { valid: boolean; error?: string } {
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
    'video/ogg',
  ];
  const allowedExtensions = ['.mp4', '.webm', '.mov', '.mkv', '.ogg'];

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(ext);

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported video format. Allowed: MP4, WebM, MOV. (Selected: ${file.type || ext})`,
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
    const currentMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Video too large (${currentMB} MB). Maximum allowed: ${maxMB} MB.`,
    };
  }

  return { valid: true };
}

export function validateImageFile(
  file: File,
  maxSizeBytes = 10 * 1024 * 1024
): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(ext);

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported image format. Allowed: JPG, PNG, WebP.`,
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
    const currentMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image too large (${currentMB} MB). Maximum allowed: ${maxMB} MB.`,
    };
  }

  return { valid: true };
}

// --- Mime type fallback ---

function resolveMimeType(file: File): string {
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
  return file.type || mimeMap[ext] || 'application/octet-stream';
}

// --- Core upload function ---

/**
 * Uploads a file to ImageKit using a secure server-generated signature.
 * Provides real-time byte-level progress updates and supports user cancellation.
 */
export function uploadToImageKit(
  file: File,
  folder: StorageFolder = 'rooms',
  onProgress?: (info: UploadProgressInfo) => void
): UploadHandle {
  let xhr: XMLHttpRequest | null = null;
  let isCanceled = false;

  const promise = new Promise<string>(async (resolve, reject) => {
    // Step 1: Fetch upload auth params from the secure server endpoint
    let authParams: {
      token: string;
      expire: number;
      signature: string;
      publicKey: string;
      urlEndpoint: string;
    };

    try {
      const authRes = await fetch('/api/imagekit/auth');
      const contentType = authRes.headers.get('content-type') || '';

      if (!authRes.ok) {
        // Avoid calling .json() on HTML error pages (e.g. Netlify 404)
        if (contentType.includes('application/json')) {
          const errData = await authRes.json().catch(() => ({}));
          throw new Error(errData.error || `Auth endpoint returned HTTP ${authRes.status}`);
        }
        throw new Error(
          `Auth endpoint returned HTTP ${authRes.status}. ` +
          `Ensure /api/imagekit/auth is deployed as a server-side function ` +
          `(check netlify.toml / @netlify/plugin-nextjs).`
        );
      }

      if (!contentType.includes('application/json')) {
        const body = await authRes.text();
        throw new Error(
          `Auth endpoint returned non-JSON response (${contentType}). ` +
          `This usually means the Next.js API route is not running server-side on Netlify. ` +
          `Add a netlify.toml with @netlify/plugin-nextjs. Preview: ${body.slice(0, 120)}`
        );
      }

      authParams = await authRes.json();
    } catch (err: any) {
      reject(
        new Error(
          `ImageKit authentication failed: ${err.message || 'Could not reach /api/imagekit/auth'}`
        )
      );
      return;
    }

    if (isCanceled) {
      reject(new Error('Upload was cancelled.'));
      return;
    }

    const { token, expire, signature, publicKey, urlEndpoint } = authParams;

    if (!publicKey || !signature) {
      reject(
        new Error(
          'ImageKit credentials are not configured. Add IMAGEKIT_PRIVATE_KEY and NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY to your environment variables.'
        )
      );
      return;
    }

    // Step 2: Build FormData for ImageKit upload
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('folder', `/${folder}`);
    formData.append('publicKey', publicKey);
    formData.append('signature', signature);
    formData.append('expire', String(expire));
    formData.append('token', token);
    // Apply performance-friendly response fields
    formData.append('responseFields', 'fileId,name,url,filePath,size,fileType');

    // Step 3: Upload via XHR for real-time progress
    xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');

    xhr.upload.onprogress = (event) => {
      if (isCanceled || !event.lengthComputable) return;
      const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
      const transferredMB = (event.loaded / (1024 * 1024)).toFixed(1);
      const totalMB = (event.total / (1024 * 1024)).toFixed(1);

      onProgress?.({
        percent,
        bytesTransferred: event.loaded,
        totalBytes: event.total,
        formattedProgress: `${transferredMB} MB / ${totalMB} MB`,
      });
    };

    xhr.onload = () => {
      if (isCanceled) {
        reject(new Error('Upload was cancelled.'));
        return;
      }

      if (xhr!.status >= 200 && xhr!.status < 300) {
        try {
          const result: ImageKitUploadResult = {
            ...JSON.parse(xhr!.responseText),
            uploadedAt: new Date().toISOString(),
          };

          // Report 100% completion
          onProgress?.({
            percent: 100,
            bytesTransferred: file.size,
            totalBytes: file.size,
            formattedProgress: `${(file.size / (1024 * 1024)).toFixed(1)} MB / ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          });

          resolve(result.url);
        } catch {
          reject(new Error('ImageKit returned an invalid response.'));
        }
      } else {
        let errorMsg = `Upload failed (HTTP ${xhr!.status})`;
        try {
          const body = JSON.parse(xhr!.responseText);
          errorMsg = body.message || body.error || errorMsg;
        } catch {
          // ignore parse error
        }

        // Friendly messages for common errors
        if (xhr!.status === 401) {
          errorMsg =
            'ImageKit authentication failed. Check IMAGEKIT_PRIVATE_KEY and public key configuration.';
        } else if (xhr!.status === 413) {
          errorMsg = 'File is too large for ImageKit. Reduce the file size and try again.';
        } else if (xhr!.status === 0) {
          errorMsg = 'Network error: Could not reach ImageKit. Check your internet connection.';
        }

        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          'Network error during upload. Please check your internet connection and try again.'
        )
      );
    };

    xhr.onabort = () => {
      reject(new Error('Upload was cancelled.'));
    };

    xhr.send(formData);
  });

  return {
    promise,
    cancel: () => {
      isCanceled = true;
      try {
        xhr?.abort();
      } catch {
        // ignore
      }
    },
    // ImageKit direct XHR does not support pause/resume natively; return false
    pause: () => false,
    resume: () => false,
  };
}

/**
 * Backward-compatible wrapper — returns just the URL string.
 */
export async function uploadMediaToImageKit(
  file: File,
  folder: StorageFolder = 'rooms',
  onProgress?: (percent: number) => void
): Promise<string> {
  const handle = uploadToImageKit(file, folder, (info) => {
    onProgress?.(info.percent);
  });
  return handle.promise;
}

// Re-export aliases used by existing components
export const uploadMediaWithProgress = uploadToImageKit;
export const uploadMediaToFirebase = uploadMediaToImageKit;

/**
 * Build an optimised ImageKit CDN URL with transformations.
 * Falls back to the raw URL if no endpoint is configured.
 * NOTE: Never strips audio tracks (preserves full audio stream).
 */
export function buildImageKitUrl(
  filePath: string,
  transforms?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string {
  const urlEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, '') || '';

  if (!urlEndpoint || filePath.startsWith('http')) {
    return filePath;
  }

  const parts: string[] = [];
  if (transforms?.width) parts.push(`w-${transforms.width}`);
  if (transforms?.height) parts.push(`h-${transforms.height}`);
  if (transforms?.quality) parts.push(`q-${transforms.quality}`);
  if (transforms?.format) parts.push(`f-${transforms.format}`);

  const trStr = parts.length ? `tr:${parts.join(',')}/` : '';
  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${urlEndpoint}/${trStr}${cleanPath.slice(1)}`;
}

/**
 * Resolves an optimal video poster/cover image:
 * 1. Returns customPosterUrl if provided and non-empty.
 * 2. If videoUrl is an ImageKit URL, automatically extracts a high-quality video frame via /ik-thumbnail.jpg.
 * 3. Falls back to a clean default campus cover image.
 */
export function getImageKitVideoThumbnail(
  videoUrl?: string,
  customPosterUrl?: string,
  fallbackUrl: string = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=75'
): string {
  if (customPosterUrl && customPosterUrl.trim().length > 0) {
    return customPosterUrl.trim();
  }

  if (!videoUrl || !videoUrl.trim()) {
    return fallbackUrl;
  }

  const cleanVideoUrl = videoUrl.trim();

  // If this is an ImageKit video URL (ik.imagekit.io), generate thumbnail frame via /ik-thumbnail.jpg
  if (cleanVideoUrl.includes('ik.imagekit.io')) {
    try {
      if (
        /\.(jpg|jpeg|png|webp|avif)$/i.test(cleanVideoUrl) ||
        cleanVideoUrl.endsWith('/ik-thumbnail.jpg')
      ) {
        return cleanVideoUrl;
      }
      return `${cleanVideoUrl.replace(/\/$/, '')}/ik-thumbnail.jpg`;
    } catch {
      // fallback on error
    }
  }

  return fallbackUrl;
}


