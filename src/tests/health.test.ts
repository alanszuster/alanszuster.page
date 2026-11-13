/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/health";

type Reply = { code: number; body: unknown; headers: Record<string, string> };

function call(method = "GET", headers: Record<string, string> = {}): Promise<Reply> {
  const req = { method, headers } as unknown as NextApiRequest;
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
      json: (body: unknown) => {
        reply.body = body;
        resolve(reply);
        return res;
      },
    } as unknown as NextApiResponse;
    handler(req, res);
  });
}

const upstream = (status: number, body: unknown = {}) =>
  jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });

describe("/api/health", () => {
  const originalFetch = global.fetch;
  const env = { ...process.env };

  beforeEach(() => {
    process.env.AI_APP_ENDPOINT = "https://api.example";
    delete process.env.VERCEL;
    delete process.env.VERCEL_OIDC_TOKEN;
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  const withToken = { "x-vercel-oidc-token": "jwt.value" };

  it("is ok only when the authenticated /status answers ok and the model is loaded", async () => {
    const fetchMock = upstream(200, { status: "ok", model: "loaded", classes: 120 });
    global.fetch = fetchMock as unknown as typeof fetch;

    const reply = await call("GET", withToken);

    expect(reply.code).toBe(200);
    expect(reply.body).toEqual({ status: "ok" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example/status");
    expect(init.headers).toEqual({ Authorization: "Bearer jwt.value" });
    expect(reply.headers["Cache-Control"]).toContain("s-maxage");
  });

  it("passes the API's release version on, but only as a short plain token", async () => {
    for (const [sent, shown] of [
      ["1.0.6", "1.0.6"],
      ["dev", "dev"],
      ["<script>alert(1)</script>", undefined],
      ["x".repeat(40), undefined],
      [{ nested: true }, undefined],
    ] as const) {
      global.fetch = upstream(200, {
        status: "ok",
        model: "loaded",
        version: sent,
      }) as unknown as typeof fetch;
      const reply = await call("GET", withToken);
      expect(reply.code).toBe(200);
      expect(reply.body).toEqual(shown ? { status: "ok", version: shown } : { status: "ok" });
    }
  });

  it("reports an authentication failure instead of looking healthy", async () => {
    global.fetch = upstream(401, { error: "Unauthorized" }) as unknown as typeof fetch;
    const reply = await call("GET", withToken);
    expect(reply.code).toBe(503);
    expect(reply.body).toEqual({ status: "auth_failed" });
    expect(reply.headers["Cache-Control"]).toBe("no-store");
  });

  it("reports an unloaded model", async () => {
    global.fetch = upstream(503, { status: "unavailable" }) as unknown as typeof fetch;
    const reply = await call("GET", withToken);
    expect(reply.body).toEqual({ status: "model_unavailable" });
  });

  it("does not trust a 200 that does not say ok", async () => {
    global.fetch = upstream(200, { status: "ok", model: "not_loaded" }) as unknown as typeof fetch;
    const reply = await call("GET", withToken);
    expect(reply.code).toBe(503);
    expect(reply.body).toEqual({ status: "model_unavailable" });
  });

  it("reports an unreachable backend", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("ECONNREFUSED")) as unknown as typeof fetch;
    const reply = await call("GET", withToken);
    expect(reply.code).toBe(503);
    expect(reply.body).toEqual({ status: "unreachable" });
  });

  it("reports an unexpected backend error as unreachable", async () => {
    global.fetch = upstream(500) as unknown as typeof fetch;
    const reply = await call("GET", withToken);
    expect(reply.code).toBe(502);
    expect(reply.body).toEqual({ status: "unreachable" });
  });

  it("is misconfigured without a credential or endpoint, and never calls the backend", async () => {
    const fetchMock = upstream(200);
    global.fetch = fetchMock as unknown as typeof fetch;

    expect((await call("GET")).body).toEqual({ status: "misconfigured" });

    delete process.env.AI_APP_ENDPOINT;
    expect((await call("GET", withToken)).body).toEqual({ status: "misconfigured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("only answers GET", async () => {
    expect((await call("POST", withToken)).code).toBe(405);
  });
});
