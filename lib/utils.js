import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Standard class merger — shadcn components expect this to exist. */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * "checked 4s ago" — the tiny detail that carries the entire verification pitch.
 * Keep it in mono wherever it's rendered.
 * @param {string | undefined} iso
 */
export function timeAgo(iso) {
  if (!iso) return 'not checked'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

/** Tailwind class for a verify status. Never render colour without the word too. */
export function statusClass(verify) {
  return (
    {
      verified: 'status-verified',
      stale: 'status-stale',
      dead: 'status-dead',
    }[verify] || 'status-unverified'
  )
}

/** Graph node colours, keyed by kind. Spec: docs/UI-SPEC.md §6.1 */
export const NODE_COLOR = {
  problem: '#ededef',
  approach: '#8fa3b8',
  paper: '#7fc9d6',
  repo: '#7be04a',
  dataset: '#a894c4',
  gap: 'transparent', // hollow ring with a lime stroke — visually distinct on purpose
}

/** Short id generator — no dependency needed. */
export function makeId(prefix = 'a') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}
