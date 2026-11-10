import type { NextApiRequest, NextApiResponse } from "next";
import { getUpstreamUrl, upstreamAuthHeaders } from "../../server/upstream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // /health is public on the backend, so no credentials are sent.
  const apiUrl = getUpstreamUrl();

  if (!apiUrl) {
    return res.status(500).json({ error: "API configuration missing" });
  }

  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: "GET",
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in /api/health:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Internal server error" });
  }
}
