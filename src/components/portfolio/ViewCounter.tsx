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
import { createViewRequest } from "@/lib/views-client";

type SiteCounts = { count: number; visits: number };
const CountContext = createContext<SiteCounts | null>(null);
let latestView:
  | ({ path: string } & ReturnType<typeof createViewRequest>)
  | undefined;

export function ViewCounterProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [count, setCount] = useState<SiteCounts | null>(null);
  useEffect(() => {
    let active = true;
    let updated = false;
    // Avoid duplicate Strict Mode effects, while counting every route transition.
    // A document refresh resets this module, so it counts as another view.
    if (latestView?.path !== pathname) {
      let storage: Storage | undefined;
      try {
        storage = window.sessionStorage;
      } catch {
        // Private browsing may block storage access.
      }
      latestView = { path: pathname, ...createViewRequest(storage) };
    }
    void latestView.preview.then((value) => {
      if (active && !updated && value) setCount(value);
    });
    void latestView.request.then((value) => {
      if (active && value) {
        updated = true;
        setCount(value);
      }
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
