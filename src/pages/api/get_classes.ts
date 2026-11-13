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
    const response = await fetch(`${apiUrl}/classes`, {
      method: "GET",
      headers: authHeaders,
      signal: AbortSignal.timeout(8000),
    });

    const data = await response.json();
    // The class list only changes with a new model: let the edge answer for an hour, so
    // visitors do not each cost the API a request (the API's budget is shared by everyone).
    if (response.ok) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=86400"
      );
    }
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in /api/get_classes:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Internal server error" });
  }
}
