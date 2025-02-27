"use client";

import { useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useRouter } from "next/navigation"; 

export default function UploadPage() {
  const router = useRouter();
  const [locationData, setLocationData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    rating: "5.0",
  });
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    preview, 
    uploading, 
    error: uploadError, 
    url, 
    handleImageChange, 
    handleUpload 
  } = useImageUpload();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocationData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    

    if (!locationData.name || !locationData.description || !locationData.latitude || !locationData.longitude) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (!url && !uploading) {
      try {
        await handleUpload();
        return; // The component will re-render with the URL
      } catch (err: any) {
        setFormError(err.message || "Failed to upload image");
        return;
      }
    }
    
    if (!url) {
      setFormError("Please upload an image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/locations/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...locationData,
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude),
          rating: parseFloat(locationData.rating),
          imageUrl: url
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create location");
      }
      
      setFormSuccess("Location added successfully!");
      
      
      //setTimeout(() => {
      //  router.push("/");
      //}, 2000);
      
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Add New Location</h1>
        
        {/* Location Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Location Name*
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
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={locationData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Describe this location..."
          />
        </div>
        
        {/* Coordinates */}
        <div className="mb-4">
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                Latitude*
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
                Longitude*
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
        </div>
        
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rating (0-5)*
          </label>
          <input
            id="rating"
            type="number"
            name="rating"
            min="0"
            max="5"
            step="0.1"
            value={locationData.rating}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location Image*
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
                  alt="Preview" 
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
              {uploading ? "Uploading..." : url ? "Uploaded ✓" : "Upload Image"}
            </button>
          </div>
          {uploadError && <p className="text-red-500 text-xs italic">{uploadError}</p>}
          {url && <p className="text-green-500 text-xs italic">Image uploaded successfully</p>}
        </div>
        
        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <button 
            type="submit" 
            disabled={isSubmitting || uploading || !url || !locationData.name}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 w-full"
          >
            {isSubmitting ? "Adding Location..." : "Add Location"}
          </button>
        </div>
        
        {/* Error Message */}
        {formError && (
          <div className="mt-4">
            <p className="text-red-500 text-xs italic">{formError}</p>
          </div>
        )}
        
        {/* Success Message */}
        {formSuccess && (
          <div className="mt-4">
            <p className="text-green-500 text-xs italic">{formSuccess}</p>
          </div>
        )}
      </form>
    </div>
  );
}