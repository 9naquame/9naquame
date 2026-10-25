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

test("atomic increments survive concurrent page views in one table and row", async (t) => {
  const { client, store } = await database(t);
  assert.deepEqual(await store.count(false), { count: 0, visits: 0 });
  await Promise.all(Array.from({ length: 30 }, () => store.count(true, true)));
  assert.deepEqual(await store.count(false), { count: 30, visits: 30 });
  const result = await client.execute("SELECT key, count FROM site_views");
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].key, "portfolio");
});

test("GET reads; refreshes increase views while session visits stay unchanged", async (t) => {
  const { store } = await database(t);
  const deps = { store, rateLimit: createViewRateLimiter() };
  assert.deepEqual(await (await handleViews(request("GET"), deps)).json(), {
    count: 0,
    visits: 0,
  });
  // Ignore obsolete cookies so visits start counting with the new deployment.
  const first = await handleViews(
    request("POST", { cookie: "portfolio_visit=1" }),
    deps,
  );
  assert.deepEqual(await first.json(), { count: 1, visits: 1 });
  const cookie = first.headers.get("set-cookie");
  assert.match(
    cookie,
    /portfolio_session_v2=1; Path=\/; HttpOnly; SameSite=Lax; Secure/,
  );
  assert.ok(!cookie.includes("Max-Age"));
  const repeat = await handleViews(
    request("POST", { cookie: "portfolio_session_v2=1" }),
    deps,
  );
  assert.deepEqual(await repeat.json(), { count: 2, visits: 1 });
  const secondSession = await handleViews(request(), deps);
  assert.deepEqual(await secondSession.json(), { count: 3, visits: 2 });
  assert.deepEqual(await store.count(false), { count: 3, visits: 2 });
});

test("empty request streams are accepted as Next.js wraps empty POST bodies", async (t) => {
  const { store } = await database(t);
  const response = await handleViews(request("POST", {}, ""), {
    store,
    rateLimit: createViewRateLimiter(),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { count: 1, visits: 1 });
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
  assert.deepEqual(await store.count(false), { count: 0, visits: 0 });
});

test("rate limits are IP-scoped and expire after one minute", async (t) => {
  const { store } = await database(t);
  let time = 1000;
  const deps = { store, rateLimit: createViewRateLimiter(() => time) };
  for (let i = 0; i < 60; i++)
    assert.equal((await handleViews(request(), deps)).status, 200);
  const limited = await handleViews(request(), deps);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "60");
  assert.equal(
    (
      await handleViews(
        request("POST", { "x-nf-client-connection-ip": "192.0.2.1" }),
        deps,
      )
    ).status,
    200,
  );
  time += 60000;
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

test("trusted public origin works behind Netlify while other origins remain blocked", async (t) => {
  const { store } = await database(t);
  const deps = {
    store,
    rateLimit: createViewRateLimiter(),
    origin: "https://9naqua.me",
  };
  const proxied = (origin) =>
    new Request("http://internal-netlify-handler/api/views", {
      method: "POST",
      headers: { origin, "user-agent": "Mozilla/5.0" },
    });
  const response = await handleViews(proxied("https://9naqua.me"), deps);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { count: 1, visits: 1 });
  assert.match(response.headers.get("set-cookie"), /; Secure/);
  assert.equal(
    (await handleViews(proxied("https://evil.example"), deps)).status,
    403,
  );
  assert.equal(
    (await handleViews(proxied("http://internal-netlify-handler"), deps))
      .status,
    403,
  );
  assert.deepEqual(await store.count(false), { count: 1, visits: 1 });
});

test("migration preserves the existing view total and initializes visits at zero", async (t) => {
  const client = createClient({ url: "file::memory:" });
  t.after(() => client.close());
  await client.execute(
    "CREATE TABLE site_views (key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)",
  );
  await client.execute("INSERT INTO site_views VALUES ('portfolio', 123)");
  await client.execute(
    await readFile(
      new URL("../docs/migrations/001-add-visits.sql", import.meta.url),
      "utf8",
    ),
  );
  const store = createViewStore(client);
  assert.deepEqual(await store.count(false), { count: 123, visits: 0 });
  assert.deepEqual(await store.count(true, true), { count: 124, visits: 1 });
  assert.deepEqual(await store.count(true, false), { count: 125, visits: 1 });
});
