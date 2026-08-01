'use client'

import Link from 'next/link'
import { statusClass } from '@/lib/utils'

const GLYPH = { verified: '✅', stale: '⚠️', dead: '❌', unverified: '·' }

function scoreColor(n) {
  if (n >= 85) return 'var(--color-dead)'
  if (n >= 40) return 'var(--color-stale)'
  return 'var(--color-verified)'
}

/**
 * The insight rail. Section order IS the argument the product makes —
 * do not rearrange. docs/UI-SPEC.md §6.2
 */
export default function InsightRail({ analysis, selectedNode, planHref }) {
  const novelty = analysis.novelty
  const rows = selectedNode
    ? analysis.evidence.filter((e) => selectedNode.evidenceIds?.includes(e.id))
    : analysis.evidence.slice(0, 6)

  return (
    <div className="flex flex-col gap-4">
      {/* A. verdict */}
      {novelty ? (
        <div className="panel p-5">
          <p className="eyebrow mb-0">saturation</p>
          <div className="mt-1.5 flex items-baseline gap-3">
            <span
              className="data text-[56px] font-semibold leading-none"
              style={{ color: scoreColor(novelty.saturationScore) }}
            >
              {novelty.saturationScore}
            </span>
            <span className="text-muted">
              {novelty.saturationScore >= 60 ? 'crowded' : 'open'}
            </span>
          </div>
          <div className="bar-track mt-2.5">
            <div
              className="h-full"
              style={{
                width: `${novelty.saturationScore}%`,
                background: scoreColor(novelty.saturationScore),
              }}
            />
          </div>
          <p className="mt-3.5 text-[14px]">{novelty.verdict}</p>
        </div>
      ) : null}

      {/* B. clusters */}
      {novelty?.clusters?.length ? (
        <div className="panel p-5">
          <p className="eyebrow mb-2.5">approach clusters</p>
          {novelty.clusters.map((c) => {
            const max = Math.max(...novelty.clusters.map((x) => x.size))
            return (
              <div key={c.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="text-[14px]">{c.name}</span>
                  <span className="data text-[12px] text-muted">{c.size}</span>
                </div>
                <div className="bar-track mt-1.5 h-[5px]">
                  <div
                    className="h-full bg-muted"
                    style={{ width: `${(c.size / max) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {/* C. white space — the payoff, so give it weight */}
      {novelty?.whiteSpace?.length ? (
        <div
          className="panel p-5"
          style={{ borderLeft: '2px solid var(--color-verified)' }}
        >
          <p className="data text-verified text-[12px] uppercase tracking-[0.1em]">
            🎯 white space
          </p>
          {novelty.whiteSpace.map((w, i) => (
            <div key={i} className="mt-3.5 flex gap-3">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2"
                style={{ borderColor: 'var(--color-verified)' }}
              />
              <p className="text-[14px]">{w}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* D. evidence ledger */}
      <div className="panel p-5">
        <p className="eyebrow mb-2.5">
          evidence ledger{selectedNode ? ` · ${selectedNode.label}` : ''}
        </p>
        {rows.length ? (
          rows.map((e) => (
            <div key={e.id} className="flex gap-3 border-b border-line py-2.5 last:border-0">
              <span className={statusClass(e.verify)}>{GLYPH[e.verify]}</span>
              <div className="min-w-0 flex-1">
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[14px] hover:underline"
                >
                  {e.title}
                </a>
                <p className="data mt-0.5 text-[11px] text-muted">
                  {e.sourceType}
                  {e.publishedAt ? ` · ${e.publishedAt.slice(0, 7)}` : ''}
                  {e.corroborated ? ' · corroborated' : ''}
                </p>
                <div className="bar-track mt-1.5 h-[4px] max-w-[140px]">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.round(e.confidence * 100)}%`,
                      background: 'var(--color-muted)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[13px] text-muted">No evidence attached to this node.</p>
        )}
      </div>

      {/* E. the honesty panel — never hidden, never collapsed */}
      <div
        className="rounded-[var(--radius-card)] border border-line p-5"
        style={{ background: 'var(--color-surface-2)' }}
      >
        <p className="eyebrow mb-0">⚠ what i could not verify</p>
        {analysis.unverified?.length ? (
          analysis.unverified.map((u, i) => (
            <p key={i} className="mt-2.5 text-[13px] text-muted">
              {u}
            </p>
          ))
        ) : (
          <p className="mt-2.5 text-[13px] text-muted">Nothing outstanding on this run.</p>
        )}
      </div>

      <Link href={planHref} className="btn text-center" data-agent-id="results.checkBuildability">
        Check what I can actually build →
      </Link>
    </div>
  )
}
