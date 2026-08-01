/**
 * PLACEHOLDER — Lane B owns this file (item B-1).
 * Replace entirely with the intake screen per docs/UI-SPEC.md §4.
 * It exists only so `pnpm dev` renders something at T+0.
 */
import { DEMO_ANALYSIS } from '@/lib/fixtures'

export default function Home() {
  const a = DEMO_ANALYSIS
  return (
    <main className="mx-auto flex min-h-screen max-w-[680px] flex-col justify-center gap-8 px-6 py-16">
      <p className="data text-xs text-muted">project-insights · wave 0 scaffold</p>

      <h1 className="text-4xl font-medium">What do you want to build?</h1>

      <div className="panel p-4">
        <p className="text-sm text-muted">
          Lane B replaces this file with the real intake screen (B-1). The fixture below proves the
          contract loads — if you can read the numbers, <code className="data">lib/fixtures.js</code>{' '}
          is wired correctly.
        </p>
      </div>

      <div className="panel space-y-3 p-5">
        <p className="data text-xs text-muted">CONTRACT CHECK</p>
        <p className="text-sm">{a.idea}</p>
        <div className="data flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
          <span>saturation {a.novelty.saturationScore}</span>
          <span>evidence {a.evidence.length}</span>
          <span>nodes {a.graph.nodes.length}</span>
          <span>comparisons {a.comparisons.length}</span>
          <span>buildability {a.reality.buildabilityScore}</span>
          <span>unverified {a.unverified.length}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="status-verified data rounded-full border px-2 py-0.5 text-[11px]">
            VERIFIED
          </span>
          <span className="status-stale data rounded-full border px-2 py-0.5 text-[11px]">STALE</span>
          <span className="status-dead data rounded-full border px-2 py-0.5 text-[11px]">DEAD</span>
        </div>
      </div>

      <p className="data text-center text-xs text-muted">
        verified against live sources · nothing recalled from memory
      </p>
    </main>
  )
}
