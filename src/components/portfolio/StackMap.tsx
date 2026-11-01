"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import {
  Activity,
  Cloud,
  Clock3,
  Network,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Braces,
  Database,
  Layers3,
  PanelsTopLeft,
  Workflow,
} from "lucide-react";
import type { Architecture } from "@/data/architecture";

const icons = {
  interface: PanelsTopLeft,
  application: Braces,
  data: Database,
  worker: Workflow,
  scheduler: Clock3,
  queue: Network,
  integration: Cloud,
  observability: Activity,
};
type Wire = {
  from: string;
  to: string;
  path: string;
  kind: string;
};

export default function StackMap({
  architecture,
  infrastructure,
}: {
  architecture: Architecture;
  infrastructure: string[];
}) {
  const [viewId, setViewId] = useState(architecture.views[0].id);
  const view =
    architecture.views.find((item) => item.id === viewId) ??
    architecture.views[0];
  const [selected, setSelected] = useState(view.initialNode);
  const [wires, setWires] = useState<Wire[]>([]);
  const canvas = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const detailId = useId();
  const markerId = `${detailId.replace(/:/g, "")}-arrow`;

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const node = canvas.current?.querySelector<HTMLButtonElement>(
      `[data-node="${pendingFocus.current}"]`,
    );
    pendingFocus.current = null;
    node?.focus({ preventScroll: true });
    node?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [selected, view]);

  useLayoutEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      setWires(
        view.connections.flatMap((connection) => {
          const source = element.querySelector<HTMLElement>(
            `[data-node="${connection.from}"]`,
          );
          const target = element.querySelector<HTMLElement>(
            `[data-node="${connection.to}"]`,
          );
          if (!source || !target) return [];
          const a = source.getBoundingClientRect();
          const b = target.getBoundingClientRect();
          const sameColumn =
            source.closest(".architecture-column") ===
            target.closest(".architecture-column");
          const forward = a.left < b.left;
          const x1 =
            (sameColumn || forward ? a.right + 3 : a.left - 3) - bounds.left;
          const y1 = a.top + a.height / 2 - bounds.top;
          const x2 =
            (sameColumn || !forward ? b.right + 6 : b.left - 6) - bounds.left;
          const y2 = b.top + b.height / 2 - bounds.top;
          const middle = (x1 + x2) / 2;
          const path = sameColumn
            ? `M ${x1} ${y1} C ${x1 + 32} ${y1}, ${x2 + 32} ${y2}, ${x2} ${y2}`
            : `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2} ${y2}`;
          return [
            {
              ...connection,
              path,
            },
          ];
        }),
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element
      .querySelectorAll<HTMLElement>("[data-node]")
      .forEach((node) => observer.observe(node));
    measure();
    return () => observer.disconnect();
  }, [view]);

  const active =
    view.nodes.find((node) => node.id === selected) ?? view.nodes[0];
  const connections = view.connections.filter(
    (edge) => edge.from === active.id || edge.to === active.id,
  );
  const connectedIds = new Set(
    connections.flatMap((edge) => [edge.from, edge.to]),
  );
  const ActiveIcon = icons[active.kind];

  const renderDetails = (inline = false) => (
    <div
      className={`architecture-details ${inline ? "architecture-inline-details" : ""}`}
      id={inline ? `${detailId}-mobile` : detailId}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="architecture-detail-heading">
        <ActiveIcon size={18} />
        <h3>{active.name}</h3>
        <span>{active.technology}</span>
      </div>
      <p>{active.text}</p>
      {connections.length > 0 && (
        <div className="architecture-connections">
          <span>CONNECTIONS</span>
          {connections.map((edge) => {
            const other = view.nodes.find(
              (node) =>
                node.id === (edge.from === active.id ? edge.to : edge.from),
            )!;
            const outgoing = edge.from === active.id;
            const direction = outgoing ? "To" : "From";
            return (
              <button
                type="button"
                key={`${edge.from}-${edge.to}`}
                onClick={() => {
                  pendingFocus.current = other.id;
                  setSelected(other.id);
                }}
                aria-label={`${direction} ${other.name}: ${edge.label}. Explore component`}
              >
                {outgoing ? (
                  <ArrowRight size={12} aria-hidden="true" />
                ) : (
                  <ArrowLeft size={12} aria-hidden="true" />
                )}
                <span className="architecture-connection-direction">
                  {direction}
                </span>
                {other.name}
                <span>{edge.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="architecture-map">
      <div className="architecture-header">
        <span>
          <Layers3 size={14} /> SYSTEM OVERVIEW
        </span>
        <span>
          {view.nodes.length} COMPONENTS <ArrowDownRight size={13} />
        </span>
      </div>
      <div
        className="architecture-view-picker"
        role="group"
        aria-label="Architecture views"
      >
        {architecture.views.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={view.id === item.id}
            aria-controls={`${detailId}-canvas`}
            onClick={() => {
              setViewId(item.id);
              setSelected(item.initialNode);
            }}
          >
            {item.id === "observability" ? (
              <Activity size={14} />
            ) : (
              <Layers3 size={14} />
            )}
            {item.label}
          </button>
        ))}
      </div>
      <p className="architecture-view-description">{view.description}</p>
      <ul className="architecture-legend" aria-label="Connection types">
        {(
          [
            { kind: "application", label: "Application traffic" },
            { kind: "telemetry", label: "Telemetry flow" },
            { kind: "query", label: "Query direction" },
          ] as const
        )
          .filter((item) =>
            view.connections.some((edge) => edge.kind === item.kind),
          )
          .map((item) => (
            <li key={item.kind}>
              <span
                className={`architecture-legend-line architecture-legend-${item.kind}`}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
      </ul>
      <div
        className="architecture-canvas"
        ref={canvas}
        id={`${detailId}-canvas`}
        data-view={view.id}
      >
        <svg className="architecture-wires" aria-hidden="true">
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="8"
              markerHeight="8"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#66707b" />
            </marker>
            <marker
              id={`${markerId}-active`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="8"
              markerHeight="8"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="var(--case-accent)" />
            </marker>
          </defs>
          {wires.map((wire) => (
            <g
              key={`${wire.from}-${wire.to}`}
              className={`architecture-wire-${wire.kind} ${wire.from === active.id || wire.to === active.id ? "is-active" : ""}`}
            >
              <path
                d={wire.path}
                markerEnd={`url(#${markerId}${wire.from === active.id || wire.to === active.id ? "-active" : ""})`}
              />
            </g>
          ))}
        </svg>
        {view.columns.map((column, index) => (
          <div className="architecture-column" key={column.id}>
            <div className="architecture-column-label">
              <span>0{index + 1}</span>
              {column.label}
            </div>
            <div className="architecture-nodes">
              {view.nodes
                .filter((node) => node.column === column.id)
                .map((node) => {
                  const Icon = icons[node.kind];
                  return (
                    <div key={node.id}>
                      <button
                        type="button"
                        data-node={node.id}
                        className={`architecture-node ${active.id === node.id ? "is-selected" : connectedIds.has(node.id) ? "is-connected" : ""}`}
                        onClick={() => setSelected(node.id)}
                        aria-pressed={active.id === node.id}
                        aria-controls={`${detailId} ${detailId}-mobile`}
                      >
                        <span
                          className={`architecture-node-icon architecture-icon-${node.kind}`}
                        >
                          <Icon size={19} strokeWidth={1.5} />
                        </span>
                        <span className="architecture-node-copy">
                          <strong>{node.name}</strong>
                          <span>{node.technology}</span>
                        </span>
                        <span
                          className="architecture-node-port"
                          aria-hidden="true"
                        />
                      </button>
                      {active.id === node.id && renderDetails(true)}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      {renderDetails()}
      <div className="architecture-footer">
        <span>
          {view.id === "observability"
            ? "SIGNALS & DIAGNOSTICS"
            : "APPLICATION DEPENDENCIES"}
        </span>
        <div>
          <span className="architecture-footer-label">Infrastructure</span>
          {infrastructure.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
