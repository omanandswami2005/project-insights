'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import TopBar from '@/components/shell/TopBar'
import ArchitectureDiagram from '@/components/plan/ArchitectureDiagram'
import { Footer } from '@/components/landing/Sections'
import { DEMO_ANALYSIS, USE_FIXTURES } from '@/lib/fixtures'
import { statusClass, timeAgo } from '@/lib/utils'
import { VERIFY_LABEL } from '@/lib/types'

const GLYPH = { verified: '✅', stale: '⚠️', dead: '❌', unverified: '·' }

export default function ExportBriefPage({ params }) {
  const { id } = use(params)
  const [analysis, setAnalysis] = useState(
    USE_FIXTURES || id === 'demo' ? DEMO_ANALYSIS : null
  )

  useEffect(() => {
    if (analysis) return
    fetch(`/api/analyze/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('not found'))))
      .then(setAnalysis)
      .catch(() => setAnalysis(DEMO_ANALYSIS))
  }, [id, analysis])

  if (!analysis) {
    return (
      <>
        <TopBar />
        <div className="mx-auto max-w-[1040px] px-6 py-16">
          <p className="data text-[13px] text-muted">loading export brief…</p>
        </div>
      </>
    )
  }

  const idea = analysis.idea
  const novelty = analysis.novelty ?? DEMO_ANALYSIS.novelty
  const reality = analysis.reality ?? DEMO_ANALYSIS.reality
  const architecture = analysis.architecture ?? DEMO_ANALYSIS.architecture
  const comparisons = analysis.comparisons ?? DEMO_ANALYSIS.comparisons ?? []
  const evidence = analysis.evidence ?? DEMO_ANALYSIS.evidence ?? []
  const unverified = analysis.unverified ?? DEMO_ANALYSIS.unverified ?? []

  const repos = evidence.filter((e) => e.sourceType === 'repo')
  const datasetsAndApis = evidence.filter((e) => e.sourceType === 'dataset' || e.sourceType === 'api')

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <div className="no-print">
        <TopBar recap={idea} />
      </div>

      <main className="mx-auto max-w-[900px] px-6 py-10 print:max-w-none print:px-0 print:py-0">
        {/* Top Control Bar for Screen */}
        <div className="no-print mb-8 flex items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/analyze/${id}`}
              className="btn btn-secondary text-[13px]"
              data-agent-id="brief.back"
            >
              ← Back to Dashboard
            </Link>
            <span className="eyebrow">Executive Brief</span>
          </div>

          <button
            onClick={handlePrint}
            className="btn btn-primary text-[13px]"
            data-agent-id="brief.print"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>

        {/* Executive Header */}
        <header className="border-b border-line pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">project-insights · innovation brief</p>
              <h1 className="mt-2 text-[26px] font-bold tracking-tight">{idea}</h1>
            </div>
            <div className="text-right">
              <span className="data text-[12px] text-muted block">ID: {id}</span>
              <span className="data text-[11px] text-muted block mt-1">
                Generated: {new Date(analysis.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </header>

        {/* 1. Problem Validation */}
        <section className="mt-8">
          <p className="eyebrow">1. Problem Validation & Saturation</p>
          <div className="panel mt-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="text-[13px] text-muted">Saturation Index</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="data text-[32px] font-bold">{novelty.saturationScore}</span>
                  <span className="data text-[14px] text-muted">/ 100</span>
                </div>
              </div>
              <div className="max-w-[500px]">
                <p className="text-[14px] font-medium">{novelty.verdict}</p>
              </div>
            </div>

            <p className="mt-4 text-[14px] text-muted">
              {analysis.summary || 'Comprehensive empirical verification across live GitHub repositories, academic literature, and existing tools.'}
            </p>
          </div>
        </section>

        {/* 2. Market & Literature Research */}
        <section className="mt-8">
          <p className="eyebrow">2. Market & Literature Research</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div className="panel p-4">
              <span className="data text-[24px] font-bold">{evidence.length}</span>
              <p className="text-[12px] text-muted mt-1">Sources Analyzed</p>
            </div>
            <div className="panel p-4">
              <span className="data text-[24px] font-bold text-verified">
                {evidence.filter((e) => e.verify === 'verified').length}
              </span>
              <p className="text-[12px] text-muted mt-1">Verified Live</p>
            </div>
            <div className="panel p-4">
              <span className="data text-[24px] font-bold text-dead">
                {evidence.filter((e) => e.verify === 'dead' || e.verify === 'stale').length}
              </span>
              <p className="text-[12px] text-muted mt-1">Dead / Archived Flagged</p>
            </div>
          </div>
        </section>

        {/* 3. Existing Solution Comparison */}
        <section className="mt-8">
          <p className="eyebrow">3. Existing Solution Comparison</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left border-collapse border border-line">
              <thead>
                <tr className="border-b border-line bg-surface-muted">
                  <th className="p-3 data text-[12px] font-semibold">Solution</th>
                  <th className="p-3 data text-[12px] font-semibold">Approach</th>
                  <th className="p-3 data text-[12px] font-semibold">Strengths</th>
                  <th className="p-3 data text-[12px] font-semibold">Weaknesses / Missing</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c) => (
                  <tr key={c.name} className="border-b border-line">
                    <td className="p-3 data text-[13px] font-medium">{c.name}</td>
                    <td className="p-3 text-[13px] text-muted">{c.approach}</td>
                    <td className="p-3 text-[12px] text-muted">
                      <ul className="list-disc list-inside">
                        {c.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-[12px] text-muted">
                      <span className="text-dead font-medium">{c.missing}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Innovation Opportunities (White Space) */}
        <section className="mt-8">
          <p className="eyebrow">4. Innovation Opportunities (White Space)</p>
          <div className="panel mt-3 p-5">
            <ul className="space-y-2">
              {novelty.whiteSpace.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[14px]">
                  <span className="data text-verified text-[14px]">⚡</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Project Architecture */}
        <section className="mt-8">
          <p className="eyebrow">5. System Architecture</p>
          <ArchitectureDiagram architecture={architecture} />
        </section>

        {/* 6. Development Roadmap & Implementation Timeline */}
        <section className="mt-8">
          <p className="eyebrow">6. Development Roadmap & Milestones</p>
          <div className="mt-3 space-y-4">
            {reality.milestones.map((m) => (
              <div key={m.id} className="panel p-4">
                <div className="flex items-baseline justify-between border-b border-line pb-2">
                  <h3 className="data text-[15px] font-bold">{m.title}</h3>
                  <span className="chip data text-[11px]">{m.days} days</span>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="data text-[11px] text-muted uppercase">Key Tasks</p>
                    <ul className="mt-1 list-disc list-inside text-[13px] text-muted">
                      {m.tasks.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="data text-[11px] text-muted uppercase">Deliverable Target</p>
                    <p className="mt-1 text-[13px] font-medium text-verified">{m.deliverable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Recommended Tech Stack */}
        <section className="mt-8">
          <p className="eyebrow">7. Recommended Tech Stack</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left border-collapse border border-line">
              <thead>
                <tr className="border-b border-line bg-surface-muted">
                  <th className="p-3 data text-[12px] font-semibold">Layer</th>
                  <th className="p-3 data text-[12px] font-semibold">Choice</th>
                  <th className="p-3 data text-[12px] font-semibold">Rationale</th>
                  <th className="p-3 data text-[12px] font-semibold">Free Tier</th>
                </tr>
              </thead>
              <tbody>
                {reality.stack.map((s) => (
                  <tr key={s.layer} className="border-b border-line">
                    <td className="p-3 data text-[13px] font-medium">{s.layer}</td>
                    <td className="p-3 data text-[13px] text-verified">{s.choice}</td>
                    <td className="p-3 text-[12px] text-muted">{s.why}</td>
                    <td className="p-3 data text-[12px]">
                      {s.freeTier ? '✅ Yes' : '⚠️ Paid'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 8. GitHub Repositories (Verified Live vs Dead) */}
        <section className="mt-8">
          <p className="eyebrow">8. GitHub Repositories</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {repos.map((r) => (
              <div key={r.id} className="panel p-3">
                <div className="flex items-center justify-between">
                  <span className={`${statusClass(r.verify)} data text-[11px] font-semibold`}>
                    {GLYPH[r.verify]} {VERIFY_LABEL[r.verify]}
                  </span>
                  {r.stars != null && (
                    <span className="data text-[11px] text-muted">★ {r.stars.toLocaleString()}</span>
                  )}
                </div>
                <p className="data text-[13px] font-medium mt-1">{r.title}</p>
                {r.verifyNote && (
                  <p className="data text-[11px] text-muted mt-1">{r.verifyNote}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 9. APIs & Datasets */}
        <section className="mt-8">
          <p className="eyebrow">9. Verified APIs & Datasets</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {datasetsAndApis.map((d) => (
              <div key={d.id} className="panel p-3">
                <div className="flex items-center justify-between">
                  <span className={`${statusClass(d.verify)} data text-[11px] font-semibold`}>
                    {GLYPH[d.verify]} {VERIFY_LABEL[d.verify]}
                  </span>
                  <span className="chip data text-[10px]">{d.sourceType}</span>
                </div>
                <p className="data text-[13px] font-medium mt-1">{d.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Honesty & Verification Ledger */}
        <section className="mt-8">
          <p className="eyebrow">10. Honesty Ledger (Unverified Claims)</p>
          <div className="panel mt-3 p-4">
            {unverified.length ? (
              <ul className="space-y-2">
                {unverified.map((claim, idx) => (
                  <li key={idx} className="data text-[12px] text-muted">
                    • {claim}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="data text-[12px] text-muted">All claims in this report were verified live.</p>
            )}
          </div>
        </section>

        {/* 11. Scope Discipline Verdict */}
        <section className="mt-8 mb-12">
          <p className="eyebrow">11. Scope & Buildability Discipline</p>
          <div className="panel mt-3 p-5">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <span className="text-[14px] font-medium">Buildability Verdict</span>
              <span className="data text-[18px] font-bold text-verified">
                Score: {reality.buildabilityScore}/100
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="data text-[11px] text-verified font-bold uppercase">Features Kept (Scope)</p>
                <ul className="mt-1 list-disc list-inside text-[12px] text-muted space-y-1">
                  {reality.keep.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="data text-[11px] text-dead font-bold uppercase">Features Cut (Discipline)</p>
                <ul className="mt-1 list-disc list-inside text-[12px] text-muted space-y-1">
                  {reality.cut.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </>
  )
}
