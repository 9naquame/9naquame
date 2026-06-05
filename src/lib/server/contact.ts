import { createHash } from "node:crypto";
import { z } from "zod";

const MAX_BODY_BYTES = 16_384;
const WINDOW_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[^\r\n]+$/),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  topic: z.string().trim().max(120).optional().default(""),
  website: z.string().max(0).optional().default(""),
  submissionId: z.string().uuid(),
});
export type ContactMessage = z.infer<typeof contactSchema>;
export type DeliveryConfig = { apiKey: string; from: string; to: string };

export function getDeliveryConfig(): DeliveryConfig | null {
  if ((process.env.CONTACT_EMAIL_PROVIDER?.trim() || "resend") !== "resend")
    return null;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "kwame@owusuboakye.com";
  if (
    !apiKey ||
    !from ||
    /[\r\n]/.test(from) ||
    !z.email().safeParse(to).success
  )
    return null;
  return { apiKey, from, to };
}

export function createContactRateLimiter(now = Date.now) {
  const attempts = new Map<string, { count: number; expires: number }>();
  return (request: Request) => {
    const time = now();
    for (const [key, value] of attempts)
      if (value.expires <= time) attempts.delete(key);
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const key = createHash("sha256").update(ip).digest("hex");
    const entry = attempts.get(key);
    if (entry && entry.count >= MAX_ATTEMPTS)
      return Math.ceil((entry.expires - time) / 1000);
    // Bound process-local memory. Hosting-level protection can enforce a global limit.
    if (!entry && attempts.size >= 5000) return 60;
    attempts.set(key, {
      count: (entry?.count ?? 0) + 1,
      expires: entry?.expires ?? time + WINDOW_MS,
    });
    return 0;
  };
}

export async function sendContactEmail(
  message: ContactMessage,
  config: DeliveryConfig,
  send: typeof fetch = fetch,
) {
  const context = message.topic || "General enquiry";
  const text = `Name: ${message.name}\nReply email: ${message.email}\nRegarding: ${context}\n\n${message.message}`;
  const fingerprint = createHash("sha256")
    .update(text)
    .digest("hex")
    .slice(0, 24);
  const response = await send("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `portfolio/${message.submissionId}/${fingerprint}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: message.email,
      subject: "Portfolio contact message",
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Email provider rejected delivery");
  const receipt: unknown = await response.json();
  if (
    !receipt ||
    typeof receipt !== "object" ||
    !("id" in receipt) ||
    typeof receipt.id !== "string" ||
    !receipt.id
  ) {
    throw new Error("Email provider did not acknowledge delivery");
  }
}

type Dependencies = {
  configured: boolean;
  deliver: (message: ContactMessage) => Promise<void>;
  rateLimit: ReturnType<typeof createContactRateLimiter>;
};
const json = (
  body: object,
  status: number,
  extra: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });

export async function handleContact(
  request: Request,
  dependencies: Dependencies,
) {
  const origin = request.headers.get("origin");
  try {
    if (!origin || new URL(origin).origin !== new URL(request.url).origin)
      return json(
        { error: "Please send your message from this website." },
        403,
      );
  } catch {
    return json({ error: "Invalid request origin." }, 403);
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return json({ error: "Please submit the contact form." }, 415);
  }
  let input: unknown;
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Please enter your message." }, 400);
  try {
    const decoder = new TextDecoder();
    let size = 0;
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return json(
          {
            error: "Your message is too long. Please shorten it and try again.",
          },
          413,
        );
      }
      text += decoder.decode(value, { stream: true });
    }
    input = JSON.parse(text + decoder.decode());
  } catch {
    return json(
      { error: "The message could not be read. Please try again." },
      400,
    );
  } finally {
    reader.releaseLock();
  }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return json(
      {
        error:
          "Please check your name, email, and message. Messages must be 10–5,000 characters.",
      },
      400,
    );
  if (!dependencies.configured)
    return json(
      {
        error:
          "Direct sending is currently unavailable. Please use your email app instead.",
        code: "delivery_unavailable",
      },
      503,
    );
  const retryAfter = dependencies.rateLimit(request);
  if (retryAfter)
    return json(
      {
        error:
          "You’ve sent several messages. Please try again in a few minutes.",
      },
      429,
      { "Retry-After": String(retryAfter) },
    );
  try {
    await dependencies.deliver(parsed.data);
    return json({ ok: true }, 200);
  } catch {
    return json(
      {
        error:
          "We couldn’t confirm your message was sent. Please retry or use your email app.",
      },
      502,
    );
  }
}
