"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Eye } from "lucide-react";

const CountContext = createContext<number | null>(null);
const SESSION_KEY = "portfolio-visit-counted";
let pending: Promise<number | null> | undefined;

async function loadCount() {
  let counted = false;
  try {
    counted = sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    /* The session cookie remains a fallback. */
  }
  try {
    const response = await fetch("/api/views", {
      method: counted ? "GET" : "POST",
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const { count } = await response.json();
    if (!Number.isSafeInteger(count) || count < 0) return null;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* Storage can be blocked. */
    }
    return count as number;
  } catch {
    return null;
  }
}

export function ViewCounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    // Share in-flight work across Strict Mode remounts and page transitions.
    pending ??= loadCount();
    void pending.then((value) => {
      if (active) setCount(value);
    });
    return () => {
      active = false;
    };
  }, []);
  return (
    <CountContext.Provider value={count}>{children}</CountContext.Provider>
  );
}

export function ViewCounter() {
  const count = useContext(CountContext);
  if (count === null) return null;
  return (
    <span
      className="site-views"
      title="Approximate site visits since tracking began"
    >
      <Eye size={12} aria-hidden="true" />
      <span>
        {count.toLocaleString("en-CA")} {count === 1 ? "visit" : "visits"}
      </span>
    </span>
  );
}
