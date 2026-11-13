/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("botid/server", () => ({ checkBotId: jest.fn() }));

import { checkBotId } from "botid/server";
import handler from "../pages/api/predict";

const botId = checkBotId as unknown as jest.Mock;

type Reply = { code: number; body: unknown };

function call(
  headers: Record<string, string> = {},
  body: unknown = { image: IMAGE },
  method = "POST"
): Promise<Reply> {
  const req = {
    method,
    headers: { host: "www.alanszuster.dev", "x-vercel-oidc-token": "jwt.value", ...headers },
    body,
  } as unknown as NextApiRequest;
  return new Promise((resolve) => {
    const reply: Reply = { code: 0, body: undefined };
    const res = {
      setHeader: () => undefined,
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

const IMAGE = "data:image/png;base64,AAAA";

const upstream = (status = 200, body: unknown = { predictions: [], success: true }) =>
  jest.fn().mockResolvedValue({ ok: status < 300, status, json: async () => body });

describe("/api/predict", () => {
  const originalFetch = global.fetch;
  const env = { ...process.env };

  beforeEach(() => {
    process.env.AI_APP_ENDPOINT = "https://api.example";
    delete process.env.VERCEL;
    botId.mockReset().mockResolvedValue({ isBot: false, isVerifiedBot: false });
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  it("forwards a drawing to the API with the OIDC token and a timeout", async () => {
    const fetchMock = upstream();
    global.fetch = fetchMock as unknown as typeof fetch;

    const reply = await call();

    expect(reply.code).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example/predict");
    expect(init.headers.Authorization).toBe("Bearer jwt.value");
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("refuses requests that name another site as their origin", async () => {
    const fetchMock = upstream();
    global.fetch = fetchMock as unknown as typeof fetch;

    for (const origin of ["https://evil.example", "not a url"]) {
      const reply = await call({ origin });
      expect(reply.code).toBe(403);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts the site's own origin and requests without an origin", async () => {
    global.fetch = upstream() as unknown as typeof fetch;
    expect((await call({ origin: "https://www.alanszuster.dev" })).code).toBe(200);
    expect((await call()).code).toBe(200);
  });

  it("blocks bots before anything reaches the API", async () => {
    const fetchMock = upstream();
    global.fetch = fetchMock as unknown as typeof fetch;
    botId.mockResolvedValue({ isBot: true, isVerifiedBot: false });

    const reply = await call();

    expect(reply.code).toBe(403);
    expect(reply.body).toEqual({ error: "Request blocked" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lets verified bots through and passes the request headers to BotID", async () => {
    global.fetch = upstream() as unknown as typeof fetch;
    botId.mockResolvedValue({ isBot: true, isVerifiedBot: true });

    expect((await call()).code).toBe(200);
    expect(botId.mock.calls[0][0].advancedOptions.headers.host).toBe("www.alanszuster.dev");
  });

  it("does not turn a failing BotID check into an outage", async () => {
    global.fetch = upstream() as unknown as typeof fetch;
    botId.mockRejectedValue(new Error("not on Vercel"));

    expect((await call()).code).toBe(200);
  });

  it("answers 504 when the API takes too long", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(Object.assign(new Error("timeout"), { name: "TimeoutError" })) as unknown as typeof fetch;

    const reply = await call();
    expect(reply.code).toBe(504);
  });

  it("keeps rejecting bad input", async () => {
    global.fetch = upstream() as unknown as typeof fetch;
    expect((await call({}, {}, "GET")).code).toBe(405);
    expect((await call({}, null)).code).toBe(400);
    expect((await call({}, { image: "data:image/gif;base64,AAAA" })).code).toBe(400);
  });
});
