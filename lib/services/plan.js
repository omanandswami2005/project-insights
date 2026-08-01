/**
 * A-5 — Project HUB. 🚀 Layer 2 component.
 *
 * Turns the idea + evidence + the team's real constraints into a plan they can
 * actually finish, plus the architecture (F3, required output #5).
 *
 * The prompt's job is to make the model CUT. Over-scoping is the documented #1
 * killer of student projects, and refusing to cut is how this feature fails.
 */

import { askJson } from './llm'
import { DEMO_ARCHITECTURE, DEMO_REALITY } from '@/lib/fixtures'

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['buildabilityScore', 'verdict', 'keep', 'cut', 'stack', 'milestones', 'architecture'],
  properties: {
    buildabilityScore: {
      type: 'integer',
      description: 'How buildable this is for THIS team in THIS time, 0-100.',
    },
    verdict: {
      type: 'string',
      description: 'Three or four words, e.g. "feasible, if you cut"',
    },
    keep: {
      type: 'array',
      description: '3-5 features. This is the whole product now — nothing else ships.',
      items: { type: 'string' },
    },
    cut: {
      type: 'array',
      description:
        'Everything being dropped, 6 or more items. Be specific and be ruthless — this list is the point.',
      items: { type: 'string' },
    },
    stack: {
      type: 'array',
      description: '4-6 layers. Prefer free tiers a student can actually access.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['layer', 'choice', 'why', 'freeTier'],
        properties: {
          layer: { type: 'string', description: 'e.g. Frontend, Database, Hosting' },
          choice: { type: 'string' },
          why: { type: 'string', description: 'One short clause' },
          freeTier: { type: 'boolean' },
        },
      },
    },
    milestones: {
      type: 'array',
      description:
        'Exactly 4. milestones[0] MUST be a 48-hour vertical slice that produces something working end to end.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'title', 'days', 'tasks', 'deliverable'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          days: { type: 'integer' },
          tasks: { type: 'array', items: { type: 'string' } },
          deliverable: {
            type: 'string',
            description: 'The observable thing that exists when this milestone is done',
          },
        },
      },
    },
    architecture: {
      type: 'object',
      additionalProperties: false,
      required: ['mermaid', 'components', 'dataFlow'],
      properties: {
        mermaid: {
          type: 'string',
          description:
            'A valid Mermaid flowchart starting with "flowchart TD". Node labels in square brackets, no quotes inside labels, no parentheses in labels, 6-10 nodes.',
        },
        components: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['name', 'role', 'tech'],
            properties: {
              name: { type: 'string' },
              role: { type: 'string', description: 'One clause' },
              tech: { type: 'string' },
            },
          },
        },
        dataFlow: { type: 'string', description: 'Two or three sentences' },
      },
    },
  },
}

const SYSTEM = `You size a student project to what a specific team can actually finish.

The single most common way student projects fail is over-scoping. Your job is to prevent that, so:
- Cut aggressively. The cut list should be longer than the keep list. Cutting is the value you provide, not a failure.
- Milestone 0 is always a 48-hour vertical slice: thin, but working end to end on real data. Not setup, not research — something that runs.
- Respect the budget. If it is zero, every stack choice must have a genuine free tier.
- Scale ambition to the team: two people with five weeks get a materially smaller product than five people with twelve.
- Prefer boring, well-documented technology the team already knows over the theoretically better choice.
- The Mermaid diagram must parse. Keep labels plain — no quotes, parentheses, or special characters inside brackets.`

/**
 * @param {Object} args
 * @param {string} args.idea
 * @param {import('@/lib/types').Evidence[]} [args.evidence]
 * @param {import('@/lib/types').Novelty} [args.novelty]
 * @param {number} args.teamSize
 * @param {number} args.weeks
 * @param {string[]} [args.skills]
 * @param {string} [args.budget]
 * @returns {Promise<{reality: import('@/lib/types').RealityCheck, architecture: import('@/lib/types').Architecture}>}
 */
export async function planProject({
  idea,
  evidence = [],
  novelty,
  teamSize,
  weeks,
  skills = [],
  budget = '0',
}) {
  const budgetLabel = { 0: '₹0 — free tiers only', low: '₹0–2,000/month', high: '₹2,000+/month' }[
    budget
  ] || '₹0 — free tiers only'

  const resources = evidence
    .filter((e) => e.verify === 'verified')
    .slice(0, 12)
    .map((e) => `- (${e.sourceType}) ${e.title}`)
    .join('\n')

  const result = await askJson({
    system: SYSTEM,
    prompt: `Idea: "${idea}"

Team reality:
- ${teamSize} ${teamSize === 1 ? 'person' : 'people'}
- ${weeks} week${weeks === 1 ? '' : 's'} available
- Skills on the team: ${skills.length ? skills.join(', ') : 'not specified — assume general web development only'}
- Budget: ${budgetLabel}

${novelty ? `Where the opportunity is: ${novelty.whiteSpace?.join(' / ') || 'not identified'}\n` : ''}
${resources ? `Verified resources available to them:\n${resources}\n` : ''}
Produce the plan. Cut hard.`,
    schema: SCHEMA,
    maxTokens: 16000,
    effort: 'medium',
  })

  if (!result) {
    return { reality: DEMO_REALITY, architecture: DEMO_ARCHITECTURE }
  }

  const { architecture, ...reality } = result

  return {
    reality: {
      ...reality,
      buildabilityScore: Math.min(100, Math.max(0, reality.buildabilityScore ?? 50)),
    },
    architecture: {
      ...architecture,
      // A malformed diagram would break the plan screen; guarantee it at least parses.
      mermaid: architecture?.mermaid?.trim()?.startsWith('flowchart')
        ? architecture.mermaid
        : DEMO_ARCHITECTURE.mermaid,
    },
  }
}
