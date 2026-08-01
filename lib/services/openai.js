/**
 * OpenAI client using gpt-4o-mini (OpenAI's cheapest, high-performance model).
 *
 * Uses native fetch to call OpenAI Chat Completions API with JSON mode.
 * No external dependencies required.
 */

export const OPENAI_MODEL = 'gpt-4o-mini'

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY)
}

/**
 * One structured JSON call to OpenAI gpt-4o-mini.
 * Returns the parsed JSON object, or null on any failure.
 *
 * @param {Object} opts
 * @param {string} [opts.system]
 * @param {string} opts.prompt
 * @param {Object} [opts.schema]
 * @param {number} [opts.maxTokens]
 * @returns {Promise<any|null>}
 */
export async function askOpenAIJson({ system, prompt, schema, maxTokens = 8000 }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const messages = []
    if (system) {
      messages.push({ role: 'system', content: system })
    }

    let userContent = prompt
    if (schema) {
      userContent += '\n\nReturn a JSON object that adheres to this structure:\n' + JSON.stringify(schema, null, 2)
    }
    userContent += '\n\nCRITICAL: Respond ONLY with a valid JSON object. Do not include markdown code blocks or extra text.'

    messages.push({ role: 'user', content: userContent })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.warn('[openai] API error:', response.status, errText)
      return null
    }

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) return null

    // Strip markdown code fences if model accidentally adds them
    const cleanText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    return JSON.parse(cleanText)
  } catch (err) {
    console.warn('[openai] call failed:', err?.message || err)
    return null
  }
}
