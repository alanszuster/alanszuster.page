import type { NextApiRequest } from "next";

/**
 * Browsers send an Origin header on cross-site and on POST requests. A request
 * that names another site as its origin comes from someone else's page, not from
 * ours. Requests without an Origin (curl, scripts) pass here: this keeps other
 * websites from using the endpoint from their visitors' browsers, nothing more.
 * Bots are handled by the rate limit and BotID.
 */
export function isForeignOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  if (typeof origin !== "string" || origin === "") return false;
  try {
    return new URL(origin).host !== req.headers.host;
  } catch {
    return true;
  }
}
