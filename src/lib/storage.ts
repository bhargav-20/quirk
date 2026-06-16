import type { HistoryEntry, QuizResult } from '../types'

const HISTORY_KEY = 'quirk:history:v1'
const MAX_ENTRIES = 50

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function saveResult(result: QuizResult, takenAt: number): HistoryEntry[] {
  const entry: HistoryEntry = {
    type: result.type,
    takenAt,
    axes: result.axes,
  }
  const next = [entry, ...loadHistory()].slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch {
    // storage full / disabled — non-fatal, just skip persistence
  }
  return next
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    /* no-op */
  }
}
