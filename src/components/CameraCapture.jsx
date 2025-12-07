import { useState } from 'react';
import { compressImage, blobToDataURL, isValidImage } from '../utils/imageCompression';

/**
 * Camera capture component for taking plant photos
 * @param {Function} onPhotoCapture - Callback with compressed blob and preview URL
 */
export default function CameraCapture({ onPhotoCapture }) {
  const [preview, setPreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!isValidImage(file)) {
      alert('Please select a valid image file');
      return;
    }

    try {
      setIsCompressing(true);

      // Compress the image
      const compressedBlob = await compressImage(file);

      // Create preview URL
      const previewURL = await blobToDataURL(compressedBlob);
      setPreview(previewURL);

      // Pass back to parent
      onPhotoCapture?.(compressedBlob, previewURL);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoCapture?.(null, null);
  };

  return (
    <div className="camera-capture">
      {preview ? (
        <div className="photo-preview">
          <img src={preview} alt="Plant preview" />
          <button type="button" onClick={handleRemovePhoto} className="remove-photo-btn">
            Remove Photo
          </button>
        </div>
      ) : (
        <div className="photo-input">
          <label htmlFor="photo-input" className="photo-label">
            {isCompressing ? 'Processing...' : '📷 Take Photo'}
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={isCompressing}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
}
