import { createHash } from "node:crypto";
import type { Client } from "@libsql/client";

export const PUBLIC_SITE_ORIGIN = "https://9naqua.me";

export function createViewStore(client: Pick<Client, "execute">) {
  return {
    async count(increment: boolean): Promise<number> {
      const result = await client.execute(
        increment
          ? `INSERT INTO site_views (key, count) VALUES ('portfolio', 1)
           ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count`
          : "SELECT count FROM site_views WHERE key = 'portfolio'",
      );
      const count = Number(result.rows[0]?.count ?? 0);
      if (!Number.isSafeInteger(count) || count < 0)
        throw new Error("Invalid view count");
      return count;
    },
  };
}

// Basic per-instance protection, not a distributed bot-prevention system.
export function createViewRateLimiter(now = Date.now) {
  const requests = new Map<string, { count: number; until: number }>();
  return (request: Request) => {
    const time = now();
    for (const [key, value] of requests)
      if (value.until <= time) requests.delete(key);
    const ip =
      request.headers.get("x-nf-client-connection-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "unknown";
    const key = createHash("sha256").update(ip).digest("hex");
    const entry = requests.get(key);
    if (entry && entry.count >= 60)
      return Math.ceil((entry.until - time) / 1000);
    if (!entry && requests.size >= 5000) return 60;
    requests.set(key, {
      count: (entry?.count ?? 0) + 1,
      until: entry?.until ?? time + 60_000,
    });
    return 0;
  };
}

type Dependencies = {
  origin?: string;
  store: ReturnType<typeof createViewStore> | null;
  rateLimit: ReturnType<typeof createViewRateLimiter>;
};
const json = (
  body: object,
  status = 200,
  headers: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

export async function handleViews(
  request: Request,
  { store, rateLimit, origin }: Dependencies,
) {
  if (request.method !== "GET" && request.method !== "POST")
    return json({}, 405);
  if (request.method === "POST") {
    try {
      if (
        new URL(request.headers.get("origin") || "").origin !==
        new URL(origin ?? request.url).origin
      )
        return json({}, 403);
    } catch {
      return json({}, 403);
    }
    // No client-supplied key, count, SQL, or body is accepted.
    const reader = request.body?.getReader();
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value.byteLength) {
            await reader.cancel();
            return json({}, 400);
          }
        }
      } catch {
        return json({}, 400);
      } finally {
        reader.releaseLock();
      }
    }
  }
  if (!store) return json({ available: false }, 503);
  const retry = rateLimit(request);
  if (retry)
    return json({ available: false }, 429, { "Retry-After": String(retry) });
  const bot = /bot|crawler|spider|headless|preview/i.test(
    request.headers.get("user-agent") || "",
  );
  const increment = request.method === "POST" && !bot;
  try {
    const count = await store.count(increment);
    return json({ count }, 200);
  } catch {
    return json({ available: false }, 503);
  }
}
