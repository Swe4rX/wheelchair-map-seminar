import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const locationName = formData.get("locationName") as string | null;
    
    if (!file) {
      return createErrorResponse("No file uploaded");
    }
    
    if (!locationName) {
      return createErrorResponse("Location name is required");
    }

    const folderName = `locations/${locationName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    
    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tmpdir(), `${uuidv4()}-${file.name}`);
    
    try {
      await writeFile(tempPath, buffer);
      
      // Upload to Cloudinary with optimized settings
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: folderName,
        resource_type: "image",
        transformation: [
          {
            width: 800,
            height: 600,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto"
          }
        ]
      });
      
      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
        assetId: result.asset_id
      });
    } catch (uploadError) {
      console.error("Error processing image:", uploadError);
      return createErrorResponse("Failed to process image", 500);
    } finally {
      // Clean up temp file (in a non-blocking way)
      unlink(tempPath).catch(err => console.error("Failed to remove temp file:", err));
    }
  } catch (error) {
    console.error("Error handling image upload request:", error);
    return createErrorResponse("Failed to upload image", 500);
  }
}
