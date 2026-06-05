"use client";

import { useState } from "react";
import { ArrowRight, Braces, Database, PanelsTopLeft } from "lucide-react";

type Layer = { label: string; technology: string; text: string; icon: string };
const icons = { interface: PanelsTopLeft, application: Braces, data: Database };

export default function StackMap({
  layers,
  infrastructure,
}: {
  layers: Layer[];
  infrastructure: string[];
}) {
  const [selected, setSelected] = useState(1);
  return (
    <div className="stack-map">
      <div className="stack-map-header">
        <span>STACK EXPLORER</span>
        <span>SELECT A LAYER ↗</span>
      </div>
      <div className="stack-layers">
        {layers.map((layer, index) => {
          const Icon = icons[layer.icon as keyof typeof icons] || Braces;
          return (
            <div className="stack-layer-wrap" key={layer.label}>
              <button
                className={`stack-layer ${selected === index ? "is-selected" : ""}`}
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                aria-controls="stack-description"
              >
                <div className="stack-layer-top">
                  <Icon size={21} strokeWidth={1.5} />
                  <span>0{index + 1}</span>
                </div>
                <span className="stack-label">{layer.label}</span>
                <strong>{layer.technology}</strong>
              </button>
              {index < layers.length - 1 && (
                <ArrowRight className="stack-connector" size={18} />
              )}
            </div>
          );
        })}
      </div>
      <div
        className="stack-description"
        id="stack-description"
        aria-live="polite"
      >
        <span className="stack-description-marker">↳</span>
        <div>
          <h3>{layers[selected].technology}</h3>
          <p>{layers[selected].text}</p>
        </div>
      </div>
      <div className="stack-infrastructure">
        <span>ALSO IN THE STACK</span>
        <div>
          {infrastructure.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
