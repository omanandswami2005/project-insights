/**
 * A-5 — POST /api/reality  🚀 Project HUB
 *
 * Takes the team's real constraints and returns a plan sized to them, plus the
 * architecture (F3, required output #5). The plan screen renders all of it.
 */

import { NextResponse } from 'next/server'
import { planProject } from '@/lib/services/plan'
import { get, patch } from '@/lib/services/store'
import { DEMO_ANALYSIS } from '@/lib/fixtures'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const clamp = (v, lo, hi, fallback) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : fallback
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Send a JSON body.' }, { status: 400 })
  }

  const id = String(body?.id ?? '')
  const analysis = (id && id !== 'demo' ? get(id) : null) ?? DEMO_ANALYSIS

  const teamSize = clamp(body?.teamSize, 1, 6, 2)
  const weeks = clamp(body?.weeks, 1, 16, 6)
  const skills = Array.isArray(body?.skills) ? body.skills.map(String).slice(0, 10) : []
  const budget = ['0', 'low', 'high'].includes(body?.budget) ? body.budget : '0'

  try {
    const { reality, architecture } = await planProject({
      idea: analysis.idea,
      evidence: analysis.evidence,
      novelty: analysis.novelty,
      teamSize,
      weeks,
      skills,
      budget,
    })

    // Persist so the export brief and a page refresh see the same plan.
    if (id && id !== 'demo') patch(id, { reality, architecture })

    return NextResponse.json(reality, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[reality] failed:', err?.message || err)
    // The plan screen falls back to fixtures on a non-ok response, so a 500
    // here still leaves the user with a coherent screen.
    return NextResponse.json({ error: 'Planning failed.' }, { status: 500 })
  }
}
