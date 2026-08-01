/**
 * A-4 — POST /api/analyze
 *
 * Starts a pipeline run and returns immediately with an id. The live view polls
 * GET /api/analyze/[id] every 800ms and renders `progress[]` as each stage
 * reports in — so the stages must be marked done as they finish, not at the end.
 */

import { NextResponse } from 'next/server'
import { emptyAnalysis } from '@/lib/types'
import { makeId } from '@/lib/utils'
import { deepsearch } from '@/lib/services/deepsearch'
import { verifyAll, unverifiedNotes } from '@/lib/services/verify'
import { cluster } from '@/lib/services/cluster'
import { markStep, patch, put } from '@/lib/services/store'
import { DEMO_ANALYSIS } from '@/lib/fixtures'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The pipeline. Runs detached from the request — every stage is wrapped so a
 * failure degrades that stage rather than killing the run.
 */
async function runPipeline(id, idea) {
  const t0 = Date.now()

  try {
    // 1 + 2 — DeepSearch (papers and web run in parallel inside deepsearch()).
    let evidence = await deepsearch(idea)
    markStep(id, 'deepsearch', Date.now() - t0)
    markStep(id, 'papers', Date.now() - t0)
    patch(id, { status: 'verifying', evidence })

    // 3 — Verification. The kill shot.
    evidence = await verifyAll(evidence)
    markStep(id, 'verifying', Date.now() - t0)
    patch(id, { status: 'clustering', evidence, unverified: unverifiedNotes(evidence) })

    // 4 — Clustering, novelty, graph, comparisons.
    const { novelty, graph, comparisons } = await cluster(idea, evidence)
    markStep(id, 'clustering', Date.now() - t0)
    patch(id, { status: 'planning', novelty, graph, comparisons })

    // 5 — The plan itself is produced on demand by /api/reality, once the user
    // tells us their team size and weeks. Nothing to compute without that.
    markStep(id, 'planning', Date.now() - t0)
    patch(id, {
      status: 'done',
      summary:
        novelty?.verdict ||
        `Analysed ${evidence.length} sources across the idea space.`,
    })
  } catch (err) {
    console.error('[analyze] pipeline failed:', err?.message || err)
    // Never leave the user staring at a spinner — fall back to the demo payload
    // so the screen still renders something coherent.
    patch(id, {
      ...DEMO_ANALYSIS,
      id,
      idea,
      status: 'done',
      unverified: [
        ...DEMO_ANALYSIS.unverified,
        'This run fell back to reference data because the live pipeline failed.',
      ],
    })
  }
}

export async function POST(request) {
  let idea = ''
  try {
    const body = await request.json()
    idea = String(body?.idea ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'Send a JSON body with an "idea" field.' }, { status: 400 })
  }

  if (!idea) {
    return NextResponse.json({ error: 'Describe what you want to build.' }, { status: 400 })
  }
  if (idea.length > 500) idea = idea.slice(0, 500)

  const id = makeId('an')
  put({ ...emptyAnalysis(idea, id), status: 'searching' })

  // Detached on purpose — the client polls for progress.
  runPipeline(id, idea)

  return NextResponse.json({ id })
}
