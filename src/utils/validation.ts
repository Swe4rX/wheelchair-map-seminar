export interface LocationData {
  id?: string;
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  images?: Array<{
    url: string;
    publicId: string;
    assetId: string;
  }>;
}

/**
 * Validates location data for creation and updates
 * @param data The location data to validate
 * @param requireImages Whether to require at least one image (true for creation, false for updates)
 * @returns Error message string or null if valid
 */
export function validateLocationData(data: LocationData, requireImages = true): string | null {
  // Required fields check
  if (!data.name?.trim()) return "Name is required";
  if (!data.description?.trim()) return "Description is required";
  
  // Latitude validation
  if (data.latitude === undefined || data.latitude === null) {
    return "Latitude is required";
  }
  
  if (typeof data.latitude !== 'number' || isNaN(data.latitude) || 
      data.latitude < -90 || data.latitude > 90) {
    return "Invalid latitude (must be between -90 and 90)";
  }
  
  // Longitude validation
  if (data.longitude === undefined || data.longitude === null) {
    return "Longitude is required";
  }
  
  if (typeof data.longitude !== 'number' || isNaN(data.longitude) || 
      data.longitude < -180 || data.longitude > 180) {
    return "Invalid longitude (must be between -180 and 180)";
  }
  
  // Rating validation
  if (data.rating !== undefined && (
      typeof data.rating !== 'number' || 
      isNaN(data.rating) || 
      data.rating < 0 || 
      data.rating > 5
    )) {
    return "Invalid rating (must be between 0 and 5)";
  }
  
  // Images validation (only if required)
  if (requireImages && (!data.images || data.images.length === 0)) {
    return "At least one image is required";
  }
  
  return null; // No errors
}

/**
 * Helper for creating error responses
 */
export function createErrorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}