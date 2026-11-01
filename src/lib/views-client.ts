export type SiteCounts = { count: number; visits: number };
type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;

const STORAGE_KEY = "portfolio_counts_v1";
const MAX_AGE = 5 * 60_000;

function validCounts(value: unknown): value is SiteCounts {
  if (
    !value ||
    typeof value !== "object" ||
    !("count" in value) ||
    !("visits" in value)
  )
    return false;
  return [value.count, value.visits].every(
    (count) =>
      typeof count === "number" && Number.isSafeInteger(count) && count >= 0,
  );
}

// Keep an entire confirmed pair together when requests finish out of order.
export function newerViewCounts(
  current: SiteCounts | null,
  candidate: SiteCounts | null,
): SiteCounts | null {
  if (!candidate) return current;
  if (
    !current ||
    candidate.count > current.count ||
    (candidate.count === current.count && candidate.visits >= current.visits)
  )
    return candidate;
  return current;
}

function readSavedCounts(storage?: Storage): SiteCounts | null {
  try {
    const entry = JSON.parse(storage?.getItem(STORAGE_KEY) ?? "null");
    if (
      validCounts(entry?.counts) &&
      Date.now() - entry.savedAt >= 0 &&
      Date.now() - entry.savedAt < MAX_AGE
    )
      return entry.counts;
  } catch {
    // Storage can be blocked or contain an obsolete value.
  }
  return null;
}

// Only confirmed server totals are stored; the session cookie still owns visits.
export function createViewRequest(
  storage?: Storage,
  fetcher = fetch,
  initialCounts: SiteCounts | null = null,
) {
  const saved = readSavedCounts(storage);

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
  const snapshot = validCounts(initialCounts) ? initialCounts : null;
  const confirmed = newerViewCounts(saved, snapshot);
  const preview = confirmed ? Promise.resolve(confirmed) : load("GET");
  const request = load("POST").then((counts) => {
    if (counts) {
      try {
        const savedNow = readSavedCounts(storage);
        if (newerViewCounts(savedNow, counts) === counts) {
          storage?.setItem(
            STORAGE_KEY,
            JSON.stringify({ counts, savedAt: Date.now() }),
          );
        }
      } catch {
        // An unavailable cache must not hide a successful database update.
      }
    }
    return counts;
  });
  return { preview, request };
}
