import type { NextApiRequest, NextApiResponse } from "next";
import { checkBotId } from "botid/server";
import { isForeignOrigin } from "../../server/origin";
import { getUpstreamUrl, upstreamAuthHeaders } from "../../server/upstream";

// Shorter than the page's own 60 s patience, so a stuck API answers with a clean error
const UPSTREAM_TIMEOUT_MS = 55_000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (isForeignOrigin(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // BotID (Basic) separates real browsers from scripts. If the check itself cannot run
  // (local development, an outage) the request is let through: the rate limit still applies.
  try {
    const verdict = await checkBotId({
      advancedOptions: { checkLevel: "basic", headers: req.headers },
    });
    if (verdict.isBot && !verdict.isVerifiedBot) {
      return res.status(403).json({ error: "Request blocked" });
    }
  } catch (error) {
    console.error(
      "BotID check unavailable:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  const { image } = req.body ?? {};
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
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error in /api/predict:", error instanceof Error ? error.message : "Unknown error");
    if (error instanceof Error && error.name === "TimeoutError") {
      return res.status(504).json({ error: "The model took too long to respond" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
