import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const locations = await prisma.location.findMany();
    res.status(200).json(locations);
    console.log("Fetched locations from the database:", locations);
  } catch (error: unknown) {
    console.error("Error fetching locations from the database:", error);
    res.status(500).json({
      error: "Failed to fetch locations",
      details: (error as Error).message,
    });
  }
}
