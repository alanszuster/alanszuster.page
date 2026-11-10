import type { NextApiRequest, NextApiResponse } from "next";
import { getUpstreamUrl, upstreamAuthHeaders } from "../../server/upstream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiUrl = getUpstreamUrl();
  const authHeaders = upstreamAuthHeaders(req);

  if (!apiUrl || !authHeaders) {
    return res.status(500).json({ error: "API configuration missing" });
  }

  try {
    const response = await fetch(`${apiUrl}/get_random_word`, {
      method: "GET",
      headers: authHeaders,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in /api/get_random_class:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Internal server error" });
  }
}
