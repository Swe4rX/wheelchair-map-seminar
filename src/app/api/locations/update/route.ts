import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			id,
			name,
			description,
			imageUrl,
			latitude,
			longitude,
			rating,
		} = body;
		
		if (!id || !name || !description || !latitude || !longitude) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}
		
		// Validate data
		if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
			return NextResponse.json(
				{ error: "Invalid latitude. Must be between -90 and 90." },
				{ status: 400 }
			);
		}
		
		if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
			return NextResponse.json(
				{ error: "Invalid longitude. Must be between -180 and 180." },
				{ status: 400 }
			);
		}
		
		if (typeof rating !== 'number' || rating < 0 || rating > 5) {
			return NextResponse.json(
				{ error: "Invalid rating. Must be between 0 and 5." },
				{ status: 400 }
			);
		}
		
		const updatedLocation = await prisma.location.update({
			where: { id },
			data: {
				name,
				description,
				imageUrl,
				latitude,
				longitude,
				rating,
			},
		});
		
		return NextResponse.json({
			success: true,
			location: updatedLocation
		});
	} catch (error) {
		console.error("Error updating location:", error);
		
		if (error instanceof Error) {
			if (error.message.includes("Record to update not found")) {
				return NextResponse.json(
					{ error: "Location not found" },
					{ status: 404 }
				);
			}
			return NextResponse.json(
				{ error: `Database error: ${error.message}` },
				{ status: 500 }
			);
		}
		
		return NextResponse.json(
			{ error: "Failed to update location" },
			{ status: 500 }
		);
	}
}