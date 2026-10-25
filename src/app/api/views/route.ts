import { getViewStore } from "@/lib/server/views-db";
import {
  createViewRateLimiter,
  handleViews,
  PUBLIC_SITE_ORIGIN,
} from "@/lib/server/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const rateLimit = createViewRateLimiter();

export function GET(request: Request) {
  return handleViews(request, {
    store: getViewStore(),
    rateLimit,
    origin:
      process.env.NODE_ENV === "production" ? PUBLIC_SITE_ORIGIN : undefined,
  });
}
export function POST(request: Request) {
  return handleViews(request, {
    store: getViewStore(),
    rateLimit,
    origin:
      process.env.NODE_ENV === "production" ? PUBLIC_SITE_ORIGIN : undefined,
  });
}
