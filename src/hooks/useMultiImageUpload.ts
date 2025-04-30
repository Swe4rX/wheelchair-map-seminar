import { useState, useCallback, useRef } from 'react';

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
  
  // Use refs to track mounted state and prevent memory leaks
  const isMounted = useRef(true);
  
  // Clear refs on unmount
  useCallback(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const invalidFile = selectedFiles.find(file => 
      !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
    );
    
    if (invalidFile) {
      setError(`Invalid file: ${invalidFile.name}. Please use images under 5MB.`);
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setError(null);
  }, [files.length, maxImages]);
  
  const removeImage = useCallback((index: number) => {
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, [previews]);
  
  const uploadImages = useCallback(async (locationName: string) => {
    if (!files.length) return [];
    
    setUploading(true);
    setError(null);
    
    try {
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
      
      // Handle mixed success/failure results
      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<UploadedImage> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value);
      
      const failures = results
        .filter((result): result is PromiseRejectedResult => 
          result.status === 'rejected'
        );
      
      if (failures.length > 0) {
        setError(`${failures.length} of ${results.length} uploads failed`);
      }

      if (isMounted.current) {
        setUploadedImages(successfulUploads);
      }
      
      return successfulUploads;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
      return [];
    } finally {
      if (isMounted.current) {
        setUploading(false);
      }
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
    files,
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