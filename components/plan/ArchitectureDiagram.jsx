'use client'

import { useEffect, useId, useRef, useState } from 'react'

/**
 * F3 — required output #5, "project architecture".
 * Not in the design prototype; built in its visual language.
 *
 * Mermaid is imported dynamically — it's ~500kB and only this screen needs it.
 *
 * @param {{architecture: import('@/lib/types').Architecture}} props
 */
export default function ArchitectureDiagram({ architecture }) {
  const [svg, setSvg] = useState('')
  const [failed, setFailed] = useState(false)
  const uid = useId().replace(/[:]/g, '')
  const ranFor = useRef(null)

  useEffect(() => {
    const src = architecture?.mermaid
    if (!src || ranFor.current === src) return
    ranFor.current = src

    let cancelled = false
    ;(async () => {
      try {
        const mermaid = (await import('mermaid')).default
        const dark = document.documentElement.dataset.theme !== 'light'
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: 'var(--font-mono)',
          themeVariables: {
            background: 'transparent',
            primaryColor: dark ? '#1c1a18' : '#efeee9',
            primaryTextColor: dark ? '#f2efe9' : '#151412',
            primaryBorderColor: dark ? '#3d3a35' : 'rgba(12,11,10,0.28)',
            lineColor: dark ? '#3d3a35' : 'rgba(12,11,10,0.28)',
          },
        })
        const { svg } = await mermaid.render(`arch-${uid}`, src)
        if (!cancelled) setSvg(svg)
      } catch {
        // A malformed diagram must not take the plan screen down.
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [architecture?.mermaid, uid])

  if (!architecture) return null

  return (
    <div className="mt-9">
      <p className="eyebrow">architecture</p>

      <div className="panel overflow-x-auto p-5">
        {svg ? (
          <div className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : failed ? (
          <pre className="data whitespace-pre-wrap text-[12px] text-muted">
            {architecture.mermaid}
          </pre>
        ) : (
          <p className="data text-[12px] text-muted">rendering diagram…</p>
        )}
      </div>

      <p className="mt-4 max-w-[70ch] text-[14px] text-muted">{architecture.dataFlow}</p>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[560px]">
          {architecture.components.map((c) => (
            <div
              key={c.name}
              className="grid grid-cols-[150px_1fr_170px] gap-4 border-b border-line py-3"
            >
              <span className="data text-[13px]">{c.name}</span>
              <span className="text-[13px] text-muted">{c.role}</span>
              <span className="data text-[12px] text-muted">{c.tech}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
