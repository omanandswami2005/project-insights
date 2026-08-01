/**
 * Derives a real clustering result from the evidence we actually retrieved,
 * for when the LLM is unavailable (no key, no credit, rate limited, refused).
 *
 * Why this exists instead of returning the fixtures: the fixture graph's
 * `evidenceIds` reference fixture evidence. Pair it with a *live* evidence
 * array and every node resolves to nothing — clicking a node shows an empty
 * ledger. Deriving from real data keeps the screen coherent, and everything
 * shown is genuinely something we found and checked.
 *
 * This is deliberately arithmetic, not intelligence. It cannot name a research
 * gap. It says so plainly rather than inventing one.
 */

/** @typedef {import('@/lib/types').Evidence} Evidence */

const CLUSTER_LABEL = {
  repo: 'Open-source implementations',
  paper: 'Academic research',
  dataset: 'Available datasets',
  article: 'Commercial and written-up solutions',
  api: 'APIs and data sources',
  forum: 'Community reports',
  learning: 'Learning material',
}

const NODE_KIND = {
  repo: 'repo',
  paper: 'paper',
  dataset: 'dataset',
  api: 'dataset',
  article: 'approach',
  forum: 'approach',
  learning: 'approach',
}

function groupBy(evidence, key) {
  const out = new Map()
  for (const e of evidence) {
    const k = e[key]
    if (!out.has(k)) out.set(k, [])
    out.get(k).push(e)
  }
  return out
}

/**
 * @param {string} idea
 * @param {Evidence[]} evidence
 * @returns {{novelty: import('@/lib/types').Novelty, graph: import('@/lib/types').Graph, comparisons: import('@/lib/types').Comparison[]}}
 */
export function deriveFallback(idea, evidence = []) {
  const byType = groupBy(evidence, 'sourceType')
  const repos = byType.get('repo') ?? []
  const papers = byType.get('paper') ?? []
  const dead = evidence.filter((e) => e.verify === 'dead')
  const stale = evidence.filter((e) => e.verify === 'stale')
  const live = evidence.filter((e) => e.verify === 'verified')

  // Saturation from observable quantities only — and we show the arithmetic.
  const volume = Math.min(60, evidence.length * 2.5)
  const implementations = Math.min(25, repos.length * 3)
  const literature = Math.min(15, papers.length * 2)
  const raw = Math.round(volume + implementations + literature)
  const saturationScore = Math.min(95, Math.max(5, raw))

  const abandonment = evidence.length
    ? Math.round(((dead.length + stale.length) / evidence.length) * 100)
    : 0

  const verdict =
    `Scored from what we retrieved and checked, not from a model: ` +
    `${evidence.length} sources (${Math.round(volume)} pts) + ` +
    `${repos.length} implementations (${implementations} pts) + ` +
    `${papers.length} papers (${literature} pts) = ${saturationScore}/100. ` +
    (abandonment >= 25
      ? `${abandonment}% of what exists is dead or stale — people have tried this and stopped, which is worth understanding before you start.`
      : `${live.length} of ${evidence.length} resources are alive and maintained.`)

  // One cluster per source type we actually found, largest first.
  const clusters = [...byType.entries()]
    .filter(([type]) => CLUSTER_LABEL[type])
    .map(([type, items], i) => {
      const d = items.filter((e) => e.verify === 'dead' || e.verify === 'stale').length
      return {
        id: `c${i + 1}`,
        name: CLUSTER_LABEL[type],
        size: items.length,
        summary: d
          ? `${items.length} found, ${d} of them dead or unmaintained.`
          : `${items.length} found, all currently reachable.`,
      }
    })
    .sort((a, b) => b.size - a.size)

  // Honest about what arithmetic cannot tell you.
  const whiteSpace = [
    dead.length + stale.length > 0
      ? `${dead.length + stale.length} of the ${evidence.length} resources found are dead or unmaintained — the abandoned attempts are worth reading before you commit to an approach.`
      : `Everything found here is currently maintained, which usually means the space is active rather than solved.`,
    repos.length === 0
      ? 'No open-source implementation surfaced at all — either genuinely unbuilt, or built somewhere our search does not reach.'
      : `${repos.length} implementations exist. The opportunity is unlikely to be building another one — look at what they all skip.`,
    'Naming the specific research gap needs the language model, which was unavailable on this run. Everything above is measured, not inferred.',
  ]

  // Graph: problem at the centre, one node per cluster, real evidence hanging
  // off each. Every evidenceId here exists in the live evidence array.
  const nodes = [
    {
      id: 'n0',
      label: idea.length > 38 ? `${idea.slice(0, 37)}…` : idea,
      kind: 'problem',
      evidenceIds: evidence.slice(0, 6).map((e) => e.id),
    },
  ]
  const edges = []

  let ni = 1
  for (const [type, items] of byType.entries()) {
    if (!CLUSTER_LABEL[type]) continue
    const groupId = `g${ni}`
    nodes.push({
      id: groupId,
      label: CLUSTER_LABEL[type],
      kind: 'approach',
      evidenceIds: items.map((e) => e.id),
    })
    edges.push({ source: 'n0', target: groupId, relation: 'addressed by' })

    // Attach the strongest few items in each group as their own nodes.
    for (const e of items.slice(0, 3)) {
      const leafId = `${groupId}_${ni}_${e.id}`
      nodes.push({
        id: leafId,
        label: e.title.length > 34 ? `${e.title.slice(0, 33)}…` : e.title,
        kind: NODE_KIND[type] ?? 'approach',
        evidenceIds: [e.id],
      })
      edges.push({ source: groupId, target: leafId, relation: 'includes' })
    }
    ni += 1
  }

  if (dead.length || stale.length) {
    nodes.push({
      id: 'gap1',
      label: `GAP — ${dead.length + stale.length} abandoned attempts`,
      kind: 'gap',
      evidenceIds: [...dead, ...stale].map((e) => e.id),
    })
    edges.push({ source: 'n0', target: 'gap1', relation: 'unresolved in' })
  }

  // Comparisons from the most credible non-repo sources we verified.
  const comparisons = evidence
    .filter((e) => e.verify !== 'unverified' && ['article', 'repo'].includes(e.sourceType))
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0) || b.confidence - a.confidence)
    .slice(0, 4)
    .map((e) => ({
      name: e.title,
      approach: e.sourceType === 'repo' ? 'Open-source implementation' : 'Existing written-up solution',
      strengths: [
        e.verify === 'verified' ? 'Currently maintained and reachable' : 'Exists and is documented',
        e.stars != null ? `${e.stars.toLocaleString()} GitHub stars` : 'Publicly available',
        e.license ? `${e.license} licensed` : 'Directly inspectable',
      ].filter(Boolean),
      weaknesses:
        e.verify === 'dead'
          ? ['No longer available', 'Cannot be built on']
          : e.verify === 'stale'
            ? ['Unmaintained', e.verifyNote || 'No recent activity']
            : [e.license ? 'Licence terms may constrain reuse' : 'No licence declared'],
      missing:
        'A detailed gap analysis needs the language model, which was unavailable on this run. Verification status above is live and accurate.',
      url: e.url,
    }))

  return {
    novelty: { saturationScore, verdict, clusters, whiteSpace },
    graph: { nodes, edges },
    comparisons,
  }
}
