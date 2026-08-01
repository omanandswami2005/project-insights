'use client'

import { useState } from 'react'
import ArchitectureDiagram from './ArchitectureDiagram'

const SKILLS = ['React', 'Python', 'ML', 'Mobile', 'Backend', 'Design']
const BUDGETS = [
  { id: '0', label: '₹0' },
  { id: 'low', label: '₹0–2k' },
  { id: 'high', label: '₹2k+' },
]

function scoreColor(n) {
  if (n >= 70) return 'var(--color-verified)'
  if (n >= 40) return 'var(--color-stale)'
  return 'var(--color-dead)'
}

/** State 1 — the form. Four fields, one screen, no scroll. */
function Form({ onSubmit, busy }) {
  const [team, setTeam] = useState(2)
  const [weeks, setWeeks] = useState(6)
  const [skills, setSkills] = useState([])
  const [budget, setBudget] = useState('0')

  return (
    <div className="mx-auto max-w-[680px] px-6 py-12 sm:px-8">
      <p className="eyebrow">reality check</p>
      <h2 className="text-[32px]">Size this to what you can actually ship.</h2>

      <div className="mt-7">
        <p className="data mb-2 text-[12px] uppercase tracking-[0.1em] text-muted">team size</p>
        <div className="flex items-center gap-4">
          <button onClick={() => setTeam((t) => Math.max(1, t - 1))} className="chip px-3">
            −
          </button>
          <span className="data min-w-[20px] text-center text-[20px]">{team}</span>
          <button onClick={() => setTeam((t) => Math.min(6, t + 1))} className="chip px-3">
            +
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="data mb-2 text-[12px] uppercase tracking-[0.1em] text-muted">
          weeks available
        </p>
        <input
          type="range"
          min="1"
          max="16"
          value={weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
          className="w-full accent-[var(--color-ink)]"
          data-agent-id="plan.weeks"
        />
        <p className="data mt-1 text-[14px]">{weeks} weeks</p>
      </div>

      <div className="mt-6">
        <p className="data mb-2 text-[12px] uppercase tracking-[0.1em] text-muted">skills</p>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <button
              key={s}
              onClick={() =>
                setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))
              }
              data-active={skills.includes(s)}
              className="chip"
              data-agent-id="plan.skill"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="data mb-2 text-[12px] uppercase tracking-[0.1em] text-muted">budget</p>
        <div className="flex">
          {BUDGETS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setBudget(b.id)}
              data-agent-id="plan.budget"
              className="data border border-line px-4 py-2 text-[13px] first:rounded-l-[var(--radius-control)] last:rounded-r-[var(--radius-control)]"
              style={{
                marginLeft: i ? -1 : 0,
                color: budget === b.id ? 'var(--color-ink)' : 'var(--color-muted)',
                borderColor: budget === b.id ? 'var(--color-ink)' : 'var(--color-line)',
                zIndex: budget === b.id ? 1 : 0,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubmit({ teamSize: team, weeks, skills, budget })}
        disabled={busy}
        className="btn mt-8 w-full"
        data-agent-id="plan.submit"
      >
        {busy ? 'Working…' : 'Check what I can actually build'}
      </button>
    </div>
  )
}

/** State 2 — the verdict. Cutting is shown with pride, not apology. */
function Verdict({ reality, architecture }) {
  const allFree = reality.stack?.every((s) => s.freeTier)

  return (
    <div className="mx-auto max-w-[1040px] px-6 py-12 sm:px-8">
      <p className="eyebrow mb-0">buildability</p>
      <div className="mt-1.5 flex items-baseline gap-3.5">
        <span
          className="data text-[64px] font-semibold leading-none"
          style={{ color: scoreColor(reality.buildabilityScore) }}
        >
          {reality.buildabilityScore}
        </span>
        <span className="text-muted">/ 100 &nbsp; {reality.verdict}</span>
      </div>
      <div className="bar-track mt-3 max-w-[520px]">
        <div
          className="h-full"
          style={{
            width: `${reality.buildabilityScore}%`,
            background: scoreColor(reality.buildabilityScore),
          }}
        />
      </div>

      {/* Equal visual weight. The cut list is the product's thesis. */}
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        <div className="panel p-5" style={{ borderLeft: '2px solid var(--color-verified)' }}>
          <p className="data mb-2.5 text-[12px] uppercase tracking-[0.1em]">
            keeping {reality.keep.length}
          </p>
          {reality.keep.map((k) => (
            <div key={k} className="flex items-baseline gap-2.5 py-1.5">
              <span className="text-verified">✓</span>
              <span className="text-[14px]">{k}</span>
            </div>
          ))}
        </div>

        <div className="panel p-5">
          <p className="data mb-2.5 text-[12px] uppercase tracking-[0.1em]">
            cutting {reality.cut.length}
          </p>
          {reality.cut.map((k) => (
            <div key={k} className="flex items-baseline gap-2.5 py-1.5">
              <span className="text-muted">✗</span>
              <span className="text-[14px] text-muted line-through">{k}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="eyebrow mt-9">milestones</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reality.milestones.map((m, i) => (
          <div key={m.id}>
            {/* Milestone 0 is always the 48-hour vertical slice — emphasise it. */}
            <div
              className="rounded-full"
              style={{
                width: i === 0 ? 14 : 9,
                height: i === 0 ? 14 : 9,
                background: i === 0 ? 'var(--color-verified)' : 'var(--color-line-bright)',
              }}
            />
            <p className="data mt-2 text-[11px] text-muted">{m.days}d</p>
            <p className="mt-0.5 text-[13px] font-semibold">{m.title}</p>
            <p className="mt-1 text-[12px] text-muted">{m.deliverable}</p>
          </div>
        ))}
      </div>

      <p className="eyebrow mt-9">stack</p>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {reality.stack.map((s) => (
            <div
              key={s.layer}
              className="flex items-baseline gap-4 border-b border-line py-3"
            >
              <span className="data w-[110px] shrink-0 text-[13px]">{s.layer}</span>
              <span className="flex-1 text-[14px]">{s.choice}</span>
              <span className="flex-[2] text-[13px] text-muted">{s.why}</span>
              <span
                className="data w-[70px] shrink-0 text-right text-[13px]"
                style={{ color: s.freeTier ? 'var(--color-verified)' : 'var(--color-muted)' }}
              >
                {s.freeTier ? '✓ free' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {allFree ? (
        <p className="data text-verified mt-4 text-[32px] font-semibold">₹0/month</p>
      ) : null}

      <ArchitectureDiagram architecture={architecture} />
    </div>
  )
}

export default function PlanView({ analysis }) {
  const [reality, setReality] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(constraints) {
    setBusy(true)
    try {
      const res = await fetch('/api/reality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: analysis.id, ...constraints }),
      })
      if (!res.ok) throw new Error('reality failed')
      setReality(await res.json())
    } catch {
      // Route unreachable or the planner failed — the fixture keeps the flow alive.
      setReality(analysis.reality)
    } finally {
      setBusy(false)
    }
  }

  return reality ? (
    // The architecture arrives with the reality response on a live run — the
    // analysis was fetched before the planner ran, so its copy is empty then.
    <Verdict reality={reality} architecture={reality.architecture ?? analysis.architecture} />
  ) : (
    <Form onSubmit={submit} busy={busy} />
  )
}
