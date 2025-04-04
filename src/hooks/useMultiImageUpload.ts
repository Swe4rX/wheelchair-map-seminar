import { useState, useCallback } from 'react';

export interface UploadedImage {
  url: string;
  publicId: string;
  assetId: string;
}

export function useMultiImageUpload(maxImages = 5) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
    
    // Create and store preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setError(null);
  }, [files.length, maxImages]);
  
  const removeImage = useCallback((index: number) => {
    URL.revokeObjectURL(previews[index]);
    
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, [previews]);
  
  const uploadImages = useCallback(async (locationName: string) => {
    if (!files.length) return [];
    
    setUploading(true);
    setError(null);
    
    try {
      // Create FormData for all files at once
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("locationName", locationName);
        
        const response = await fetch("/api/image/upload", {
          method: "POST",
          body: formData
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Failed to upload image ${index + 1}`);
        }
        
        return await response.json();
      });
      
      // Upload all images in parallel
      const results = await Promise.all(uploadPromises);
      setUploadedImages(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return [];
    } finally {
      setUploading(false);
    }
  }, [files]);
  
  const reset = useCallback(() => {
    previews.forEach(URL.revokeObjectURL);
    setFiles([]);
    setPreviews([]);
    setUploadedImages([]);
    setError(null);
  }, [previews]);
  
  return {
    previews,
    uploadedImages,
    uploading,
    error,
    handleImageSelect,
    removeImage,
    uploadImages,
    reset
  };
}