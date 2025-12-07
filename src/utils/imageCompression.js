import imageCompression from 'browser-image-compression';

/**
 * Compress an image file for storage
 * @param {File} file - Image file from camera/file input
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.2, // Target max 200KB
    maxWidthOrHeight: 800, // Max dimension 800px
    useWebWorker: true, // Use web worker for better performance
    fileType: 'image/jpeg', // Convert to JPEG for better compression
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    return compressedBlob;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Convert a blob to a data URL for display in <img> tags
 * @param {Blob} blob - Image blob
 * @returns {Promise<string>} Data URL
 */
export function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Validate that a file is an image
 * @param {File} file - File to validate
 * @returns {boolean} True if file is an image
 */
export function isValidImage(file) {
  return file && file.type.startsWith('image/');
}
