import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import formidable from "formidable";
import { promises as fs } from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log(req.headers);
  console.log(req.body);

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      await fs.readFile(file.filepath);
      const apiResponse = await cloudinary.uploader.upload(file.filepath, {
        upload_preset: "locations",
      });
      await fs.unlink(file.filepath);
      res.status(200).json({ url: apiResponse.secure_url });
    } catch (error: unknown) {
      console.error("Error uploading image to Cloudinary:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
}
