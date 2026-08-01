/**
 * In-memory analysis store. No database — see CLAUDE.md's tech constraints.
 *
 * Held on globalThis so it survives Next's hot reload in dev. One process only;
 * that is a deliberate 2-hour-build trade, and the pitch covers persistence as
 * roadmap rather than pretending it exists.
 */

/** @type {Map<string, import('@/lib/types').Analysis>} */
const store = globalThis.__analysisStore ?? new Map()
globalThis.__analysisStore = store

const MAX_ENTRIES = 100

export function put(analysis) {
  // Cheap bound so a long demo session can't grow the heap forever.
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value
    store.delete(oldest)
  }
  store.set(analysis.id, analysis)
  return analysis
}

export function get(id) {
  return store.get(id) ?? null
}

/** Shallow-merge a patch into a stored analysis. Returns null if unknown. */
export function patch(id, changes) {
  const current = store.get(id)
  if (!current) return null
  const next = { ...current, ...changes }
  store.set(id, next)
  return next
}

/** Mark one pipeline step done, recording how long it took. */
export function markStep(id, step, ms) {
  const current = store.get(id)
  if (!current) return null
  return patch(id, {
    progress: current.progress.map((s) => (s.step === step ? { ...s, done: true, ms } : s)),
  })
}
