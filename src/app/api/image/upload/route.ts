import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		
		if (!file) {
			return NextResponse.json(
				{ error: "No file uploaded" },
				{ status: 400 }
			);
		}
		
		// Save file to temp location
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const tempPath = join("/tmp", uuidv4() + file.name);
		await writeFile(tempPath, buffer);
		
		// Upload to Cloudinary
		const apiResponse = await cloudinary.uploader.upload(tempPath, {
			upload_preset: "locations",
		});
		
		return NextResponse.json({ url: apiResponse.secure_url });
	} catch (error) {
		console.error("Error uploading image:", error);
		return NextResponse.json(
			{ error: "Failed to upload image" },
			{ status: 500 }
		);
	}
}