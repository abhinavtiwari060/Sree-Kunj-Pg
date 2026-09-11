import { initializeApp, getApps, getApp } from 'firebase/app';

/**
 * Firebase App initialisation.
 * Firebase Storage has been replaced by ImageKit — see src/lib/imagekit.ts.
 * This module is kept ONLY to preserve Firebase App instance
 * for future Firebase Auth / Firestore usage.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCkjMctMwFMolIvGyWlmGUll3hws_UW8f4',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'shreekung-376a7.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'shreekung-376a7',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'shreekung-376a7.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '642062794637',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:642062794637:web:4855ac290ef7bcb5bc87c4',
};

// Initialise Firebase app (singleton safe for Next.js hot-reload)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ---------------------------------------------------------------------------
// Firebase Storage has been REMOVED.
// All media uploads (videos, images, hero, testimonials, rooms) are now
// handled by ImageKit via src/lib/imagekit.ts.
// ---------------------------------------------------------------------------

// Re-export everything from imagekit.ts so that existing import paths
// `import { uploadMediaWithProgress, ... } from '@/lib/firebase'` continue
// to work without changing every consumer file.
export {
  validateVideoFile,
  validateImageFile,
  uploadToImageKit,
  uploadMediaWithProgress,
  uploadMediaToFirebase,
  uploadMediaToImageKit,
  buildImageKitUrl,
  type UploadProgressInfo,
  type UploadHandle,
  type StorageFolder,
  type ImageKitUploadResult,
} from '@/lib/imagekit';
