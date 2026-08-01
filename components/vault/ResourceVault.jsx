'use client'

import { useState } from 'react'
import { statusClass, timeAgo } from '@/lib/utils'
import { VERIFY_LABEL } from '@/lib/types'

const GLYPH = { verified: '✅', stale: '⚠️', dead: '❌', unverified: '·' }

const FILTERS = [
  { id: 'all', label: 'all' },
  { id: 'repo', label: 'repos' },
  { id: 'dataset', label: 'datasets' },
  { id: 'paper', label: 'papers' },
  { id: 'api', label: 'apis' },
  { id: 'learning', label: 'learning' },
]

const BORDER = {
  verified: 'var(--color-verified)',
  stale: 'var(--color-stale)',
  dead: 'var(--color-dead)',
  unverified: 'var(--color-line-bright)',
}

/**
 * The kill shot. Designed to be screenshot-able beside a raw ChatGPT answer —
 * it must read as more trustworthy from across a room. docs/UI-SPEC.md §6.3
 */
export default function ResourceVault({ evidence = [] }) {
  const [filter, setFilter] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const items = evidence.filter((e) => {
    if (filter !== 'all' && e.sourceType !== filter) return false
    if (verifiedOnly && e.verify !== 'verified') return false
    return true
  })

  return (
    <section className="mx-auto max-w-[1040px] px-6 py-14 sm:px-8">
      <p className="eyebrow">resource vault</p>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            data-active={filter === f.id}
            className="chip"
            data-agent-id="vault.filter"
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setVerifiedOnly((v) => !v)}
          data-active={verifiedOnly}
          className="chip"
          data-agent-id="vault.verifiedOnly"
        >
          verified only
        </button>
      </div>

      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((e) => {
            const dead = e.verify === 'dead'
            return (
              <a
                key={e.id}
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="panel block p-4 transition-opacity"
                style={{
                  borderLeft: `2px solid ${BORDER[e.verify]}`,
                  opacity: dead ? 0.7 : 1,
                }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`${statusClass(e.verify)} data text-[12px] font-semibold`}>
                    {GLYPH[e.verify]} {VERIFY_LABEL[e.verify]}
                  </span>
                  {/* This tiny line is the entire verification pitch. */}
                  <span className="data shrink-0 text-[10px] text-muted">
                    checked {timeAgo(e.checkedAt)}
                  </span>
                </div>

                <p
                  className="data mt-2 text-[14px]"
                  style={{ textDecoration: dead ? 'line-through' : 'none' }}
                >
                  {e.title}
                </p>

                {e.verifyNote ? (
                  <p className="data mt-1 text-[12px] text-muted">{e.verifyNote}</p>
                ) : null}

                <p className="data mt-2.5 text-[12px] text-muted">
                  {[
                    e.stars != null ? `★ ${e.stars.toLocaleString()}` : null,
                    e.license,
                    e.sourceType,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </a>
            )
          })}
        </div>
      ) : (
        <p className="text-[14px] text-muted">
          Nothing matches this filter. Clear it to see everything we checked.
        </p>
      )}
    </section>
  )
}
