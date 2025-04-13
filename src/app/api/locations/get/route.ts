import { NextResponse as res} from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const locations = await prisma.location.findMany({
			include: {
			  images: true
			}
		  });
		return res.json(locations);
	} catch (error) {
		console.error("Error fetching locations:", error);
		return res.json(
			{
				error: "Failed to fetch locations",
				details: (error as Error).message
			},
			{ status: 500 }
		);
	}
}