"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";

type SiteCounts = { count: number; visits: number };
const CountContext = createContext<SiteCounts | null>(null);
let latestView:
  | { path: string; request: Promise<SiteCounts | null> }
  | undefined;

async function loadCount() {
  try {
    const response = await fetch("/api/views", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const { count, visits } = await response.json();
    if (
      ![count, visits].every(
        (value) => Number.isSafeInteger(value) && value >= 0,
      )
    )
      return null;
    return { count, visits } as SiteCounts;
  } catch {
    return null;
  }
}

export function ViewCounterProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [count, setCount] = useState<SiteCounts | null>(null);
  useEffect(() => {
    let active = true;
    // Avoid duplicate Strict Mode effects, while counting every route transition.
    // A document refresh resets this module, so it counts as another view.
    if (latestView?.path !== pathname)
      latestView = { path: pathname, request: loadCount() };
    void latestView.request.then((value) => {
      if (active) setCount(value);
    });
    return () => {
      active = false;
    };
  }, [pathname]);
  return (
    <CountContext.Provider value={count}>{children}</CountContext.Provider>
  );
}

export function ViewCounter() {
  const counts = useContext(CountContext);
  if (counts === null) return null;
  const { count, visits } = counts;
  return (
    <span className="site-views" title="Page views and browsing sessions">
      <Eye size={12} aria-hidden="true" />
      <span>
        {count.toLocaleString("en-CA")} {count === 1 ? "view" : "views"}
        {" · "}
        {visits.toLocaleString("en-CA")} {visits === 1 ? "visit" : "visits"}
      </span>
    </span>
  );
}
