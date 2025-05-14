"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMultiImageUpload } from "@/hooks/useMultiImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";

interface LocationFormData {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  password: string;
}

export default function UploadPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LocationFormData>({
    defaultValues: {
      name: "",
      description: "",
      latitude: undefined,
      longitude: undefined,
      rating: 5,
      password: ""
    }
  });
  
  const [status, setStatus] = useState<{
    error?: string;
    success?: string;
    isSubmitting: boolean;
  }>({ isSubmitting: false });
  
  const { 
    previews, 
    uploadedImages,
    uploading, 
    error: uploadError, 
    handleImageSelect,
    removeImage,
    uploadImages,
    reset: resetImages
  } = useMultiImageUpload(5);
  
  const onSubmit = useCallback(async (data: LocationFormData) => {
    // Reset status
    setStatus({ isSubmitting: false });
    
    // Upload images first if needed
    if (previews.length > 0 && uploadedImages.length === 0) {
      try {
        await uploadImages(data.name);
        return;
      } catch (err) {
        setStatus({ error: "Image upload failed", isSubmitting: false });
        return;
      }
    }
    
    // Validate image upload
    if (uploadedImages.length == 0) {
      setStatus({ error: "Please upload at least one image", isSubmitting: false });
      return;
    }
    
    setStatus({ isSubmitting: true });
    
    try {
      const response = await fetch("/api/locations/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images: uploadedImages
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create location");
      }
  
      setStatus({ success: "Location added successfully!", isSubmitting: false });
      

      reset();
      resetImages();
      
    } catch (err) {
      setStatus({ 
        error: err instanceof Error ? err.message : "An error occurred", 
        isSubmitting: false 
      });
    }
  }, [previews.length, uploadedImages, uploadImages, reset, resetImages]);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Neuen Ort hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Location Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name*
              </label>
              <input
                id="name"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Sommerberg"
                {...register("name", { required: "Name wird benötigt" })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Beschreibung
              </label>
              <textarea
                id="description"
                rows={4}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Beschreibe den Ort..."
                {...register("description", { required: "Beschreibung wird benötigt" })}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
            
            {/* Coordinates */}
            <div className="mb-4 flex flex-wrap -mx-2">
              <div className="w-1/2 px-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                  Breitengrad
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                  placeholder="48.7505"
                  {...register("latitude", { 
                    required: "Latitude is required",
                    valueAsNumber: true,
                    validate: (value) => 
                      (value >= -90 && value <= 90) || "Invalid latitude (-90 to 90)"
                  })}
                />
                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
              </div>
              <div className="w-1/2 px-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                  Längengrad
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                  placeholder="8.5520"
                  {...register("longitude", { 
                    required: "Longitude is required",
                    valueAsNumber: true,
                    validate: (value) => 
                      (value >= -180 && value <= 180) || "Invalid longitude (-180 to 180)"
                  })}
                />
                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
              </div>
            </div>
            
            {/* Rating */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                Bewertung
              </label>
              <select
                id="rating"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                {...register("rating", { valueAsNumber: true })}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            {/* Password Field - Add this field before the image upload section */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Admin-Passwort*
              </label>
              <input
                id="password"
                type="password"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                placeholder="Passwort eingeben"
                {...register("password", { required: "Admin-Passwort wird benötigt" })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Bilder (max 5)
              </label>
              <div className="border-dashed border-2 border-gray-300 rounded p-4 mb-2 bg-gray-50">
                {/* Upload button */}
                <div className="flex items-center justify-center">
                  <label className={`cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none ${previews.length >= 5 || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect}
                      className="hidden"
                      multiple
                      disabled={previews.length >= 5 || uploading}
                    />
                    <span className="flex items-center">
                      <ImageIcon size={16} className="mr-2" />
                      Select Images
                    </span>
                  </label>
                </div>
                
                {/* Image previews */}
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative bg-gray-100 rounded p-1">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="h-24 w-full object-cover rounded"
                        />
                        {!uploading && (
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                            aria-label="Remove image"
                          >
                            <X size={16} />
                          </button>
                        )}
                        {uploadedImages[index] && (
                          <div className="absolute bottom-1 right-1 bg-green-500 text-white text-xs p-1 rounded">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload button if needed */}
                {previews.length > 0 && uploadedImages.length < previews.length && (
                  <button 
                    type="button" 
                    onClick={() => {
                      const name = document.getElementById('name') as HTMLInputElement;
                      uploadImages(name.value);
                    }}
                    disabled={uploading || previews.length === 0} 
                    className="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 w-full flex items-center justify-center"
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading images...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Upload size={16} className="mr-2" />
                        Upload Images
                      </span>
                    )}
                  </button>
                )}
              </div>
              
              {uploadError && <p className="text-red-500 text-xs italic">{uploadError}</p>}
              {uploadedImages.length > 0 && (
                <p className="text-green-500 text-xs italic">
                  {uploadedImages.length} of {previews.length} images successfully uploaded
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={status.isSubmitting || uploading || (previews.length > 0 && uploadedImages.length === 0)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 w-full"
            >
              {status.isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Location...
                </span>
              ) : "Add Location"}
            </button>
            
            {/* Status Messages */}
            {status.error && (
              <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-red-500 text-sm">{status.error}</p>
              </div>
            )}
            
            {status.success && (
              <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-500 text-sm">{status.success}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}