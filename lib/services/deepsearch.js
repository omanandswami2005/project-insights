/**
 * A-1 — DeepSearch. 🔍 Layer 2 component.
 *
 * Searches multiple trusted sources in parallel and normalises everything into
 * the `Evidence` shape from lib/types.js. Nothing here throws: a dead provider
 * yields an empty list, and the pipeline continues with whatever came back.
 */

/** @typedef {import('@/lib/types').Evidence} Evidence */

const TAVILY_URL = 'https://api.tavily.com/search'
const S2_URL = 'https://api.semanticscholar.org/graph/v1/paper/search'

/**
 * Evidence ids must restart at e1 for every analysis. They are referenced by
 * the graph's `evidenceIds`, so a process-wide counter would make ids drift
 * out of range on the second run and silently break node → evidence lookups.
 */
function makeCounter() {
  let n = 0
  return () => `e${++n}`
}

/** Trim a title to something that fits a card without a tooltip. */
function tidy(title = '', max = 110) {
  const t = String(title).replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

/** Guess the source type from a URL when the provider doesn't tell us. */
function classify(url = '') {
  const u = url.toLowerCase()
  if (u.includes('github.com')) return 'repo'
  if (u.includes('huggingface.co/datasets') || u.includes('kaggle.com/datasets')) return 'dataset'
  if (u.includes('data.gov') || u.includes('/api') || u.includes('rapidapi')) return 'api'
  if (u.includes('arxiv.org') || u.includes('doi.org') || u.includes('sciencedirect')) return 'paper'
  if (u.includes('reddit.com') || u.includes('stackoverflow') || u.includes('news.ycombinator'))
    return 'forum'
  return 'article'
}

/**
 * One Tavily search. Returns [] on any failure — never throws.
 * @param {string} query
 * @param {{sourceType?: string, max?: number, includeDomains?: string[]}} [opts]
 * @returns {Promise<Evidence[]>}
 */
async function tavily(query, opts = {}, nextId) {
  const key = process.env.TAVILY_API_KEY
  if (!key) return []

  try {
    const res = await fetch(TAVILY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        query,
        max_results: opts.max ?? 8,
        search_depth: 'advanced',
        include_domains: opts.includeDomains,
      }),
    })
    if (!res.ok) return []

    const data = await res.json()
    const results = Array.isArray(data?.results) ? data.results : []

    return results.map((r) => ({
      id: nextId(),
      title: tidy(r.title || r.url),
      url: r.url,
      sourceType: opts.sourceType || classify(r.url),
      publishedAt: r.published_date || undefined,
      verify: 'unverified',
      // Tavily's own relevance score, clamped. Verification adjusts this later.
      confidence: Math.min(1, Math.max(0, Number(r.score) || 0.5)),
      corroborated: false,
    }))
  } catch {
    return []
  }
}

/**
 * Semantic Scholar paper search. No API key needed at demo volume.
 * @param {string} query
 * @returns {Promise<Evidence[]>}
 */
async function papers(query, nextId) {
  try {
    const params = new URLSearchParams({
      query,
      limit: '8',
      fields: 'title,url,year,externalIds,citationCount,openAccessPdf,publicationTypes',
    })
    const res = await fetch(`${S2_URL}?${params}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return []

    const data = await res.json()
    const list = Array.isArray(data?.data) ? data.data : []

    return list
      .filter((p) => p.title)
      .map((p) => {
        const peerReviewed = (p.publicationTypes || []).some((t) =>
          ['JournalArticle', 'Conference'].includes(t)
        )
        const cites = Number(p.citationCount) || 0
        return {
          id: nextId(),
          title: tidy(p.title),
          url:
            p.openAccessPdf?.url ||
            p.url ||
            (p.externalIds?.DOI ? `https://doi.org/${p.externalIds.DOI}` : ''),
          sourceType: 'paper',
          publishedAt: p.year ? `${p.year}-01-01` : undefined,
          verify: 'unverified',
          // Citation count is a real signal, so use it rather than a flat guess.
          confidence: Math.min(0.95, 0.45 + Math.log10(cites + 1) / 4 + (peerReviewed ? 0.1 : 0)),
          corroborated: cites > 20,
        }
      })
      .filter((e) => e.url)
  } catch {
    return []
  }
}

/** Two sources agreeing is worth more than either alone — mark the overlap. */
function markCorroboration(evidence) {
  const seen = new Map()
  for (const e of evidence) {
    // Match on the significant words of a title, not the whole string.
    const key = tidy(e.title)
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(' ')
      .filter((w) => w.length > 4)
      .slice(0, 5)
      .join(' ')
    if (!key) continue
    if (seen.has(key)) {
      seen.get(key).corroborated = true
      e.corroborated = true
    } else {
      seen.set(key, e)
    }
  }
  return evidence
}

/** Drop exact-URL duplicates, keeping the more confident entry. */
function dedupe(evidence) {
  const byUrl = new Map()
  for (const e of evidence) {
    if (!e.url) continue
    const url = e.url.replace(/\/+$/, '')
    const existing = byUrl.get(url)
    if (!existing || e.confidence > existing.confidence) byUrl.set(url, e)
  }
  return [...byUrl.values()]
}

/**
 * The full DeepSearch fan-out. Five searches in parallel, one per source class.
 * F6: the `learning` search is a required output (R5, learning resources).
 *
 * @param {string} idea
 * @returns {Promise<Evidence[]>}
 */
export async function deepsearch(idea) {
  const nextId = makeCounter()

  const settled = await Promise.allSettled([
    papers(idea, nextId),
    tavily(`${idea} research paper OR study`, { sourceType: 'paper', max: 4 }, nextId),
    tavily(
      `${idea} github open source implementation`,
      { sourceType: 'repo', includeDomains: ['github.com'], max: 8 },
      nextId
    ),
    tavily(
      `${idea} dataset`,
      {
        sourceType: 'dataset',
        includeDomains: ['huggingface.co', 'kaggle.com', 'data.gov.in', 'zenodo.org'],
        max: 5,
      },
      nextId
    ),
    tavily(
      `${idea} existing product OR startup OR solution`,
      { sourceType: 'article', max: 6 },
      nextId
    ),
    tavily(
      `${idea} tutorial OR course OR documentation`,
      { sourceType: 'learning', max: 4 },
      nextId
    ),
  ])

  const all = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
  return markCorroboration(dedupe(all))
}
