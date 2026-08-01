/**
 * F2 — required output #3, "existing solution comparison".
 * Not in the design prototype; built in its visual language.
 *
 * @param {{comparisons: import('@/lib/types').Comparison[]}} props
 */
export default function Comparison({ comparisons = [] }) {
  if (!comparisons.length) return null

  return (
    <section className="mx-auto max-w-[1040px] px-6 py-14 sm:px-8">
      <p className="eyebrow">existing solutions</p>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="data grid grid-cols-[1.1fr_1.2fr_1.4fr_1.4fr] gap-4 border-b border-line pb-2 text-[11px] uppercase tracking-[0.1em] text-muted">
            <span>solution</span>
            <span>approach</span>
            <span>strengths / weaknesses</span>
            <span>what it misses</span>
          </div>

          {comparisons.map((c) => (
            <div
              key={c.name}
              className="grid grid-cols-[1.1fr_1.2fr_1.4fr_1.4fr] gap-4 border-b border-line py-4"
            >
              <div>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14px] font-semibold hover:underline"
                  >
                    {c.name}
                  </a>
                ) : (
                  <span className="text-[14px] font-semibold">{c.name}</span>
                )}
              </div>

              <p className="text-[13px] text-muted">{c.approach}</p>

              <div className="space-y-1">
                {c.strengths.map((s) => (
                  <p key={s} className="text-[13px]">
                    <span className="text-verified">+</span> {s}
                  </p>
                ))}
                {c.weaknesses.map((w) => (
                  <p key={w} className="text-[13px] text-muted">
                    <span className="text-stale">−</span> {w}
                  </p>
                ))}
              </div>

              {/* The gap link — this column is why the table exists. */}
              <p
                className="border-l-2 pl-3 text-[13px]"
                style={{ borderColor: 'var(--color-verified)' }}
              >
                {c.missing}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
