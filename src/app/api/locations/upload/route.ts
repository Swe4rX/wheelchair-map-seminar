import { NextRequest as req, NextResponse as res } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { validateLocationData, createErrorResponse, LocationData } from "@/utils/validation";

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;

// Helper to delete Cloudinary images
async function deleteCloudinaryImages(images: { publicId?: string }[]) {
  const deletePromises = images
    .filter(img => img.publicId)
    .map(img => cloudinary.uploader.destroy(img.publicId!));
  
  return Promise.allSettled(deletePromises);
}

export async function POST(request: req) {
  try {
    const data = await request.json() as LocationData & { password?: string };
    
    // Check for password
    if (!data.password) {
      // Clean up any uploaded images if password is missing
      await deleteCloudinaryImages(data.images || []);
      return createErrorResponse("Admin password is required", 401);
    }
    
    // Validate password
    if (data.password !== UPLOAD_PASSWORD) {
      // Clean up any uploaded images if password is incorrect
      await deleteCloudinaryImages(data.images || []);
      return createErrorResponse("Invalid password", 403);
    }
    
    // Remove password from data before further processing
    const { password, ...locationData } = data;
    
    // Validate request data
    const validationError = validateLocationData(locationData, true); // Require images for creation
    if (validationError) {
      // Clean up any uploaded images
      await deleteCloudinaryImages(locationData.images || []);
      return createErrorResponse(validationError, 400);
    }
    
    // Check for duplicate location
    const existingLocation = await prisma.location.findFirst({
      where: {
        name: {
          equals: locationData.name,
          mode: 'insensitive' // Case-insensitive comparison
        }
      }
    });
    
    if (existingLocation) {
      // Delete uploaded images
      await deleteCloudinaryImages(locationData.images || []);
      return createErrorResponse(`A location named "${locationData.name}" already exists`, 409);
    }
    
    // Create slug for ID
    const timestamp = new Date().getTime();
    const slugName = locationData.name!.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const id = `${slugName}_${timestamp}`;
    
    // Create location with connected images in a transaction
    const location = await prisma.location.create({
      data: {
        id,
        name: locationData.name!,
        description: locationData.description!,
        latitude: locationData.latitude!,
        longitude: locationData.longitude!,
        rating: locationData.rating || 0,
        images: {
          create: locationData.images!.map(img => ({
            url: img.url,
            publicId: img.publicId,
            assetId: img.assetId,
          }))
        }
      },
      include: {
        images: true
      }
    });
    
    return res.json({ success: true, location });
  } catch (error) {
    console.error("Error creating location:", error);
    
    return createErrorResponse(
      error instanceof Error 
        ? `Database error: ${error.message}` 
        : "Failed to create location", 
      500
    );
  }
}