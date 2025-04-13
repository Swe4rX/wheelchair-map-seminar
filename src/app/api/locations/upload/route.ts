import { NextRequest as req, NextResponse as res } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { validateLocationData, createErrorResponse, LocationData } from "@/utils/validation";

// Helper to delete Cloudinary images
async function deleteCloudinaryImages(images: { publicId?: string }[]) {
  const deletePromises = images
    .filter(img => img.publicId)
    .map(img => cloudinary.uploader.destroy(img.publicId!));
  
  return Promise.allSettled(deletePromises);
}

export async function POST(request: req) {
  try {
    const data = await request.json() as LocationData;
    
    // Validate request data
    const validationError = validateLocationData(data, true); // Require images for creation
    if (validationError) {
      // Clean up any uploaded images
      await deleteCloudinaryImages(data.images || []);
      return createErrorResponse(validationError, 400);
    }
    
    // Check for duplicate location
    const existingLocation = await prisma.location.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive' // Case-insensitive comparison
        }
      }
    });
    
    if (existingLocation) {
      // Delete uploaded images
      await deleteCloudinaryImages(data.images || []);
      return createErrorResponse(`A location named "${data.name}" already exists`, 409);
    }
    
    // Create slug for ID
    const timestamp = new Date().getTime();
    const slugName = data.name!.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const id = `${slugName}_${timestamp}`;
    
    // Create location with connected images in a transaction
    const location = await prisma.location.create({
      data: {
        id,
        name: data.name!,
        description: data.description!,
        latitude: data.latitude!,
        longitude: data.longitude!,
        rating: data.rating || 0,
        images: {
          create: data.images!.map(img => ({
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