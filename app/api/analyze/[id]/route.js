/**
 * A-4 — GET /api/analyze/[id]
 *
 * Returns the full `Analysis`. The live view polls this every 800ms until
 * status is 'done'. Honour the contract in lib/types.js exactly — the UI reads
 * these field names directly.
 */

import { NextResponse } from 'next/server'
import { get } from '@/lib/services/store'
import { DEMO_ANALYSIS } from '@/lib/fixtures'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  const { id } = await params

  // The guaranteed-working demo path, with or without API keys.
  if (id === 'demo') return NextResponse.json(DEMO_ANALYSIS)

  const analysis = get(id)
  if (!analysis) {
    return NextResponse.json({ error: 'No such analysis.' }, { status: 404 })
  }

  return NextResponse.json(analysis, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
