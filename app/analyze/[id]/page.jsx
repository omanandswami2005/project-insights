'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TopBar from '@/components/shell/TopBar'
import LiveAnalysis from '@/components/analyze/LiveAnalysis'
import Canvas from '@/components/graph/Canvas'
import InsightRail from '@/components/report/InsightRail'
import Comparison from '@/components/report/Comparison'
import ResourceVault from '@/components/vault/ResourceVault'
import { Footer } from '@/components/landing/Sections'
import { DEMO_ANALYSIS, USE_FIXTURES } from '@/lib/fixtures'
import { PIPELINE_STEPS } from '@/lib/types'

/** Compressed replay of the pipeline when we're running on fixtures. */
function useFixtureReplay(enabled, idea) {
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    if (!enabled) return
    const base = {
      ...DEMO_ANALYSIS,
      idea: idea || DEMO_ANALYSIS.idea,
      status: 'searching',
      progress: PIPELINE_STEPS.map((s) => ({ ...s, done: false })),
    }
    setAnalysis(base)

    let i = 0
    const t = setInterval(() => {
      i += 1
      setAnalysis((prev) => {
        if (!prev) return prev
        const progress = PIPELINE_STEPS.map((s, k) => ({
          ...s,
          done: k < i,
          ms: DEMO_ANALYSIS.progress[k]?.ms,
        }))
        if (i >= PIPELINE_STEPS.length) {
          clearInterval(t)
          return { ...DEMO_ANALYSIS, idea: prev.idea, status: 'done', progress }
        }
        return { ...prev, progress }
      })
    }, 700)

    return () => clearInterval(t)
  }, [enabled, idea])

  return analysis
}

export default function AnalyzePage({ params }) {
  const { id } = use(params)
  const search = useSearchParams()
  const ideaParam = search.get('idea')

  // 'demo' is the fixture path — also the fallback when the API is unreachable.
  const fixtureMode = USE_FIXTURES || id === 'demo'

  const [live, setLive] = useState(null)
  const replay = useFixtureReplay(fixtureMode, ideaParam)

  // Poll the real pipeline. docs — DEVELOPMENT-CHECKLIST.md "The Contract".
  useEffect(() => {
    if (fixtureMode) return
    let stop = false

    async function tick() {
      try {
        const res = await fetch(`/api/analyze/${id}`)
        if (!res.ok) throw new Error('not found')
        const data = await res.json()
        if (stop) return
        setLive(data)
        if (data.status !== 'done' && data.status !== 'error') {
          setTimeout(tick, 800)
        }
      } catch {
        // Lane A may not have landed yet — degrade to the fixture, never to a
        // dead end. The demo path must always resolve.
        if (!stop) setLive({ ...DEMO_ANALYSIS, idea: ideaParam || DEMO_ANALYSIS.idea })
      }
    }
    tick()
    return () => {
      stop = true
    }
  }, [id, fixtureMode, ideaParam])

  const analysis = fixtureMode ? replay : live
  const [selectedId, setSelectedId] = useState(null)

  const selectedNode = useMemo(
    () => analysis?.graph?.nodes?.find((n) => n.id === selectedId) ?? null,
    [analysis, selectedId]
  )

  if (!analysis) {
    return (
      <>
        <TopBar />
        <div className="mx-auto max-w-[1040px] px-6 py-16">
          <p className="data text-[13px] text-muted">starting analysis…</p>
        </div>
      </>
    )
  }

  const done = analysis.status === 'done'

  return (
    <>
      <TopBar recap={analysis.idea} />

      {!done ? (
        <LiveAnalysis analysis={analysis} />
      ) : (
        <main>
          <div className="mx-auto grid max-w-[1040px] gap-5 px-6 py-8 sm:px-8 lg:grid-cols-[3fr_2fr]">
            <div className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-100px)]">
              <Canvas
                graph={analysis.graph}
                evidence={analysis.evidence}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <InsightRail
              analysis={analysis}
              selectedNode={selectedNode}
              planHref={`/analyze/${id}/plan${ideaParam ? `?idea=${encodeURIComponent(ideaParam)}` : ''}`}
            />
          </div>

          <Comparison comparisons={analysis.comparisons} />
          <ResourceVault evidence={analysis.evidence} />
        </main>
      )}

      <Footer />
    </>
  )
}
