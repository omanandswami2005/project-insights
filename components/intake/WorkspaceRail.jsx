'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { clearHistory, getHistory } from '@/lib/history'

export default function WorkspaceRail() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  function handleClear() {
    clearHistory()
    setHistory(getHistory())
  }

  if (!history || history.length === 0) return null

  return (
    <section className="mx-auto max-w-[900px] px-6 py-6 sm:px-8">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <span className="data text-[12px] font-semibold uppercase tracking-wider text-muted">
            📚 Recent Research Workspaces
          </span>
          <span className="chip data text-[10px]">{history.length}</span>
        </div>
        {history.length > 1 && (
          <button
            onClick={handleClear}
            className="data text-[11px] text-muted hover:text-ink"
            data-agent-id="workspace.clear"
          >
            clear history
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <Link
            key={item.id}
            href={`/analyze/${item.id}`}
            className="panel block p-3.5 transition-colors hover:border-line-bright"
            data-agent-id="workspace.item"
          >
            <div className="flex items-center justify-between">
              <span className="chip data text-[10px] text-verified">
                sat: {item.saturationScore}%
              </span>
              <span className="data text-[10px] text-muted">{item.date}</span>
            </div>
            <p className="data mt-2 text-[13px] font-medium line-clamp-2">{item.idea}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
