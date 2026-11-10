import type { NextApiRequest } from "next";
import {
  getOidcToken,
  getUpstreamUrl,
  upstreamAuthHeaders,
} from "../server/upstream";

const req = (headers: Record<string, string | string[]> = {}) =>
  ({ headers } as unknown as NextApiRequest);

const ENV_KEYS = [
  "AI_APP_ENDPOINT",
  "AI_APP_TOKEN",
  "VERCEL",
  "VERCEL_OIDC_TOKEN",
] as const;

describe("upstream auth helpers", () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    ENV_KEYS.forEach((key) => {
      saved[key] = process.env[key];
      delete process.env[key];
    });
  });

  afterEach(() => {
    ENV_KEYS.forEach((key) => {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    });
  });

  it("returns the endpoint only when it is configured", () => {
    expect(getUpstreamUrl()).toBeUndefined();
    process.env.AI_APP_ENDPOINT = "https://api.example";
    expect(getUpstreamUrl()).toBe("https://api.example");
  });

  it("uses the Vercel OIDC token header as a Bearer token", () => {
    const headers = upstreamAuthHeaders(req({ "x-vercel-oidc-token": "jwt.value" }));
    expect(headers).toEqual({ Authorization: "Bearer jwt.value" });
  });

  it("takes the first value when the header is repeated", () => {
    expect(getOidcToken(req({ "x-vercel-oidc-token": ["first", "second"] }))).toBe("first");
  });

  it("falls back to VERCEL_OIDC_TOKEN only outside Vercel (local development)", () => {
    process.env.VERCEL_OIDC_TOKEN = "local.dev.token";
    expect(getOidcToken(req())).toBe("local.dev.token");

    process.env.VERCEL = "1";
    expect(getOidcToken(req())).toBeUndefined();
  });

  it("prefers the request header over the environment variable", () => {
    process.env.VERCEL_OIDC_TOKEN = "env.token";
    expect(getOidcToken(req({ "x-vercel-oidc-token": "header.token" }))).toBe("header.token");
  });

  it("still sends the legacy key during the transition", () => {
    process.env.AI_APP_TOKEN = "legacy";
    const headers = upstreamAuthHeaders(req({ "x-vercel-oidc-token": "jwt.value" }));
    expect(headers).toEqual({
      Authorization: "Bearer jwt.value",
      "x-api-key": "legacy",
    });
  });

  it("returns null when no credential is available", () => {
    expect(upstreamAuthHeaders(req())).toBeNull();
  });
});
