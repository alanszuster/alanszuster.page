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
 * credential is available.
 */
export function upstreamAuthHeaders(
  req: NextApiRequest
): Record<string, string> | null {
  const headers: Record<string, string> = {};

  const token = getOidcToken(req);
  if (token) headers.Authorization = `Bearer ${token}`;

  // TRANSITION: legacy static key. Delete this block, AI_APP_TOKEN in Vercel
  // and AI_API_KEY on the Space once the backend runs with OIDC only.
  const legacyKey = process.env.AI_APP_TOKEN;
  if (legacyKey) headers["x-api-key"] = legacyKey;

  return Object.keys(headers).length > 0 ? headers : null;
}
