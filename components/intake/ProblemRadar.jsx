'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RADAR_PROBLEMS = [
  {
    id: 'pr-1',
    title: 'Food waste in college hostels & institutional messes',
    domain: 'Sustainability / IoT',
    saturationScore: 78,
    existingCount: 14,
    gap: 'Zero coverage in hostel-specific weight-sensor predictions & batch-level kitchen tracking.',
    ideaPrompt: 'Build an AI solution to reduce food waste in college hostels',
  },
  {
    id: 'pr-2',
    title: 'Automated code review & security auditing for student repos',
    domain: 'DevTools / AI',
    saturationScore: 85,
    existingCount: 22,
    gap: 'High generic linter saturation; zero context-aware secret leakage detection for offline hackathons.',
    ideaPrompt: 'AI agent for offline security auditing and secret detection in student git repositories',
  },
  {
    id: 'pr-3',
    title: 'Real-time multilingual lecture notes & concept summarization',
    domain: 'EdTech / NLP',
    saturationScore: 62,
    existingCount: 9,
    gap: 'Missing offline regional language (Hindi/Marathi) terminology mapping for technical courses.',
    ideaPrompt: 'Multilingual real-time lecture note generator with regional technical dictionary mapping',
  },
  {
    id: 'pr-4',
    title: 'Smart campus energy monitoring & HVAC load optimization',
    domain: 'Smart Cities / IoT',
    saturationScore: 45,
    existingCount: 6,
    gap: 'Uncovered white space in occupancy-triggered low-cost micro-controller relays.',
    ideaPrompt: 'Occupancy-triggered campus HVAC and lighting load optimization via micro-controller relays',
  },
  {
    id: 'pr-5',
    title: 'Mental health mood tracking & early distress signal detection',
    domain: 'Healthcare / NLP',
    saturationScore: 90,
    existingCount: 31,
    gap: 'Over-crowded chat apps; missing peer-to-peer anonymous support queueing without central logging.',
    ideaPrompt: 'Privacy-first peer-to-peer anonymous student support routing without centralized logging',
  },
  {
    id: 'pr-6',
    title: 'Autonomous lab equipment scheduling & resource allocation',
    domain: 'Operations / AI',
    saturationScore: 38,
    existingCount: 4,
    gap: 'High demand, very low existing tooling. White space in multi-department shared lab reservation.',
    ideaPrompt: 'AI scheduler for shared multi-department college research lab equipment and inventory',
  },
]

export default function ProblemRadar() {
  const router = useRouter()
  const [selectedTag, setSelectedTag] = useState('all')

  const domains = ['all', ...new Set(RADAR_PROBLEMS.map((p) => p.domain))]

  const filtered = RADAR_PROBLEMS.filter(
    (p) => selectedTag === 'all' || p.domain === selectedTag
  )

  const handleSelectProblem = (idea) => {
    router.push(`/analyze/demo?idea=${encodeURIComponent(idea)}`)
  }

  return (
    <section className="mx-auto max-w-[900px] px-6 py-12 sm:px-8 border-t border-line">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="max-w-[400px]">
          <p className="eyebrow">capability R1 · problem radar</p>
          <h2 className="text-[20px] font-bold tracking-tight mt-1">
            Don&apos;t have an idea yet? Explore Problem Radar
          </h2>
          <p className="text-[13px] text-muted mt-2">
            Curated real-world campus & industry problems with live verified white-space opportunities.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 md:justify-end md:max-w-[450px]">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedTag(d)}
              data-active={selectedTag === d}
              data-agent-id={`radar.filter.${d}`}
              className="chip text-[11px]"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((prob) => (
          <div
            key={prob.id}
            className="panel flex flex-col justify-between p-4 transition-colors hover:border-line-bright"
            data-agent-id="radar.problem"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="chip data text-[10px] uppercase">{prob.domain}</span>
                <span className="data text-[11px] text-muted">
                  sat index: <strong className="text-ink">{prob.saturationScore}%</strong>
                </span>
              </div>

              <h3 className="data text-[15px] font-semibold mt-2.5">{prob.title}</h3>

              <div className="mt-3 rounded border border-line bg-surface-muted p-2.5">
                <p className="data text-[10px] text-muted uppercase">Uncovered White Space Gap</p>
                <p className="text-[12px] text-verified mt-0.5 font-medium">⚡ {prob.gap}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="data text-[11px] text-muted">
                {prob.existingCount} repos/papers verified
              </span>
              <button
                onClick={() => handleSelectProblem(prob.ideaPrompt)}
                className="btn btn-secondary text-[12px]"
                data-agent-id="radar.analyze"
              >
                Analyze this →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
