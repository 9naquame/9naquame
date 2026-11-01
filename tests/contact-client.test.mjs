import test from "node:test";
import assert from "node:assert/strict";
import { checkContactAvailability } from "../src/lib/contact-client.ts";

const stalledFetch = (_url, { signal }) =>
  new Promise((_resolve, reject) => {
    if (signal.aborted) reject(signal.reason);
    else
      signal.addEventListener("abort", () => reject(signal.reason), {
        once: true,
      });
  });

test("contact availability requires an explicit successful server response", async () => {
  const signal = new AbortController().signal;
  assert.equal(
    await checkContactAvailability(signal, async () =>
      Response.json({ available: true }),
    ),
    true,
  );
  for (const body of [{ available: false }, {}, null, { available: "true" }]) {
    assert.equal(
      await checkContactAvailability(signal, async () => Response.json(body)),
      false,
    );
  }
  assert.equal(
    await checkContactAvailability(signal, async () =>
      Response.json({ available: true }, { status: 503 }),
    ),
    false,
  );
  assert.equal(
    await checkContactAvailability(
      signal,
      async () => new Response("invalid JSON"),
    ),
    false,
  );
  assert.equal(
    await checkContactAvailability(signal, async () => {
      throw new TypeError("Network unavailable");
    }),
    false,
  );
});

test("a stalled contact availability request times out and selects the fallback", async () => {
  const signal = new AbortController().signal;
  let aborted = false;
  const result = await checkContactAvailability(
    signal,
    (url, options) => {
      assert.equal(url, "/api/contact");
      assert.equal(options.cache, "no-store");
      options.signal.addEventListener("abort", () => {
        aborted = true;
      });
      return stalledFetch(url, options);
    },
    10,
  );
  assert.equal(result, false);
  assert.equal(aborted, true);
});

test("closing the dialog cancels its pending availability request", async () => {
  const controller = new AbortController();
  const pending = checkContactAvailability(controller.signal, stalledFetch);
  controller.abort();
  assert.equal(await pending, false);
});

test("a previously cancelled check does not make a network request", async () => {
  const controller = new AbortController();
  controller.abort();
  assert.equal(
    await checkContactAvailability(controller.signal, async () =>
      assert.fail("must not fetch"),
    ),
    false,
  );
});
