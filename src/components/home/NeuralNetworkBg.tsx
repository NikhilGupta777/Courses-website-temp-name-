"use client";

// ─── Animated SVG neural network used as the hero background ────────────────
// Three layers of nodes (input, hidden, output) connected by edges. Nodes pulse
// with a stagger; one randomly chosen edge "fires" every couple of seconds.

import { useEffect, useState } from "react";

const NODE_RADIUS = 6;

// Layer geometry (relative units, scaled by viewBox)
const LAYERS = [
  { x: 80,   count: 5 },
  { x: 360,  count: 7 },
  { x: 640,  count: 6 },
  { x: 920,  count: 4 },
];

const VIEWBOX_W = 1000;
const VIEWBOX_H = 600;

interface Node {
  x: number;
  y: number;
  layer: number;
  index: number;
}

interface Edge {
  a: Node;
  b: Node;
}

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  for (let l = 0; l < LAYERS.length; l++) {
    const layer = LAYERS[l]!;
    const yStep = VIEWBOX_H / (layer.count + 1);
    for (let i = 0; i < layer.count; i++) {
      nodes.push({ x: layer.x, y: yStep * (i + 1), layer: l, index: i });
    }
  }
  const edges: Edge[] = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    const left  = nodes.filter((n) => n.layer === l);
    const right = nodes.filter((n) => n.layer === l + 1);
    for (const a of left) for (const b of right) edges.push({ a, b });
  }
  return { nodes, edges };
}

const { nodes, edges } = buildGraph();

export function NeuralNetworkBg() {
  // Track which edge is currently "firing" — random selection every 1.6s
  const [firingEdge, setFiringEdge] = useState<number>(0);

  useEffect(() => {
    const t = setInterval(() => {
      setFiringEdge((p) => (p + 1 + Math.floor(Math.random() * 5)) % edges.length);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      aria-hidden
    >
      <defs>
        <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#a78bfa" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#fff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
        </radialGradient>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      <g>
        {edges.map((e, i) => {
          const isFiring = i === firingEdge;
          return (
            <line
              key={i}
              x1={e.a.x}
              y1={e.a.y}
              x2={e.b.x}
              y2={e.b.y}
              stroke={isFiring ? "#c4b5fd" : "url(#edgeGrad)"}
              strokeWidth={isFiring ? 1.6 : 0.6}
              strokeOpacity={isFiring ? 0.9 : 0.45}
              filter={isFiring ? "url(#glow)" : undefined}
              style={{ transition: "stroke 0.4s, stroke-width 0.4s, stroke-opacity 0.4s" }}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {nodes.map((n, i) => (
          <g key={i}>
            {/* Halo */}
            <circle
              cx={n.x}
              cy={n.y}
              r={NODE_RADIUS * 3}
              fill="url(#nodeGrad)"
              opacity={0.5}
            >
              <animate
                attributeName="r"
                values={`${NODE_RADIUS * 2.5};${NODE_RADIUS * 4.2};${NODE_RADIUS * 2.5}`}
                dur="3.5s"
                begin={`${(i * 0.18) % 3.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.55;0.15;0.55"
                dur="3.5s"
                begin={`${(i * 0.18) % 3.5}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* Core */}
            <circle
              cx={n.x}
              cy={n.y}
              r={NODE_RADIUS}
              fill="#7c3aed"
              filter="url(#glow)"
            />
          </g>
        ))}
      </g>

      {/* Firing pulse — small bright dot travelling along the firing edge */}
      {(() => {
        const e = edges[firingEdge];
        if (!e) return null;
        return (
          <circle r="3" fill="#fff" filter="url(#glow)">
            <animate
              attributeName="cx"
              from={e.a.x}
              to={e.b.x}
              dur="1.2s"
              repeatCount="indefinite"
              key={`cx-${firingEdge}`}
            />
            <animate
              attributeName="cy"
              from={e.a.y}
              to={e.b.y}
              dur="1.2s"
              repeatCount="indefinite"
              key={`cy-${firingEdge}`}
            />
          </circle>
        );
      })()}
    </svg>
  );
}
