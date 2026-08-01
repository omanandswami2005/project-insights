/**
 * A-3 — Knowledge Clustering + the novelty moat. 🧠 Layer 2 component.
 *
 * One structured-output call turns raw evidence into: approach clusters, a
 * saturation score, the white space, the knowledge graph, and the existing-
 * solution comparison (F2, required output #3).
 *
 * The `verdict` must show its scoring math. Every competitor's ranking logic is
 * opaque; ours is the pitch.
 */

import { askJson } from './llm'
import { deriveFallback } from './fallback'
import { DEMO_COMPARISONS, DEMO_GRAPH, DEMO_NOVELTY } from '@/lib/fixtures'

/** Structured-output schema. Mirrors lib/types.js exactly. */
const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['saturationScore', 'verdict', 'clusters', 'whiteSpace', 'graph', 'comparisons'],
  properties: {
    saturationScore: {
      type: 'integer',
      description: 'How crowded this idea space is, 0-100. Higher means more crowded.',
    },
    verdict: {
      type: 'string',
      description:
        'One or two sentences. MUST state the scoring reasoning — the inputs and how they combined into the number — not just a label.',
    },
    clusters: {
      type: 'array',
      description: '3-5 distinct approach clusters, ordered largest first.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'name', 'size', 'summary'],
        properties: {
          id: { type: 'string', description: 'Short slug, e.g. c1' },
          name: { type: 'string' },
          size: { type: 'integer', description: 'Roughly how many known efforts sit here' },
          summary: { type: 'string', description: 'One sentence, including how saturated it is' },
        },
      },
    },
    whiteSpace: {
      type: 'array',
      description:
        '2-4 specific gaps nobody has covered. Concrete and checkable — not "more research needed".',
      items: { type: 'string' },
    },
    graph: {
      type: 'object',
      additionalProperties: false,
      required: ['nodes', 'edges'],
      properties: {
        nodes: {
          type: 'array',
          description:
            'One problem node, one node per approach, one per notable paper/repo/dataset, and one per white-space gap.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['id', 'label', 'kind', 'evidenceIds'],
            properties: {
              id: { type: 'string' },
              label: { type: 'string', description: 'Under 40 characters' },
              kind: {
                type: 'string',
                enum: ['problem', 'approach', 'paper', 'repo', 'dataset', 'gap'],
              },
              evidenceIds: {
                type: 'array',
                description: 'Evidence ids backing this node. Use only ids from the input.',
                items: { type: 'string' },
              },
            },
          },
        },
        edges: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['source', 'target', 'relation'],
            properties: {
              source: { type: 'string' },
              target: { type: 'string' },
              relation: { type: 'string', description: 'Two or three words' },
            },
          },
        },
      },
    },
    comparisons: {
      type: 'array',
      description: '3-5 existing solutions, real ones drawn from the evidence.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'approach', 'strengths', 'weaknesses', 'missing', 'url'],
        properties: {
          name: { type: 'string' },
          approach: { type: 'string', description: 'One sentence' },
          strengths: { type: 'array', items: { type: 'string' } },
          weaknesses: { type: 'array', items: { type: 'string' } },
          missing: {
            type: 'string',
            description: 'What this solution fails to address — should point at the white space',
          },
          url: { type: 'string', description: 'Empty string if unknown' },
        },
      },
    },
  },
}

const SYSTEM = `You analyse whether a student's project idea is already crowded, and where the real opportunity is.

Rules:
- Ground every claim in the supplied evidence. Do not invent products, papers, or repositories.
- The saturation score must be defensible. State the inputs you used and how they combined — a reader should be able to check your arithmetic.
- White space must be specific and checkable. "More research is needed" is a failure; "nobody forecasts from the mess menu itself" is the standard.
- Graph node ids must be unique. Every edge must reference node ids you actually emitted.
- evidenceIds must only contain ids present in the input evidence.
- Be honest when the idea is genuinely novel — a low score is a valid answer.`

/**
 * @param {string} idea
 * @param {import('@/lib/types').Evidence[]} evidence
 * @returns {Promise<{novelty: import('@/lib/types').Novelty, graph: import('@/lib/types').Graph, comparisons: import('@/lib/types').Comparison[]}>}
 */
export async function cluster(idea, evidence = []) {
  const digest = evidence
    .map(
      (e) =>
        `- [${e.id}] (${e.sourceType}${e.verify === 'dead' ? ', DEAD' : e.verify === 'stale' ? ', STALE' : ''}) ${e.title} — ${e.url}`
    )
    .join('\n')

  const result = await askJson({
    system: SYSTEM,
    prompt: `Student's idea: "${idea}"

Evidence gathered and verified (dead and stale resources are marked — factor that into saturation, since abandoned attempts say something about the space):

${digest || '(no evidence retrieved)'}

Analyse the idea space.`,
    schema: SCHEMA,
    maxTokens: 16000,
    effort: 'medium',
  })

  if (!result) {
    // Claude unavailable (no key, no credit, rate limit, refusal).
    //
    // If we have real evidence, derive the clustering from it arithmetically —
    // the fixture graph's evidenceIds reference fixture evidence, so pairing it
    // with a live evidence array leaves every node resolving to nothing.
    // With no evidence either, the fixtures are all that's left.
    return evidence.length
      ? deriveFallback(idea, evidence)
      : { novelty: DEMO_NOVELTY, graph: DEMO_GRAPH, comparisons: DEMO_COMPARISONS }
  }

  // Drop edges pointing at nodes the model didn't emit — the canvas would
  // silently skip them anyway, but a clean graph is easier to reason about.
  const ids = new Set((result.graph?.nodes ?? []).map((n) => n.id))
  const edges = (result.graph?.edges ?? []).filter((e) => ids.has(e.source) && ids.has(e.target))

  // Partial results are the norm, not the exception. Smaller models reliably
  // produce good prose (verdict, white space) while leaving deeply nested
  // arrays-of-objects empty. Rather than discard a good analysis over one
  // missing field, backfill each empty structure from the evidence we actually
  // retrieved — so the screen is always complete and everything shown is real.
  const derived = deriveFallback(idea, evidence)

  return {
    novelty: {
      saturationScore: Math.min(100, Math.max(0, result.saturationScore ?? derived.novelty.saturationScore)),
      verdict: result.verdict?.trim() || derived.novelty.verdict,
      clusters: result.clusters?.length ? result.clusters : derived.novelty.clusters,
      whiteSpace: result.whiteSpace?.length ? result.whiteSpace : derived.novelty.whiteSpace,
    },
    graph: result.graph?.nodes?.length ? { nodes: result.graph.nodes, edges } : derived.graph,
    comparisons: result.comparisons?.length ? result.comparisons : derived.comparisons,
  }
}
