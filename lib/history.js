import { DEMO_ANALYSIS } from '@/lib/fixtures'

const STORAGE_KEY = 'project_insights_history'

/**
 * Retrieves past analysis items from localStorage.
 * Falls back to demo analysis if localStorage is empty or unavailable.
 * @returns {{ id: string, idea: string, saturationScore: number, date: string }[]}
 */
export function getHistory() {
  if (typeof window === 'undefined') {
    return [getDemoHistoryItem()]
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // Pre-seed with demo analysis so workspace rail is never bare
      const initial = [getDemoHistoryItem()]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    const items = JSON.parse(raw)
    return Array.isArray(items) && items.length > 0 ? items : [getDemoHistoryItem()]
  } catch (e) {
    console.warn('[History] Failed to read history from localStorage:', e)
    return [getDemoHistoryItem()]
  }
}

/**
 * Saves or updates an analysis item in localStorage history.
 * @param {import('@/lib/types').Analysis} analysis
 */
export function saveToHistory(analysis) {
  if (typeof window === 'undefined' || !analysis || !analysis.id) return

  try {
    const current = getHistory().filter((item) => item.id !== analysis.id)
    const newItem = {
      id: analysis.id,
      idea: analysis.idea || 'Untitled Research Workspace',
      saturationScore: analysis.novelty?.saturationScore ?? 78,
      date: new Date(analysis.createdAt || Date.now()).toLocaleDateString(),
    }
    const updated = [newItem, ...current].slice(0, 10)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    console.warn('[History] Failed to save history to localStorage:', e)
  }
}

/**
 * Clears history from localStorage.
 */
export function clearHistory() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('[History] Failed to clear history:', e)
  }
}

function getDemoHistoryItem() {
  return {
    id: 'demo',
    idea: DEMO_ANALYSIS.idea,
    saturationScore: DEMO_ANALYSIS.novelty?.saturationScore ?? 78,
    date: 'Demo Workspace',
  }
}
