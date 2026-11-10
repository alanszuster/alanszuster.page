import type { NextApiRequest, NextApiResponse } from "next";
import { getUpstreamUrl, upstreamAuthHeaders } from "../../server/upstream";

/**
 * What the playground shows as "API Health".
 *
 * This calls the backend's authenticated /status, not the public /health, so
 * "ok" means the whole path works: the API is reachable, our OIDC token is
 * accepted and the model is loaded. (The public /health ignores credentials,
 * so it stayed green even while every real request was rejected.)
 */
export type HealthStatus =
  | "ok"
  | "auth_failed"
  | "model_unavailable"
  | "unreachable"
  | "misconfigured";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const fail = (code: number, status: HealthStatus) => {
    res.setHeader("Cache-Control", "no-store");
    return res.status(code).json({ status });
  };

  const apiUrl = getUpstreamUrl();
  const authHeaders = upstreamAuthHeaders(req);
  if (!apiUrl || !authHeaders) {
    return fail(503, "misconfigured");
  }

  try {
    const response = await fetch(`${apiUrl}/status`, {
      method: "GET",
      headers: authHeaders,
      signal: AbortSignal.timeout(8000),
    });

    if (response.status === 401) return fail(503, "auth_failed");
    if (response.status === 503) return fail(503, "model_unavailable");
    if (!response.ok) return fail(502, "unreachable");

    const data = await response.json();
    if (data?.status !== "ok" || data?.model !== "loaded") {
      return fail(503, "model_unavailable");
    }

    // Healthy answers may be shared for a short while so page loads do not
    // each hit the backend.
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({ status: "ok" satisfies HealthStatus });
  } catch (error) {
    console.error(
      "Error in /api/health:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return fail(503, "unreachable");
  }
}
