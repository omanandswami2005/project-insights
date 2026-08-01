/**
 * Provider router. NVIDIA NIM is primary; OpenAI and Anthropic are standbys.
 *
 * Every caller in the pipeline imports `askJson` from here and never touches a
 * provider directly, so swapping or reordering providers is a change to this
 * file alone.
 *
 * Returning `null` is a normal outcome, not an error — callers fall back to
 * `deriveFallback()` (real data, no model) or the fixtures. Nothing in the
 * pipeline is allowed to crash because an LLM was unavailable.
 */

import { askJsonNvidia, hasNvidia } from './nvidia.js'
import { askOpenAIJson, hasOpenAI } from './openai.js'
import { askJsonAnthropic, hasAnthropic } from './claude.js'

/**
 * @param {{system: string, prompt: string, schema: Object, maxTokens?: number, effort?: string}} opts
 * @returns {Promise<any|null>}
 */
export async function askJson(opts) {
  if (hasNvidia()) {
    const result = await askJsonNvidia(opts)
    if (result) return result
    console.warn('[llm] NVIDIA returned nothing, trying fallback provider')
  }

  if (hasOpenAI()) {
    const result = await askOpenAIJson(opts)
    if (result) return result
    console.warn('[llm] OpenAI returned nothing, trying fallback provider')
  }

  if (hasAnthropic()) {
    const result = await askJsonAnthropic(opts)
    if (result) return result
  }

  return null
}

/** Which providers are configured — surfaced in logs at pipeline start. */
export function providerStatus() {
  return {
    nvidia: hasNvidia(),
    openai: hasOpenAI(),
    anthropic: hasAnthropic(),
  }
}
