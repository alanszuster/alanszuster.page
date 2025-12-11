import type { NextApiRequest, NextApiResponse } from "next";

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

  const apiUrl = process.env.AI_APP_ENDPOINT;
  const apiKey = process.env.AI_APP_TOKEN;

  if (!apiUrl || !apiKey) {
    return res.status(500).json({ error: "API configuration missing" });
  }

  try {
    const response = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
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
