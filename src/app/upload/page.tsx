"use client";

import { useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define location data type for better type safety
interface LocationFormData {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  rating: string;
}

// Initial form state
const initialFormState: LocationFormData = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  rating: "5",
};

export default function UploadPage() {
  const [locationData, setLocationData] = useState<LocationFormData>(initialFormState);
  const [status, setStatus] = useState<{
    error?: string;
    success?: string;
    isSubmitting: boolean;
  }>({ isSubmitting: false });
  
  // Use the image upload hook
  const { 
    preview, 
    uploading, 
    error: uploadError, 
    url, 
    handleImageChange, 
    handleUpload 
  } = useImageUpload();
  
  // Handler for form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocationData(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate form data
  const validateForm = () => {
    if (!locationData.name || !locationData.description || 
        !locationData.latitude || !locationData.longitude) {
      return "Bitte alle Pflichtfelder ausfüllen";
    }
    
    if (!url && !uploading) {
      return "Bitte ein Bild hochladen";
    }
    
    return null; // No validation errors
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setStatus({ isSubmitting: false });
    
    // If no image is uploaded yet, start the upload
    if (!url && !uploading && preview) {
      try {
        await handleUpload();
        return; // The component will re-render with the URL
      } catch {
        setStatus({ 
          error: "Fehler beim Hochladen des Bildes", 
          isSubmitting: false 
        });
        return;
      }
    }
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setStatus({ error: validationError, isSubmitting: false });
      return;
    }
    
    // Submit form
    setStatus({ isSubmitting: true });
    
    try {
      const response = await fetch("/api/locations/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...locationData,
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude),
          rating: parseInt(locationData.rating, 10),
          imageUrl: url
        })
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Fehler beim Erstellen des Ortes");
      }
  
      setStatus({ 
        success: "Ort erfolgreich hinzugefügt!", 
        isSubmitting: false 
      });
      
      // Reset form after successful submission
      setLocationData(initialFormState);
      
    } catch (err) {
      setStatus({ 
        error: err instanceof Error ? err.message : "Ein Fehler ist aufgetreten", 
        isSubmitting: false 
      });
    }
  };
  
  // Determine button state
  const isSubmitDisabled = status.isSubmitting || uploading || !url || !locationData.name;
  
  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Neuen Ort hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Location Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Ortsname*
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={locationData.name}
                onChange={handleInputChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Sommerberg"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Beschreibung*
              </label>
              <textarea
                id="description"
                name="description"
                value={locationData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Beschreiben Sie diesen Ort..."
              />
            </div>
            
            {/* Coordinates (grouped for cleaner layout) */}
            <div className="mb-4 flex flex-wrap -mx-2">
              <div className="w-1/2 px-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                  Breitengrad*
                </label>
                <input
                  id="latitude"
                  type="number"
                  name="latitude"
                  step="any"
                  value={locationData.latitude}
                  onChange={handleInputChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="48.7505"
                />
              </div>
              <div className="w-1/2 px-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                  Längengrad*
                </label>
                <input
                  id="longitude"
                  type="number"
                  name="longitude"
                  step="any"
                  value={locationData.longitude}
                  onChange={handleInputChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="8.5520"
                />
              </div>
            </div>
            
            {/* Rating - changed to select dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                Bewertung*
              </label>
              <select
                id="rating"
                name="rating"
                value={locationData.rating}
                onChange={handleInputChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            
            {/* Image Upload - simplified */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Ortsbild*
              </label>
              <div className="border-dashed border-2 border-gray-300 rounded p-4 mb-2 bg-gray-50 text-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="w-full text-sm cursor-pointer"
                />
                
                {preview && (
                  <div className="mt-3">
                    <img 
                      src={preview} 
                      alt="Vorschau" 
                      className="h-40 mx-auto object-contain rounded"
                    />
                  </div>
                )}
                
                <button 
                  type="button" 
                  onClick={handleUpload} 
                  disabled={uploading || !preview || !!url} 
                  className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                >
                  {uploading ? "Wird hochgeladen..." : url ? "Hochgeladen ✓" : "Bild hochladen"}
                </button>
              </div>
              {uploadError && <p className="text-red-500 text-xs italic">{uploadError}</p>}
              {url && <p className="text-green-500 text-xs italic">Bild erfolgreich hochgeladen</p>}
            </div>
            
            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button 
                type="submit" 
                disabled={isSubmitDisabled}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 w-full"
              >
                {status.isSubmitting ? "Ort wird hinzugefügt..." : "Ort hinzufügen"}
              </button>
            </div>
            
            {/* Status Messages */}
            {status.error && (
              <div className="mt-4">
                <p className="text-red-500 text-xs italic">{status.error}</p>
              </div>
            )}
            
            {status.success && (
              <div className="mt-4">
                <p className="text-green-500 text-xs italic">{status.success}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}