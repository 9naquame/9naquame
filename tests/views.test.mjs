import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@libsql/client";
import {
  createViewStore,
  createViewRateLimiter,
  handleViews,
} from "../src/lib/server/views.ts";

async function database(t) {
  const client = createClient({ url: "file::memory:" });
  t.after(() => client.close());
  await client.execute(
    await readFile(new URL("../docs/site-views.sql", import.meta.url), "utf8"),
  );
  return { client, store: createViewStore(client) };
}
const request = (method = "POST", headers = {}, body) =>
  new Request("https://9naqua.me/api/views", {
    method,
    headers: {
      origin: "https://9naqua.me",
      "user-agent": "Mozilla/5.0",
      ...headers,
    },
    body,
  });

test("atomic increments survive concurrent visits in one table and row", async (t) => {
  const { client, store } = await database(t);
  assert.equal(await store.count(false), 0);
  await Promise.all(Array.from({ length: 30 }, () => store.count(true)));
  assert.equal(await store.count(false), 30);
  const result = await client.execute("SELECT key, count FROM site_views");
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].key, "portfolio");
});

test("GET reads; POST increments; a session cookie prevents repeat increments", async (t) => {
  const { store } = await database(t);
  const deps = { store, rateLimit: createViewRateLimiter() };
  assert.deepEqual(await (await handleViews(request("GET"), deps)).json(), {
    count: 0,
  });
  const first = await handleViews(request(), deps);
  assert.deepEqual(await first.json(), { count: 1 });
  const cookie = first.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly; SameSite=Lax; Secure/);
  assert.ok(!cookie.includes("Max-Age"));
  const repeat = await handleViews(
    request("POST", { cookie: "other=1; portfolio_visit=1" }),
    deps,
  );
  assert.deepEqual(await repeat.json(), { count: 1 });
  assert.equal(await store.count(false), 1);
});

test("empty request streams are accepted as Next.js wraps empty POST bodies", async (t) => {
  const { store } = await database(t);
  const response = await handleViews(request("POST", {}, ""), {
    store,
    rateLimit: createViewRateLimiter(),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { count: 1 });
});

test("cross-origin calls, bodies, and obvious bots cannot increment", async (t) => {
  const { store } = await database(t);
  const deps = { store, rateLimit: createViewRateLimiter() };
  assert.equal(
    (
      await handleViews(
        request("POST", { origin: "https://evil.example" }),
        deps,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handleViews(request("POST", { origin: "" }), deps)).status,
    403,
  );
  assert.equal(
    (await handleViews(request("POST", {}, '{"count":9999}'), deps)).status,
    400,
  );
  assert.equal(
    (await handleViews(request("POST", { "user-agent": "Googlebot" }), deps))
      .status,
    200,
  );
  assert.equal(await store.count(false), 0);
});

test("rate limits are IP-scoped and expire after ten minutes", async (t) => {
  const { store } = await database(t);
  let time = 1000;
  const deps = { store, rateLimit: createViewRateLimiter(() => time) };
  for (let i = 0; i < 10; i++)
    assert.equal((await handleViews(request(), deps)).status, 200);
  const limited = await handleViews(request(), deps);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "600");
  assert.equal(
    (
      await handleViews(
        request("POST", { "x-nf-client-connection-ip": "192.0.2.1" }),
        deps,
      )
    ).status,
    200,
  );
  time += 600000;
  assert.equal((await handleViews(request(), deps)).status, 200);
});

test("unconfigured or failing storage returns unavailable without sensitive details", async () => {
  const rateLimit = createViewRateLimiter();
  const unavailable = await handleViews(request(), { store: null, rateLimit });
  assert.equal(unavailable.status, 503);
  assert.deepEqual(await unavailable.json(), { available: false });
  const failure = await handleViews(request(), {
    store: {
      count: async () => {
        throw new Error("secret database token");
      },
    },
    rateLimit,
  });
  assert.equal(failure.status, 503);
  assert.deepEqual(await failure.json(), { available: false });
});
