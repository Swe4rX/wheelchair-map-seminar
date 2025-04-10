import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateLocationData, createErrorResponse, LocationData } from "@/utils/validation";

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json() as LocationData;
        
        // ID is required for updates
        if (!data.id) {
            return createErrorResponse("Location ID is required", 400);
        }
        
        // Validate request data (don't require images for updates)
        const validationError = validateLocationData(data, false);
        if (validationError) {
            return createErrorResponse(validationError, 400);
        }

        const updatedLocation = await prisma.location.update({
            where: { id: data.id },
            data: {
                name: data.name!,
                description: data.description!,
                latitude: data.latitude!,
                longitude: data.longitude!,
                rating: data.rating || 0,
                ...(data.images && data.images.length > 0 && {
                    images: {
                        create: data.images.map(img => ({
                            url: img.url,
                            publicId: img.publicId,
                            assetId: img.assetId,
                        }))
                    }
                })
            },
            include: {
                images: true
            }
        });
        
        return NextResponse.json({
            success: true,
            location: updatedLocation
        });
    } catch (error) {
        console.error("Error updating location:", error);
        
        if (error instanceof Error) {
            if (error.message.includes("Record to update not found")) {
                return createErrorResponse("Location not found", 404);
            }
            return createErrorResponse(`Database error: ${error.message}`, 500);
        }
        
        return createErrorResponse("Failed to update location", 500);
    }
}