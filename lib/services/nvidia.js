/**
 * NVIDIA NIM provider — the pipeline's primary LLM.
 *
 * build.nvidia.com exposes an OpenAI-compatible endpoint, so this is plain
 * fetch rather than another SDK dependency.
 *
 * Structured output: NVIDIA's own guidance is to use `nvext.guided_json`
 * rather than `response_format: {type: "json_object"}` — the latter permits
 * any valid JSON, including `{}`. Support varies per model though, so we try
 * three strategies in descending strictness and remember which one worked.
 */

const BASE = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'
const TIMEOUT_MS = 90_000

/**
 * Preference order for auto-detection, strongest first. Matched as substrings
 * against whatever /v1/models actually returns, so a renamed or newer variant
 * still matches and nothing 404s on a guessed id.
 */
const PREFERRED = [
  // Bake-off against our real cluster schema, 2026-08-01:
  //   nemotron-3-super-120b-a12b  ✅ json_schema   4.7s   ← 5x faster, same quality
  //   nemotron-3-ultra-550b-a55b  ✅ json_schema  24.4s
  //   deepseek-v4-pro / glm-5.2 / kimi-k2.6 / gpt-oss-120b  ❌ unreachable on this key
  // Super wins: the live view is meant to be watched, and 24s of staring is a
  // worse demo than 5s. Override with NVIDIA_MODEL if you want the bigger model.
  'nemotron-3-super',
  'nemotron-3-ultra',
  'deepseek-v4-pro',
  'glm-5.2',
  'kimi-k2',
  'gpt-oss-120b',
  'llama-3.3-nemotron-super',
  'llama-3.3-70b',
  'mistral-large-2',
]

/** Models that can't hold a long instruction-following turn — skip in auto-pick. */
const AVOID = ['embed', 'rerank', 'guard', 'vision', 'vila', 'ocr', 'speech', 'riva', 'nemoretriever']

export function hasNvidia() {
  return Boolean(process.env.NVIDIA_API_KEY)
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

async function withTimeout(url, opts) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** Everything the key can actually reach. */
export async function listModels() {
  if (!hasNvidia()) return []
  try {
    const res = await withTimeout(`${BASE}/models`, { headers: headers() })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.data ?? []).map((m) => m.id).filter(Boolean)
  } catch {
    return []
  }
}

/** Resolved once per process — a model list call per request would be wasteful. */
let resolvedModel = null

/**
 * The model to use. `NVIDIA_MODEL` wins if set; otherwise pick the strongest
 * available match from PREFERRED.
 */
export async function resolveModel() {
  if (process.env.NVIDIA_MODEL) return process.env.NVIDIA_MODEL
  if (resolvedModel) return resolvedModel

  const available = await listModels()
  if (!available.length) return null

  const usable = available.filter((id) => !AVOID.some((bad) => id.toLowerCase().includes(bad)))

  for (const pref of PREFERRED) {
    const hit = usable.find((id) => id.toLowerCase().includes(pref))
    if (hit) {
      resolvedModel = hit
      console.log(`[nvidia] using ${hit}`)
      return hit
    }
  }

  // Nothing recognised — take the first usable model rather than giving up.
  resolvedModel = usable[0] ?? available[0]
  console.log(`[nvidia] no preferred match; using ${resolvedModel}`)
  return resolvedModel
}

/** Strategy the current model accepts, learned on first success. */
let jsonMode = null

function buildBody({ model, system, prompt, schema, maxTokens, mode }) {
  const base = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.4,
    stream: false,
  }

  if (mode === 'guided_json') {
    // NVIDIA's recommended path — real constrained decoding.
    return { ...base, nvext: { guided_json: schema } }
  }
  if (mode === 'json_schema') {
    // OpenAI-style strict schema; some NIMs implement this instead.
    return {
      ...base,
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'result', strict: true, schema },
      },
    }
  }
  // Last resort: JSON mode plus the schema in the prompt. Weakest, but every
  // OpenAI-compatible endpoint supports it.
  return {
    ...base,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: `${prompt}\n\nRespond with JSON matching this schema exactly. Output only the JSON object, no prose or code fences:\n${JSON.stringify(schema)}`,
      },
    ],
  }
}

/**
 * Parsing is not succeeding. Some models return a structurally valid object
 * whose strings are all "" and arrays all empty — the schema is satisfied and
 * the content is worthless. Treat that as a failure so the next strategy runs.
 */
function looksEmpty(obj) {
  if (!obj || typeof obj !== 'object') return true
  const values = Object.values(obj)
  if (!values.length) return true
  const meaningful = values.filter((v) => {
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'string') return v.trim().length > 0
    return v !== null && v !== undefined
  })
  // A payload where most fields came back blank is a failed generation.
  return meaningful.length < Math.ceil(values.length / 2)
}

/** Models sometimes wrap JSON in fences or emit a reasoning preamble. */
function extractJson(text = '') {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : text

  try {
    return JSON.parse(candidate.trim())
  } catch {
    // Fall back to the outermost balanced braces.
    const start = candidate.indexOf('{')
    const end = candidate.lastIndexOf('}')
    if (start === -1 || end <= start) return null
    try {
      return JSON.parse(candidate.slice(start, end + 1))
    } catch {
      return null
    }
  }
}

/**
 * One structured call. Returns the parsed object, or null — callers fall back.
 *
 * @param {{system: string, prompt: string, schema: Object, maxTokens?: number}} opts
 * @returns {Promise<any|null>}
 */
export async function askJsonNvidia({ system, prompt, schema, maxTokens = 8000 }) {
  if (!hasNvidia()) return null

  const model = await resolveModel()
  if (!model) {
    console.warn('[nvidia] no reachable model — check the API key')
    return null
  }

  // json_schema first, deliberately. NVIDIA's docs recommend guided_json, but
  // on nemotron-3-super it returns *parseable but empty* objects — the score
  // arrives and every string and array comes back blank. json_schema produces
  // correct content on the same model. Parsing successfully is not the same as
  // succeeding, which is what `looksEmpty` below exists to catch.
  const modes = jsonMode ? [jsonMode] : ['json_schema', 'guided_json', 'json_object']

  for (const mode of modes) {
    try {
      const res = await withTimeout(`${BASE}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(buildBody({ model, system, prompt, schema, maxTokens, mode })),
      })

      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        // 400 usually means this model rejects this JSON mode — try the next.
        if (res.status === 400 && !jsonMode) {
          console.warn(`[nvidia] ${mode} rejected, trying next strategy`)
          continue
        }
        console.warn(`[nvidia] HTTP ${res.status}: ${detail.slice(0, 200)}`)
        return null
      }

      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) {
        console.warn('[nvidia] empty completion')
        continue
      }

      const parsed = extractJson(text)
      if (!parsed) {
        console.warn(`[nvidia] ${mode} returned unparseable output`)
        continue
      }
      if (looksEmpty(parsed)) {
        console.warn(`[nvidia] ${mode} returned a hollow object — trying next strategy`)
        continue
      }

      if (!jsonMode) {
        jsonMode = mode
        console.log(`[nvidia] JSON strategy: ${mode}`)
      }
      return parsed
    } catch (err) {
      console.warn('[nvidia] call failed:', err?.message || err)
      // A timeout or network error won't be fixed by a different JSON mode.
      return null
    }
  }

  return null
}
