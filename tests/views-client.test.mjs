import test from "node:test";
import assert from "node:assert/strict";
import { createViewRequest, newerViewCounts } from "../src/lib/views-client.ts";

function storage(value = null) {
  return {
    getItem: () => value,
    setItem: (_, next) => {
      value = next;
    },
  };
}

test("first visit shows a read without waiting for the write", async () => {
  let finishWrite;
  const pending = new Promise((resolve) => {
    finishWrite = resolve;
  });
  const methods = [];
  const cache = storage();
  const counts = createViewRequest(cache, async (_, options) => {
    methods.push(options.method);
    if (options.method === "POST") {
      assert.equal(options.cache, "no-store");
      return pending;
    }
    return Response.json({ count: 50, visits: 10 });
  });
  assert.deepEqual(methods, ["GET", "POST"]);
  assert.deepEqual(await counts.preview, { count: 50, visits: 10 });
  finishWrite(Response.json({ count: 51, visits: 11 }));
  assert.deepEqual(await counts.request, { count: 51, visits: 11 });
  assert.deepEqual(JSON.parse(cache.getItem()).counts, {
    count: 51,
    visits: 11,
  });
});

test("refresh uses recent confirmed totals immediately and still records one view", async () => {
  const cache = storage(
    JSON.stringify({
      counts: { count: 51, visits: 11 },
      savedAt: Date.now(),
    }),
  );
  let finishWrite;
  const pending = new Promise((resolve) => {
    finishWrite = resolve;
  });
  const methods = [];
  const counts = createViewRequest(cache, (_, options) => {
    methods.push(options.method);
    return pending;
  });
  assert.deepEqual(await counts.preview, { count: 51, visits: 11 });
  assert.deepEqual(methods, ["POST"]);
  finishWrite(Response.json({ count: 52, visits: 11 }));
  assert.deepEqual(await counts.request, { count: 52, visits: 11 });
});

test("expired, invalid, or blocked storage falls back to the read path", async () => {
  for (const cache of [
    storage("invalid json"),
    storage(
      JSON.stringify({ counts: { count: -1, visits: 2 }, savedAt: Date.now() }),
    ),
    storage(
      JSON.stringify({
        counts: { count: 1, visits: 2 },
        savedAt: Date.now() - 300_001,
      }),
    ),
    {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    },
  ]) {
    const counts = createViewRequest(cache, async () =>
      Response.json({ count: 5, visits: 3 }),
    );
    assert.deepEqual(await counts.preview, { count: 5, visits: 3 });
    assert.deepEqual(await counts.request, { count: 5, visits: 3 });
  }
});

test("failed updates do not overwrite confirmed totals or invent counts", async () => {
  const saved = JSON.stringify({
    counts: { count: 51, visits: 11 },
    savedAt: Date.now(),
  });
  const cache = storage(saved);
  const counts = createViewRequest(
    cache,
    async () => new Response(null, { status: 503 }),
  );
  assert.deepEqual(await counts.preview, { count: 51, visits: 11 });
  assert.equal(await counts.request, null);
  assert.equal(cache.getItem(), saved);
  const invalid = createViewRequest(undefined, async () =>
    Response.json({ count: "5", visits: 3 }),
  );
  assert.equal(await invalid.preview, null);
  assert.equal(await invalid.request, null);
});

test("a first-time visitor uses the HTML snapshot while the increment is pending", async () => {
  const methods = [];
  let finishWrite;
  const pending = new Promise((resolve) => {
    finishWrite = resolve;
  });
  const counts = createViewRequest(
    storage(),
    (_, options) => {
      methods.push(options.method);
      return pending;
    },
    { count: 75, visits: 13 },
  );
  assert.deepEqual(await counts.preview, { count: 75, visits: 13 });
  assert.deepEqual(methods, ["POST"]);
  finishWrite(Response.json({ count: 76, visits: 14 }));
  assert.deepEqual(await counts.request, { count: 76, visits: 14 });
});

test("the newer confirmed total wins between HTML and session storage", async () => {
  for (const [snapshot, savedCount, expected] of [
    [
      { count: 80, visits: 15 },
      { count: 75, visits: 13 },
      { count: 80, visits: 15 },
    ],
    [
      { count: 75, visits: 13 },
      { count: 80, visits: 15 },
      { count: 80, visits: 15 },
    ],
  ]) {
    const cache = storage(
      JSON.stringify({ counts: savedCount, savedAt: Date.now() }),
    );
    const counts = createViewRequest(
      cache,
      async () => new Response(null, { status: 503 }),
      snapshot,
    );
    assert.deepEqual(await counts.preview, expected);
    assert.equal(await counts.request, null);
  }
});

test("an invalid HTML snapshot falls back to a confirmed API read", async () => {
  const methods = [];
  const counts = createViewRequest(
    undefined,
    async (_, options) => {
      methods.push(options.method);
      return Response.json({ count: 75, visits: 13 });
    },
    { count: -1, visits: 13 },
  );
  assert.deepEqual(await counts.preview, { count: 75, visits: 13 });
  await counts.request;
  assert.deepEqual(methods, ["GET", "POST"]);
});

test("late writes cannot overwrite a newer confirmed session total", async () => {
  const cache = storage();
  const writes = [];
  const fetcher = (_, options) => {
    assert.equal(options.method, "POST");
    return new Promise((resolve) => {
      writes.push(resolve);
    });
  };
  const earlier = createViewRequest(cache, fetcher, { count: 75, visits: 13 });
  const later = createViewRequest(cache, fetcher, { count: 75, visits: 13 });
  writes[1](Response.json({ count: 77, visits: 14 }));
  const displayed = await later.request;
  const saved = cache.getItem();
  writes[0](Response.json({ count: 76, visits: 14 }));
  const lateResponse = await earlier.request;
  assert.equal(cache.getItem(), saved);
  assert.deepEqual(newerViewCounts(displayed, lateResponse), {
    count: 77,
    visits: 14,
  });
});

test("a stale preview cannot replace the currently displayed confirmed pair", () => {
  const current = { count: 77, visits: 14 };
  assert.equal(newerViewCounts(current, { count: 75, visits: 13 }), current);
  assert.equal(newerViewCounts(current, null), current);
  assert.deepEqual(newerViewCounts(current, { count: 78, visits: 14 }), {
    count: 78,
    visits: 14,
  });
});
