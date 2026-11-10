import type { NextApiRequest } from "next";

/**
 * Helpers for calling the doodleai API from the Next.js API routes.
 *
 * Authentication is an OIDC token that Vercel issues to this function
 * (`x-vercel-oidc-token` header). The backend verifies it against Vercel's
 * public keys, so no shared secret has to be stored or rotated.
 */

/** Base URL of the doodleai API, or undefined when it is not configured. */
export function getUpstreamUrl(): string | undefined {
  return process.env.AI_APP_ENDPOINT || undefined;
}

/** The Vercel OIDC token for the current request, if there is one. */
export function getOidcToken(req: NextApiRequest): string | undefined {
  const header = req.headers["x-vercel-oidc-token"];
  const fromHeader = Array.isArray(header) ? header[0] : header;
  if (fromHeader) return fromHeader;

  // `vercel env pull` writes VERCEL_OIDC_TOKEN for local development. On Vercel
  // the header is the source of truth (the env var there is a stale build token).
  if (!process.env.VERCEL) return process.env.VERCEL_OIDC_TOKEN || undefined;
  return undefined;
}

/**
 * Headers that authenticate a request to the doodleai API, or null when no
 * OIDC token is available (the backend would refuse the request anyway).
 */
export function upstreamAuthHeaders(
  req: NextApiRequest
): Record<string, string> | null {
  const token = getOidcToken(req);
  return token ? { Authorization: `Bearer ${token}` } : null;
}
