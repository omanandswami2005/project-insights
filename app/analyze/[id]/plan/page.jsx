'use client'

import { use, useEffect, useState } from 'react'
import TopBar from '@/components/shell/TopBar'
import PlanView from '@/components/plan/PlanView'
import { Footer } from '@/components/landing/Sections'
import { DEMO_ANALYSIS, USE_FIXTURES } from '@/lib/fixtures'

export default function PlanPage({ params }) {
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

  return (
    <>
      <TopBar recap={analysis?.idea} />
      {analysis ? (
        <main>
          <PlanView analysis={analysis} />
        </main>
      ) : (
        <div className="mx-auto max-w-[1040px] px-6 py-16">
          <p className="data text-[13px] text-muted">loading plan…</p>
        </div>
      )}
      <Footer />
    </>
  )
}
