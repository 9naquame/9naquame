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

const CountContext = createContext<number | null>(null);
let latestView: { path: string; request: Promise<number | null> } | undefined;

async function loadCount() {
  try {
    const response = await fetch("/api/views", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const { count } = await response.json();
    if (!Number.isSafeInteger(count) || count < 0) return null;
    return count as number;
  } catch {
    return null;
  }
}

export function ViewCounterProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [count, setCount] = useState<number | null>(null);
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
  const count = useContext(CountContext);
  if (count === null) return null;
  return (
    <span className="site-views" title="Total page views since tracking began">
      <Eye size={12} aria-hidden="true" />
      <span>
        {count.toLocaleString("en-CA")} {count === 1 ? "view" : "views"}
      </span>
    </span>
  );
}
