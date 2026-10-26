type SiteCounts = { count: number; visits: number };
type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;

const STORAGE_KEY = "portfolio_counts_v1";
const MAX_AGE = 5 * 60_000;

function validCounts(value: SiteCounts): boolean {
  return [value?.count, value?.visits].every(
    (count) => Number.isSafeInteger(count) && count >= 0,
  );
}

// Only confirmed server totals are stored; the session cookie still owns visits.
export function createViewRequest(storage?: Storage, fetcher = fetch) {
  let saved: SiteCounts | null = null;
  try {
    const entry = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null");
    if (
      validCounts(entry?.counts) &&
      Date.now() - entry.savedAt >= 0 &&
      Date.now() - entry.savedAt < MAX_AGE
    )
      saved = entry.counts;
  } catch {
    // Storage can be blocked or contain an obsolete value.
  }

  async function load(method: "GET" | "POST"): Promise<SiteCounts | null> {
    try {
      const response = await fetcher("/api/views", {
        method,
        credentials: "same-origin",
        ...(method === "POST" ? { cache: "no-store" as const } : {}),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return null;
      const counts = await response.json();
      return validCounts(counts) ? counts : null;
    } catch {
      return null;
    }
  }

  // A cached read can render while the atomic write is still in flight.
  const preview = saved ? Promise.resolve(saved) : load("GET");
  const request = load("POST").then((counts) => {
    if (counts) {
      try {
        storage?.setItem(
          STORAGE_KEY,
          JSON.stringify({ counts, savedAt: Date.now() }),
        );
      } catch {
        // An unavailable cache must not hide a successful database update.
      }
    }
    return counts;
  });
  return { preview, request };
}
