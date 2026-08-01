/**
 * THE CONTRACT — frozen at T+15. Do not change without telling both other lanes out loud.
 *
 * We're on plain JS, so nothing here is enforced at build time. Two habits make it work:
 *   1. Annotate where you consume it:
 *        /** @type {import('@/lib/types').Analysis} *\/
 *        const analysis = ...
 *      VS Code then autocompletes every field.
 *   2. Defend every optional field. `novelty`, `reality` and `architecture` are absent
 *      until their pipeline stage finishes. `a.novelty?.saturationScore ?? 0` — a bare
 *      dot will white-screen the demo and nothing warns you at build time.
 *
 * lib/fixtures.js is the executable version of this file. When in doubt, read that.
 */

/** @typedef {'paper'|'repo'|'dataset'|'api'|'article'|'forum'|'learning'} SourceType */
/** @typedef {'verified'|'stale'|'dead'|'unverified'} VerifyStatus */
/** @typedef {'problem'|'approach'|'paper'|'repo'|'dataset'|'gap'} NodeKind */
/** @typedef {'pending'|'searching'|'verifying'|'clustering'|'planning'|'done'|'error'} AnalysisStatus */
/** @typedef {'en'|'hi'|'mr'} Language */

/**
 * One retrieved, verified source.
 * @typedef {Object} Evidence
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {SourceType} sourceType
 * @property {string} [publishedAt]    ISO date
 * @property {VerifyStatus} verify
 * @property {string} [verifyNote]     human-readable, e.g. "archived · last commit 2021-03"
 * @property {string} [checkedAt]      ISO timestamp of the liveness check — powers "checked 4s ago"
 * @property {number} confidence       0-1
 * @property {boolean} corroborated    appeared in >= 2 independent sources
 * @property {number} [stars]          repos only
 * @property {string} [license]        repos only
 */

/**
 * @typedef {Object} GraphNode
 * @property {string} id
 * @property {string} label
 * @property {NodeKind} kind
 * @property {string[]} evidenceIds
 */

/** @typedef {{source: string, target: string, relation: string}} GraphEdge */
/** @typedef {{nodes: GraphNode[], edges: GraphEdge[]}} Graph */
/** @typedef {{id: string, name: string, size: number, summary: string}} Cluster */

/**
 * The moat: how crowded is this idea, and where is the white space.
 * @typedef {Object} Novelty
 * @property {number} saturationScore  0-100, higher = more crowded
 * @property {string} verdict          one line, and it must show its reasoning
 * @property {Cluster[]} clusters
 * @property {string[]} whiteSpace     the gaps nobody covered — the payoff
 */

/**
 * F2 — required output #3 "existing solution comparison".
 * @typedef {Object} Comparison
 * @property {string} name
 * @property {string} approach
 * @property {string[]} strengths
 * @property {string[]} weaknesses
 * @property {string} missing          what it fails to address — links to the white space
 * @property {string} [url]
 */

/**
 * F3 — required output #5 "project architecture".
 * @typedef {Object} Architecture
 * @property {string} mermaid          `flowchart TD ...` source, rendered client-side
 * @property {{name: string, role: string, tech: string}[]} components
 * @property {string} dataFlow
 */

/**
 * @typedef {Object} Milestone
 * @property {string} id
 * @property {string} title
 * @property {number} days
 * @property {string[]} tasks
 * @property {string} deliverable
 */

/** @typedef {{layer: string, choice: string, why: string, freeTier: boolean}} StackChoice */

/**
 * The second moat: a plan sized to the team that actually exists.
 * @typedef {Object} RealityCheck
 * @property {number} buildabilityScore  0-100
 * @property {string} verdict            one line, e.g. "feasible, if you cut"
 * @property {string[]} keep
 * @property {string[]} cut              show these proudly — cutting is the thesis
 * @property {StackChoice[]} stack
 * @property {Milestone[]} milestones    milestones[0] is ALWAYS a 48-hour vertical slice
 */

/** @typedef {{step: string, label: string, done: boolean, ms?: number}} ProgressStep */

/**
 * The whole payload. One analysis = one student idea.
 * @typedef {Object} Analysis
 * @property {string} id
 * @property {string} idea
 * @property {AnalysisStatus} status
 * @property {ProgressStep[]} progress
 * @property {string} [summary]
 * @property {Evidence[]} evidence
 * @property {Graph} graph
 * @property {Novelty} [novelty]              absent until clustering completes
 * @property {RealityCheck} [reality]         absent until the user submits the form
 * @property {Comparison[]} comparisons       F2
 * @property {Architecture} [architecture]    F3 — absent until planning completes
 * @property {Language} language              F4
 * @property {string[]} unverified            what we could NOT confirm — never hide this
 * @property {string} createdAt               ISO
 */

/** Pipeline stages, in order. Lane A writes these; Lane B renders them. */
export const PIPELINE_STEPS = [
  { step: 'deepsearch', label: 'Searching trusted sources' },
  { step: 'papers', label: 'Retrieving research papers' },
  { step: 'verifying', label: 'Verifying every resource is alive' },
  { step: 'clustering', label: 'Clustering approaches, scoring novelty' },
  { step: 'planning', label: 'Building the project plan' },
]

/** Colours are defined once, in app/globals.css. These are the class suffixes. */
export const VERIFY_LABEL = {
  verified: 'VERIFIED',
  stale: 'STALE',
  dead: 'DEAD',
  unverified: 'UNVERIFIED',
}

/** A blank Analysis — use this so no lane ever renders against undefined. */
export function emptyAnalysis(idea = '', id = 'pending') {
  return {
    id,
    idea,
    status: 'pending',
    progress: PIPELINE_STEPS.map((s) => ({ ...s, done: false })),
    evidence: [],
    graph: { nodes: [], edges: [] },
    comparisons: [],
    language: 'en',
    unverified: [],
    createdAt: new Date().toISOString(),
  }
}
