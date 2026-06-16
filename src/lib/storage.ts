import type { HistoryEntry, Likert, QuizResult } from '../types'

const HISTORY_KEY = 'quirk:history:v1'
const VIEW_KEY = 'quirk:view:v1'
const PROGRESS_KEY = 'quirk:progress:v1'
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

// ── Persisted view: where the user is, so a reload restores it ───────────────

/** 'landing' has no payload; 'results' carries the result to re-render. */
export type PersistedView =
  | { screen: 'landing' }
  | { screen: 'quiz' }
  | { screen: 'results'; result: QuizResult }

export function saveView(view: PersistedView): void {
  try {
    localStorage.setItem(VIEW_KEY, JSON.stringify(view))
  } catch {
    /* no-op */
  }
}

export function loadView(): PersistedView | null {
  try {
    const raw = localStorage.getItem(VIEW_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as PersistedView
    if (v && (v.screen === 'landing' || v.screen === 'quiz' || v.screen === 'results')) {
      return v
    }
    return null
  } catch {
    return null
  }
}

// ── Persisted quiz progress: resume an unfinished quiz on reload ─────────────

export interface QuizProgress {
  index: number
  answers: Record<number, Likert>
}

export function saveProgress(progress: QuizProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* no-op */
  }
}

export function loadProgress(): QuizProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as QuizProgress
    if (p && typeof p.index === 'number' && p.answers) return p
    return null
  } catch {
    return null
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY)
  } catch {
    /* no-op */
  }
}
