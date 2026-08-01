'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { GRAPH_H, GRAPH_W, computeLayout, nodeFill, nodeRadius } from '@/lib/graph-layout'

/**
 * The hero surface. Plain SVG + our own force layout — react-force-graph is
 * 200kB for 18 nodes. docs/UI-SPEC.md §6.1
 *
 * @param {{graph: import('@/lib/types').Graph, evidence: import('@/lib/types').Evidence[],
 *          selectedId: string|null, onSelect: (id: string|null) => void}} props
 */
export default function Canvas({ graph, evidence = [], selectedId, onSelect }) {
  const [nodes, setNodes] = useState([])
  const [dragId, setDragId] = useState(null)
  const svgRef = useRef(null)

  // Layout runs once per graph — it's deterministic after mount, not animated.
  useEffect(() => {
    setNodes(computeLayout(graph))
  }, [graph])

  useEffect(() => {
    if (!dragId) return
    function move(e) {
      const svg = svgRef.current
      if (!svg) return
      const pt = svg.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const p = pt.matrixTransform(svg.getScreenCTM().inverse())
      setNodes((ns) => ns.map((n) => (n.id === dragId ? { ...n, x: p.x, y: p.y } : n)))
    }
    function up() {
      setDragId(null)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [dragId])

  const pos = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])

  // Selecting a node dims everything not connected to it.
  const connected = useMemo(() => {
    if (!selectedId) return null
    const set = new Set([selectedId])
    graph.edges.forEach((e) => {
      if (e.source === selectedId) set.add(e.target)
      if (e.target === selectedId) set.add(e.source)
    })
    return set
  }, [selectedId, graph.edges])

  function dim(id) {
    return connected && !connected.has(id) ? 0.15 : 1
  }

  return (
    <div className="panel flex h-full min-h-[420px] flex-col overflow-hidden">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
        className="w-full flex-1"
        style={{ background: 'var(--color-graph-bg)' }}
        onClick={() => onSelect(null)}
      >
        {graph.edges.map((e, i) => {
          const a = pos[e.source]
          const b = pos[e.target]
          if (!a || !b) return null
          const o = connected && !(connected.has(e.source) && connected.has(e.target)) ? 0.08 : 0.5
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--color-line-bright)"
              strokeWidth="1"
              opacity={o}
            />
          )
        })}

        {nodes.map((n) => {
          const r = nodeRadius(n)
          const isGap = n.kind === 'gap'
          const showLabel = n.kind === 'problem' || isGap || n.id === selectedId
          return (
            <g
              key={n.id}
              style={{ cursor: 'pointer', opacity: dim(n.id) }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setDragId(n.id)
              }}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(selectedId === n.id ? null : n.id)
              }}
              data-agent-id="graph.node"
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={nodeFill(n, evidence)}
                stroke={isGap ? 'var(--color-verified)' : 'none'}
                strokeWidth={isGap ? 2 : 0}
              />
              {n.id === selectedId ? (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 5}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth="1"
                />
              ) : null}
              {showLabel ? (
                <text
                  x={n.x}
                  y={n.y - r - 7}
                  textAnchor="middle"
                  fill="var(--color-ink)"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}
                >
                  {n.label.length > 34 ? `${n.label.slice(0, 34)}…` : n.label}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      <p className="data px-3.5 py-2 text-[10px] text-muted">
        drag nodes · click to inspect evidence
      </p>
    </div>
  )
}
