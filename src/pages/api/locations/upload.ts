import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Location } from "@prisma/client";

type LocationRequestBody = {
  name: string;
  description: string;
  imageUrl?: string;
  latitude: number | string;
  longitude: number | string;
  rating?: number | string;
  category?: string;
};

type ResponseData = {
  success?: boolean;
  location?: Location;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      description,
      imageUrl,
      latitude,
      longitude,
      rating,
      category,
    } = req.body as LocationRequestBody;

    if (!name || !description || !latitude || !longitude) {
      return res.status(400).json({
        error:
          "Missing required fields: name, description, latitude, and longitude are required",
      });
    }

    const parsedLatitude =
      typeof latitude === "string" ? parseFloat(latitude) : latitude;
    const parsedLongitude =
      typeof longitude === "string" ? parseFloat(longitude) : longitude;
    const parsedRating = rating
      ? typeof rating === "string"
        ? parseFloat(rating)
        : rating
      : 0;

    if (isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90) {
      return res
        .status(400)
        .json({ error: "Invalid latitude. Must be between -90 and 90." });
    }

    if (
      isNaN(parsedLongitude) ||
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {
      return res
        .status(400)
        .json({ error: "Invalid longitude. Must be between -180 and 180." });
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

    return res.status(201).json({ success: true, location });
  } catch (error: unknown) {
    console.error("Error creating database entry:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return res
          .status(409)
          .json({ error: "A location with this ID already exists" });
      }
      return res
        .status(500)
        .json({ error: `Database error: ${error.message}` });
    }

    return res.status(500).json({ error: "Failed to create database entry" });
  }
}
