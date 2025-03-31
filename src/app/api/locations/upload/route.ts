// noinspection t

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			name,
			description,
			imageUrl,
			latitude,
			longitude,
			rating,
		} = body;
		
		if (!name || !description || !latitude || !longitude) {
			return NextResponse.json(
				{ error: "Missing required fields: name, description, latitude, and longitude are required" },
				{ status: 400 }
			);
		}
		
		const parsedLatitude = typeof latitude === "string" ? parseFloat(latitude) : latitude;
		const parsedLongitude = typeof longitude === "string" ? parseFloat(longitude) : longitude;
		const parsedRating = rating ? (typeof rating === "string" ? parseFloat(rating) : rating) : 0;
		
		if (isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90) {
			return NextResponse.json(
				{ error: "Invalid latitude. Must be between -90 and 90." },
				{ status: 400 }
			);
		}
		
		if (isNaN(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180) {
			return NextResponse.json(
				{ error: "Invalid longitude. Must be between -180 and 180." },
				{ status: 400 }
			);
		}
		
		const timestamp = new Date().getTime();
		const slugName = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
		const id = `${slugName}_${timestamp}`;
		
		const location = await prisma.location.create({
			data: {
				id,
				name,
				description,
				imageUrl: imageUrl || "none",
				latitude: parsedLatitude,
				longitude: parsedLongitude,
				rating: parsedRating,
			},
		});
		
		return NextResponse.json({ success: true, location });
	} catch (error) {
		console.error("Error creating database entry:", error);
		
		if (error instanceof Error) {
			if (error.message.includes("Unique constraint failed")) {
				return NextResponse.json(
					{ error: "A location with this ID already exists" },
					{ status: 409 }
				);
			}
			return NextResponse.json(
				{ error: `Database error: ${error.message}` },
				{ status: 500 }
			);
		}
		
		return NextResponse.json(
			{ error: "Failed to create database entry" },
			{ status: 500 }
		);
	}
}