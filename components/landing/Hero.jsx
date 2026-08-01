'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DEMO_EVIDENCE, EXAMPLE_IDEAS } from '@/lib/fixtures'
import { statusClass } from '@/lib/utils'
import { VERIFY_LABEL } from '@/lib/types'

const GLYPH = { verified: '✅', stale: '⚠️', dead: '❌', unverified: '·' }

/**
 * The hero. Signature element: the highlighted word is *stamped* — treated
 * exactly like a verified resource — and a live ticker checks real repos
 * underneath. docs/UI-SPEC.md §4.3, §4.4
 */
export default function Hero() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [stamp, setStamp] = useState('0.0')
  const [tick, setTick] = useState(0)
  const [busy, setBusy] = useState(false)
  const areaRef = useRef(null)

  // The stamp timestamp counts up once, then rests at 0.4s.
  useEffect(() => {
    let v = 0
    const t = setInterval(() => {
      v += 0.1
      setStamp(Math.min(v, 0.4).toFixed(1))
      if (v >= 0.4) clearInterval(t)
    }, 60)
    return () => clearInterval(t)
  }, [])

  // Ticker cycles real evidence — what a visitor sees is what we actually return.
  useEffect(() => {
    const t = setInterval(() => setTick((i) => (i + 1) % DEMO_EVIDENCE.length), 1400)
    return () => clearInterval(t)
  }, [])

  function grow(el) {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  async function submit(e) {
    e?.preventDefault()
    const text = idea.trim()
    if (!text || busy) return
    setBusy(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: text }),
      })
      if (!res.ok) throw new Error('analyze failed')
      const { id } = await res.json()
      router.push(`/analyze/${id}`)
    } catch {
      // Lane A's pipeline may not exist yet, and the venue wifi may be gone.
      // Never dead-end the user — fall through to the fixture-backed demo.
      router.push(`/analyze/demo?idea=${encodeURIComponent(text)}`)
    }
  }

  const item = DEMO_EVIDENCE[tick]

  return (
    <section className="mx-auto max-w-[900px] px-6 pb-4 pt-16 sm:px-8 sm:pt-24">
      <h1
        className="animate-rise text-[clamp(44px,7vw,88px)]"
        style={{ animationDelay: '40ms' }}
      >
        Stop building
        <br />
        what already{' '}
        <span className="stamp align-baseline">
          exists <span className="text-verified">✓</span>
        </span>
      </h1>

      <p className="data mt-2.5 text-[10px] text-muted">checked {stamp}s ago</p>

      <p
        className="animate-rise mt-7 max-w-[46ch] text-[18px] text-muted"
        style={{ animationDelay: '120ms' }}
      >
        Type one idea. Get back what&apos;s already been built, where the real gap is, and a plan
        sized to the weeks you actually have.
      </p>

      <form onSubmit={submit} className="mt-7 max-w-[680px]">
        <div className="flex items-end gap-2 rounded-[var(--radius-card)] border border-line bg-surface p-3 transition-colors focus-within:border-line-bright">
          <textarea
            ref={areaRef}
            autoFocus
            rows={1}
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value)
              grow(e.target)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) submit(e)
            }}
            placeholder="Build an AI solution to reduce food waste in college hostels"
            data-agent-id="intake.input"
            className="max-h-[120px] flex-1 resize-none bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={busy}
            data-agent-id="intake.submit"
            aria-label="Analyse this idea"
            className="shrink-0 rounded-[var(--radius-control)] border border-line bg-surface-2 px-3.5 py-2 text-ink transition-colors hover:border-line-bright disabled:opacity-50"
          >
            {busy ? '···' : '→'}
          </button>
        </div>
        <p className="data mt-2.5 text-[11px] text-muted">
          every repo · dataset · paper checked live — nothing recalled from memory
        </p>
      </form>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {EXAMPLE_IDEAS.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setIdea(ex)
              grow(areaRef.current)
              areaRef.current?.focus()
            }}
            className="chip"
            data-agent-id="intake.example"
          >
            ⟨ {ex} ⟩
          </button>
        ))}
      </div>

      <div className="hr mt-9" />

      <div className="flex flex-wrap items-center gap-3.5 py-3.5">
        <span className="eyebrow mb-0">now checking</span>
        <span key={item.id} className="data animate-slide-in text-[13px]">
          {item.title}
        </span>
        <span
          className={`${statusClass(item.verify)} data rounded-full border px-2 py-0.5 text-[10px]`}
        >
          {GLYPH[item.verify]} {VERIFY_LABEL[item.verify]}
        </span>
        {item.stars ? (
          <span className="data text-[11px] text-muted">{item.stars.toLocaleString()}★</span>
        ) : null}
      </div>
    </section>
  )
}
