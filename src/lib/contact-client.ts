// A failed availability check selects the existing email-app fallback.
export async function checkContactAvailability(
  signal: AbortSignal,
  fetcher = fetch,
  timeoutMs = 8000,
): Promise<boolean> {
  if (signal.aborted) return false;
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener("abort", cancel, { once: true });
  const timer = setTimeout(cancel, timeoutMs);
  try {
    const response = await fetcher("/api/contact", {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return (
      result !== null &&
      typeof result === "object" &&
      "available" in result &&
      result.available === true
    );
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", cancel);
  }
}
