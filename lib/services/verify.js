/**
 * A-2 — THE KILL SHOT. 🌐 Real-time Web Intelligence.
 *
 * Every recommended resource is checked against the live web before it reaches
 * the user. This is the one thing no competing submission will have, and the UI
 * already renders all four states.
 *
 * HARD RULE: this module never throws and never rejects. A rate limit, a
 * timeout, a malformed URL — all of them downgrade a single item to
 * 'unverified'. A verification failure must never take down the pipeline.
 */

/** @typedef {import('@/lib/types').Evidence} Evidence */

const GITHUB_API = 'https://api.github.com/repos'
const STALE_AFTER_DAYS = 365
const TIMEOUT_MS = 6000

/** In-memory cache. Verification is the demo's hot path — never check twice. */
const cache = globalThis.__verifyCache ?? new Map()
globalThis.__verifyCache = cache
const CACHE_TTL_MS = 30 * 60 * 1000

function cached(key) {
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return hit.value
}

function store(key, value) {
  cache.set(key, { at: Date.now(), value })
  return value
}

/** fetch with a hard deadline — a hung socket must not stall the pipeline. */
async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal })
  } finally {
    clearTimeout(timer)
  }
}

function githubHeaders() {
  const h = { Accept: 'application/vnd.github+json' }
  // Optional: raises the rate limit from 60/hr to 5000/hr.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

/** `https://github.com/owner/repo/tree/main` → `owner/repo` */
function repoSlug(url = '') {
  const m = url.match(/github\.com\/([^/#?]+)\/([^/#?]+)/i)
  if (!m) return null
  return `${m[1]}/${m[2].replace(/\.git$/, '')}`
}

function monthsSince(iso) {
  if (!iso) return null
  const ms = Date.now() - new Date(iso).getTime()
  return ms / (1000 * 60 * 60 * 24 * 30.44)
}

/**
 * Verify a GitHub repo against the live API.
 * @param {string} url
 */
async function verifyRepo(url) {
  const slug = repoSlug(url)
  if (!slug) return { verify: 'unverified', verifyNote: 'not a recognisable repo URL' }

  const key = `gh:${slug}`
  const hit = cached(key)
  if (hit) return hit

  try {
    const res = await fetchWithTimeout(`${GITHUB_API}/${slug}`, { headers: githubHeaders() })

    if (res.status === 404) {
      return store(key, { verify: 'dead', verifyNote: '404 — repository no longer exists' })
    }
    if (res.status === 403 || res.status === 429) {
      // Rate limited. Downgrade honestly rather than guessing.
      return { verify: 'unverified', verifyNote: 'GitHub rate limit — could not check' }
    }
    if (!res.ok) {
      return { verify: 'unverified', verifyNote: `GitHub returned ${res.status}` }
    }

    const r = await res.json()
    const pushedMonths = monthsSince(r.pushed_at)
    const pushedLabel = r.pushed_at ? r.pushed_at.slice(0, 7) : 'unknown'

    if (r.archived) {
      return store(key, {
        verify: 'dead',
        verifyNote: `archived by owner · read-only since ${pushedLabel}`,
        stars: r.stargazers_count,
        license: r.license?.spdx_id || undefined,
        publishedAt: r.pushed_at,
      })
    }

    const stale = pushedMonths != null && pushedMonths > STALE_AFTER_DAYS / 30.44
    return store(key, {
      verify: stale ? 'stale' : 'verified',
      verifyNote: stale
        ? `last commit ${pushedLabel} · ${r.open_issues_count ?? 0} open issues${
            r.license?.spdx_id ? '' : ' · no license'
          }`
        : `pushed ${pushedLabel} · actively maintained`,
      stars: r.stargazers_count,
      license: r.license?.spdx_id || undefined,
      publishedAt: r.pushed_at,
      confidenceBoost: stale ? -0.25 : 0.15,
    })
  } catch {
    return { verify: 'unverified', verifyNote: 'could not reach GitHub' }
  }
}

/**
 * Liveness check for anything that isn't a repo. HEAD first; some hosts reject
 * HEAD, so fall back to a ranged GET before calling it dead.
 * @param {string} url
 */
async function verifyLink(url) {
  if (!url || !/^https?:\/\//i.test(url)) {
    return { verify: 'unverified', verifyNote: 'no usable URL' }
  }

  const key = `url:${url}`
  const hit = cached(key)
  if (hit) return hit

  try {
    let res = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' })

    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetchWithTimeout(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { Range: 'bytes=0-1023' },
      })
    }

    if (res.status === 404 || res.status === 410) {
      return store(key, { verify: 'dead', verifyNote: `${res.status} — page not found` })
    }
    if (res.ok || res.status === 206) {
      return store(key, { verify: 'verified', verifyNote: `HTTP ${res.status} · reachable` })
    }
    return { verify: 'unverified', verifyNote: `HTTP ${res.status}` }
  } catch {
    // Timeouts and TLS failures are not proof of death — say so.
    return { verify: 'unverified', verifyNote: 'no response within 6s' }
  }
}

/**
 * Verify every piece of evidence, in parallel, and stamp `checkedAt`.
 * The UI reads `checkedAt` for the "checked 4s ago" line that carries the whole
 * verification pitch — every item gets one, whatever the outcome.
 *
 * @param {Evidence[]} evidence
 * @returns {Promise<Evidence[]>}
 */
export async function verifyAll(evidence = []) {
  const results = await Promise.allSettled(
    evidence.map(async (e) => {
      const check = e.sourceType === 'repo' || /github\.com/i.test(e.url || '')
        ? await verifyRepo(e.url)
        : await verifyLink(e.url)

      const { confidenceBoost = 0, ...fields } = check
      return {
        ...e,
        ...fields,
        checkedAt: new Date().toISOString(),
        confidence: Math.min(1, Math.max(0, (e.confidence ?? 0.5) + confidenceBoost)),
      }
    })
  )

  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : {
          ...evidence[i],
          verify: 'unverified',
          verifyNote: 'verification failed',
          checkedAt: new Date().toISOString(),
        }
  )
}

/**
 * Claims we could not confirm. The honesty panel is never empty on a real run,
 * and that is the point — see docs/UI-SPEC.md §6.2 E.
 * @param {Evidence[]} evidence
 * @returns {string[]}
 */
export function unverifiedNotes(evidence = []) {
  const notes = []

  const unchecked = evidence.filter((e) => e.verify === 'unverified')
  if (unchecked.length) {
    notes.push(
      `${unchecked.length} source${unchecked.length > 1 ? 's' : ''} could not be reached at check time (${unchecked
        .slice(0, 3)
        .map((e) => e.title)
        .join('; ')}${unchecked.length > 3 ? '; …' : ''}). Treat them as unconfirmed.`
    )
  }

  const solo = evidence.filter((e) => !e.corroborated && e.confidence < 0.6)
  if (solo.length) {
    notes.push(
      `${solo.length} finding${solo.length > 1 ? 's rest' : ' rests'} on a single low-confidence source with no independent corroboration.`
    )
  }

  const forums = evidence.filter((e) => e.sourceType === 'forum')
  if (forums.length) {
    notes.push(
      `${forums.length} source${forums.length > 1 ? 's are' : ' is'} forum or community posts — anecdotal, not peer-reviewed.`
    )
  }

  if (!process.env.GITHUB_TOKEN) {
    notes.push(
      'GitHub was queried unauthenticated (60 requests/hour), so some repository checks may have been rate-limited rather than genuinely verified.'
    )
  }

  return notes
}
