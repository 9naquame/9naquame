import { resolveRequestOrigin } from "@/lib/server/request-origin";
import {
  createContactRateLimiter,
  getDeliveryConfig,
  handleContact,
  sendContactEmail,
} from "@/lib/server/contact";

export const runtime = "nodejs";
const rateLimit = createContactRateLimiter();

export function GET() {
  return Response.json(
    { available: Boolean(getDeliveryConfig()) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const config = getDeliveryConfig();
  return handleContact(request, {
    origin: resolveRequestOrigin(
      request,
      process.env.NODE_ENV === "production",
    ),
    configured: Boolean(config),
    rateLimit,
    deliver: async (message) => {
      if (!config) throw new Error("Email delivery not configured");
      await sendContactEmail(message, config);
    },
  });
}
