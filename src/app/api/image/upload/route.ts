import { NextRequest as req, NextResponse as res } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request: req) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return res.json({ error: "No file uploaded" }, { status: 400 });
    }
	//TODO: Check file type and size

    // Save file to temp location
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = join(tmpdir(), uuidv4() + file.name);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const apiResponse = await cloudinary.uploader.upload(tempPath, {
		upload_preset: "locations",
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
    //console.log("Cloudinary response:", apiResponse);

    try {
      await unlink(tempPath);
    } catch (cleanupError) {
      console.warn("Failed to delete temp file:", cleanupError);
    }

    return res.json({ url: apiResponse.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
