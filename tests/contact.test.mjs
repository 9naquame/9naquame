import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  handleContact,
  createContactRateLimiter,
  sendContactEmail,
  getDeliveryConfig,
} from "../src/lib/server/contact.ts";

test("Resend is the default and requires server credentials", (t) => {
  const keys = [
    "CONTACT_EMAIL_PROVIDER",
    "RESEND_API_KEY",
    "CONTACT_FROM_EMAIL",
    "CONTACT_TO_EMAIL",
  ];
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  t.after(() => {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  process.env.CONTACT_EMAIL_PROVIDER = "";
  process.env.RESEND_API_KEY = "";
  process.env.CONTACT_FROM_EMAIL = "Portfolio <sender@example.com>";
  process.env.CONTACT_TO_EMAIL = "owner@example.com";
  assert.equal(getDeliveryConfig(), null);
  process.env.RESEND_API_KEY = "test-only";
  assert.deepEqual(getDeliveryConfig(), {
    apiKey: "test-only",
    from: "Portfolio <sender@example.com>",
    to: "owner@example.com",
  });
  process.env.CONTACT_FROM_EMAIL = "";
  assert.equal(getDeliveryConfig(), null);
});

const fields = () => ({
  name: "  Alex Morgan  ",
  email: "alex@example.com",
  message: "  I would like to discuss a project.  ",
  topic: "RideOn",
  website: "",
  submissionId: randomUUID(),
});
const request = (body = fields(), headers = {}) =>
  new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: {
      Origin: "https://portfolio.example",
      "Content-Type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const dependencies = (overrides = {}) => ({
  configured: true,
  deliver: async () => {},
  rateLimit: createContactRateLimiter(),
  ...overrides,
});

test("valid messages are normalized and acknowledged only after delivery", async () => {
  let delivered;
  const response = await handleContact(
    request(),
    dependencies({
      deliver: async (message) => {
        delivered = message;
      },
    }),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(delivered.name, "Alex Morgan");
  assert.equal(delivered.message, "I would like to discuss a project.");
  assert.equal(delivered.topic, "RideOn");
});

test("invalid origin, JSON, fields, and honeypot never send mail", async () => {
  let count = 0;
  const deps = dependencies({
    deliver: async () => {
      count++;
    },
  });
  for (const [req, expected] of [
    [request(fields(), { Origin: "https://other.example" }), 403],
    [request(fields(), { Origin: "" }), 403],
    [request(fields(), { "Content-Type": "text/plain" }), 415],
    [request("{broken"), 400],
    [request({ ...fields(), email: "invalid" }), 400],
    [request({ ...fields(), message: "short" }), 400],
    [request({ ...fields(), website: "https://spam.example" }), 400],
    [request({ ...fields(), name: "Name\r\nInjected" }), 400],
    [request("x".repeat(16385)), 413],
  ])
    assert.equal((await handleContact(req, deps)).status, expected);
  assert.equal(count, 0);
});

test("unconfigured and failed delivery never report success", async () => {
  const unavailable = await handleContact(
    request(),
    dependencies({
      configured: false,
      deliver: async () => assert.fail("must not send"),
    }),
  );
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).code, "delivery_unavailable");
  const failed = await handleContact(
    request(),
    dependencies({
      deliver: async () => {
        throw new Error("private provider details");
      },
    }),
  );
  assert.equal(failed.status, 502);
  const result = await failed.json();
  assert.equal(result.ok, undefined);
  assert.ok(!result.error.includes("private provider details"));
});

test("rate limit blocks the sixth attempt and resets after ten minutes", async () => {
  let time = 1000;
  let sent = 0;
  const deps = dependencies({
    rateLimit: createContactRateLimiter(() => time),
    deliver: async () => {
      sent++;
    },
  });
  for (let i = 0; i < 5; i++)
    assert.equal((await handleContact(request(), deps)).status, 200);
  const blocked = await handleContact(request(), deps);
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("retry-after"), "600");
  assert.equal(sent, 5);
  time += 600000;
  assert.equal((await handleContact(request(), deps)).status, 200);
});

test("provider adapter uses fixed addresses, reply-to, and stable retry keys", async () => {
  const calls = [];
  const config = {
    apiKey: "test-only",
    from: "Portfolio <sender@example.com>",
    to: "owner@example.com",
  };
  const message = fields();
  const fakeFetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ id: "fake-receipt" });
  };
  await sendContactEmail(message, config, fakeFetch);
  await sendContactEmail(message, config, fakeFetch);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.from, config.from);
  assert.deepEqual(body.to, [config.to]);
  assert.equal(body.reply_to, message.email);
  assert.equal(
    calls[0].options.headers["Idempotency-Key"],
    calls[1].options.headers["Idempotency-Key"],
  );
  await sendContactEmail(
    { ...message, message: "A changed message with the same submission id." },
    config,
    fakeFetch,
  );
  assert.notEqual(
    calls[0].options.headers["Idempotency-Key"],
    calls[2].options.headers["Idempotency-Key"],
  );
  await assert.rejects(
    sendContactEmail(message, config, async () =>
      Response.json({}, { status: 500 }),
    ),
  );
  await assert.rejects(
    sendContactEmail(message, config, async () => Response.json({})),
  );
});
