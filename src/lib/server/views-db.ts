import "server-only";
import { createClient } from "@libsql/client";
import { createViewStore } from "./views";

let cached:
  | { key: string; store: ReturnType<typeof createViewStore> }
  | undefined;

export function getViewStore() {
  if (process.env.SITE_VIEWS_ENABLED !== "true") return null;
  if (process.env.CONTEXT && process.env.CONTEXT !== "production") return null;
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url) return null;
  // Local files are allowed only for development/testing, never deployed storage.
  const local =
    process.env.NODE_ENV !== "production" && url.startsWith("file:");
  if (!local && (!authToken || !/^(libsql|https):\/\//.test(url))) return null;
  const key = `${url}\n${authToken ?? ""}`;
  if (cached?.key === key) return cached.store;
  try {
    const client = createClient({
      url,
      authToken: local ? undefined : authToken,
    });
    cached = { key, store: createViewStore(client) };
    return cached.store;
  } catch {
    return null;
  }
}
