'use client'

import { statusClass } from '@/lib/utils'
import { VERIFY_LABEL } from '@/lib/types'

const GLYPH = { verified: '✅', stale: '⚠️', dead: '❌', unverified: '·' }

/**
 * The process is the spectacle — never a bare spinner. docs/UI-SPEC.md §5
 *
 * @param {{analysis: import('@/lib/types').Analysis, elapsed: number}} props
 */
export default function LiveAnalysis({ analysis, elapsed }) {
  const steps = analysis.progress ?? []
  const activeIdx = steps.findIndex((s) => !s.done)

  // Nodes and evidence reveal progressively as the pipeline reports in.
  const totalNodes = analysis.graph?.nodes?.length ?? 0
  const doneCount = steps.filter((s) => s.done).length
  const ratio = steps.length ? doneCount / steps.length : 0
  const visibleNodes = (analysis.graph?.nodes ?? []).slice(0, Math.ceil(totalNodes * ratio))
  const feed = (analysis.evidence ?? []).slice(0, Math.ceil((analysis.evidence?.length ?? 0) * ratio))

  return (
    <section className="mx-auto max-w-[1040px] px-6 py-10 sm:px-8">
      <p className="text-[18px] italic text-muted">&ldquo;{analysis.idea}&rdquo;</p>
      <div className="hr my-5" />

      {/* progress rows */}
      <div>
        {steps.map((s, i) => {
          const active = i === activeIdx
          return (
            <div
              key={s.step}
              className="flex items-baseline gap-3.5 py-2.5"
              style={{ opacity: s.done ? 0.55 : active ? 1 : 0.3 }}
            >
              <span className={s.done ? 'text-verified' : 'text-muted'}>
                {s.done ? '✓' : active ? '⠋' : '·'}
              </span>
              <span className="data w-[92px] shrink-0 text-[13px]">{s.step}</span>
              <span className="flex-1 text-[13px] text-muted">{s.label}</span>
              <span className="data text-[12px] text-muted">
                {s.done && s.ms ? `${(s.ms / 1000).toFixed(1)}s` : active ? '···' : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* graph assembling */}
      <div className="my-6 rounded-[10px] border border-dashed border-line p-7 text-center">
        <p className="data text-[12px] text-muted">
          graph assembling — {visibleNodes.length} / {totalNodes} nodes
        </p>
        <div className="mx-auto mt-3.5 flex max-w-[520px] flex-wrap justify-center gap-2">
          {visibleNodes.map((n) => (
            <span
              key={n.id}
              className="data animate-rise rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
            >
              {n.label}
            </span>
          ))}
        </div>
      </div>

      {/* just verified — the moment a judge realises we actually check */}
      <p className="eyebrow mb-0 mt-6">just verified</p>
      <div className="hr my-3.5" />
      <div>
        {feed.map((e, i) => (
          <div
            key={e.id}
            className="animate-slide-in flex items-baseline gap-3 border-b border-line py-2.5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className={statusClass(e.verify)}>{GLYPH[e.verify]}</span>
            <span className="data flex-1 truncate text-[13px]">{e.title}</span>
            <span className={`${statusClass(e.verify)} data text-[11px]`}>
              {VERIFY_LABEL[e.verify]}
            </span>
            {e.stars ? (
              <span className="data text-[12px] text-muted">{e.stars.toLocaleString()}★</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
