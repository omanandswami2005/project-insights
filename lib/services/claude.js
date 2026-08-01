/**
 * Shared Claude client.
 *
 * Every LLM call in this project goes through `askJson`, which uses structured
 * outputs (`output_config.format`) so the model is *constrained* to our contract
 * rather than asked nicely to follow it. If anything still goes wrong, the
 * caller gets `null` and falls back to fixtures — the pipeline never crashes.
 */

import Anthropic from '@anthropic-ai/sdk'

export const MODEL = 'claude-sonnet-5'

let client = null
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!client) client = new Anthropic()
  return client
}

export function hasAnthropic() {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

/**
 * One structured-output call. Returns the parsed object, or null on any failure.
 *
 * @param {Object} opts
 * @param {string} opts.system
 * @param {string} opts.prompt
 * @param {Object} opts.schema      JSON Schema — every object needs additionalProperties:false
 * @param {number} [opts.maxTokens]
 * @param {'low'|'medium'|'high'|'xhigh'|'max'} [opts.effort]
 * @returns {Promise<any|null>}
 */
export async function askJsonAnthropic({ system, prompt, schema, maxTokens = 16000, effort = 'medium' }) {
  const anthropic = getClient()
  if (!anthropic) return null

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      // Thinking is on by default on Opus 5 and counts against max_tokens.
      // `effort` is the cost/latency lever — we're on a demo clock.
      output_config: {
        effort,
        format: { type: 'json_schema', schema },
      },
      messages: [{ role: 'user', content: prompt }],
    })

    if (response.stop_reason === 'refusal') {
      console.warn('[claude] refused:', response.stop_details?.category)
      return null
    }
    if (response.stop_reason === 'max_tokens') {
      console.warn('[claude] hit max_tokens — output truncated, falling back')
      return null
    }

    const text = response.content.find((b) => b.type === 'text')?.text
    if (!text) return null

    return JSON.parse(text)
  } catch (err) {
    // Rate limits, network failures, malformed JSON — all handled the same way:
    // log it and let the caller fall back. The demo must never white-screen.
    console.warn('[claude] call failed:', err?.message || err)
    return null
  }
}
