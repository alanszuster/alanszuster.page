/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/get_classes";

type Reply = { code: number; body: unknown; headers: Record<string, string> };

function call(method = "GET"): Promise<Reply> {
  const req = {
    method,
    headers: { "x-vercel-oidc-token": "jwt.value" },
  } as unknown as NextApiRequest;
  return new Promise((resolve) => {
    const reply: Reply = { code: 0, body: undefined, headers: {} };
    const res = {
      setHeader: (key: string, value: string) => {
        reply.headers[key] = value;
      },
      status: (code: number) => {
        reply.code = code;
        return res;
      },
      json: (payload: unknown) => {
        reply.body = payload;
        resolve(reply);
        return res;
      },
    } as unknown as NextApiResponse;
    handler(req, res);
  });
}

describe("/api/get_classes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.AI_APP_ENDPOINT = "https://api.example";
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("lets the edge cache a good answer, so visitors do not each hit the API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ classes: ["cat", "dog"], total_classes: 2 }),
    }) as unknown as typeof fetch;

    const reply = await call();

    expect(reply.code).toBe(200);
    expect(reply.headers["Cache-Control"]).toContain("s-maxage=3600");
  });

  it("never caches an error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({ error: "Too Many Requests" }),
    }) as unknown as typeof fetch;

    const reply = await call();

    expect(reply.code).toBe(429);
    expect(reply.headers["Cache-Control"]).toBeUndefined();
  });

  it("only answers GET", async () => {
    expect((await call("POST")).code).toBe(405);
  });
});
