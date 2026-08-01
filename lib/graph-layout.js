/**
 * Fruchterman-Reingold force layout, computed once. No external library —
 * react-force-graph is 200kB and we need 18 nodes.
 *
 * Ported from the design prototype so the results screen looks identical.
 */

export const GRAPH_W = 760
export const GRAPH_H = 480

/**
 * @param {import('@/lib/types').Graph} graph
 * @param {() => number} [rng] injectable for deterministic layouts in tests
 * @returns {{id: string, label: string, kind: string, evidenceIds: string[], x: number, y: number}[]}
 */
export function computeLayout(graph, rng = Math.random) {
  const W = GRAPH_W
  const H = GRAPH_H

  const nodes = graph.nodes.map((n) => ({
    ...n,
    x: W / 2 + (rng() - 0.5) * 420,
    y: H / 2 + (rng() - 0.5) * 320,
  }))
  if (!nodes.length) return nodes

  const idx = {}
  nodes.forEach((n, i) => (idx[n.id] = i))

  // Drop edges pointing at nodes we don't have — a partial graph must not throw.
  const edges = graph.edges
    .map((e) => ({ s: idx[e.source], t: idx[e.target] }))
    .filter((e) => e.s !== undefined && e.t !== undefined)

  const k = Math.sqrt((W * H) / nodes.length) * 0.85
  let temp = 55

  for (let iter = 0; iter < 220; iter++) {
    const disp = nodes.map(() => ({ x: 0, y: 0 }))

    // Repulsion between every pair.
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = nodes[i].x - nodes[j].x
        let dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
        const force = (k * k) / dist
        const ux = dx / dist
        const uy = dy / dist
        disp[i].x += ux * force
        disp[i].y += uy * force
        disp[j].x -= ux * force
        disp[j].y -= uy * force
      }
    }

    // Attraction along edges.
    edges.forEach((e) => {
      const a = nodes[e.s]
      const b = nodes[e.t]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
      const force = (dist * dist) / k
      const ux = dx / dist
      const uy = dy / dist
      disp[e.s].x -= ux * force
      disp[e.s].y -= uy * force
      disp[e.t].x += ux * force
      disp[e.t].y += uy * force
    })

    // Gravity toward centre, then cool.
    nodes.forEach((n, i) => {
      disp[i].x += (W / 2 - n.x) * 0.012
      disp[i].y += (H / 2 - n.y) * 0.012
      const dlen = Math.sqrt(disp[i].x ** 2 + disp[i].y ** 2) || 0.01
      const lim = Math.min(dlen, temp)
      n.x += (disp[i].x / dlen) * lim
      n.y += (disp[i].y / dlen) * lim
      n.x = Math.max(28, Math.min(W - 28, n.x))
      n.y = Math.max(28, Math.min(H - 28, n.y))
    })

    temp *= 0.965
  }

  return nodes
}

/** Node radius scales with how much evidence backs it. */
export function nodeRadius(node) {
  const n = node.evidenceIds?.length ?? 0
  if (node.kind === 'problem') return 16
  return Math.min(13, 6 + n * 2)
}

/**
 * Fill for a node. Repos carry their own verify status — a dead repo is red
 * in the graph exactly as it is in the vault.
 * @param {*} node
 * @param {import('@/lib/types').Evidence[]} evidence
 */
export function nodeFill(node, evidence) {
  if (node.kind === 'gap') return 'transparent'
  if (node.kind === 'repo') {
    const ev = evidence.find((e) => node.evidenceIds?.includes(e.id))
    if (ev?.verify === 'dead') return 'var(--color-dead)'
    if (ev?.verify === 'stale') return 'var(--color-stale)'
    return 'var(--color-verified)'
  }
  return {
    problem: 'var(--color-node-problem)',
    approach: 'var(--color-node-approach)',
    paper: 'var(--color-node-paper)',
    dataset: 'var(--color-node-dataset)',
  }[node.kind] || 'var(--color-muted)'
}
