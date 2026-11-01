import { resolveRequestOrigin } from "@/lib/server/request-origin";
import { getViewStore } from "@/lib/server/views-db";
import { createViewRateLimiter, handleViews } from "@/lib/server/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const rateLimit = createViewRateLimiter();

export function GET(request: Request) {
  return handleViews(request, {
    store: getViewStore(),
    rateLimit,
    origin: resolveRequestOrigin(
      request,
      process.env.NODE_ENV === "production",
    ),
  });
}
export function POST(request: Request) {
  return handleViews(request, {
    store: getViewStore(),
    rateLimit,
    origin: resolveRequestOrigin(
      request,
      process.env.NODE_ENV === "production",
    ),
  });
}
