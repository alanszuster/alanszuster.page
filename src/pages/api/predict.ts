import type { NextApiRequest, NextApiResponse } from "next";
import { getUpstreamUrl, upstreamAuthHeaders } from "../../server/upstream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Image data is required" });
  }

  // Only accept a reasonably sized PNG data URL (the page sends ~280x280)
  if (
    typeof image !== "string" ||
    !image.startsWith("data:image/png;base64,") ||
    image.length > 700_000
  ) {
    return res.status(400).json({ error: "Invalid image data" });
  }

  const apiUrl = getUpstreamUrl();
  const authHeaders = upstreamAuthHeaders(req);

  if (!apiUrl || !authHeaders) {
    return res.status(500).json({ error: "API configuration missing" });
  }

  try {
    const response = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ image }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in /api/predict:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Internal server error" });
  }
}
