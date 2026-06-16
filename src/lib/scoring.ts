import type { AxisResult, Axis, Likert, QuizResult } from '../types'
import { FIRST_POLE, SECOND_POLE } from '../types'
import { QUESTIONS } from '../data/questions'

const AXES: Axis[] = ['EI', 'SN', 'TF', 'JP']

/**
 * Score a full set of Likert answers (keyed by question id) into a 4-letter type
 * plus per-axis clarity. Pure — no side effects.
 *
 * Each answer contributes (value - 3) ∈ [-2, +2] toward its `agreePole`. We sum
 * those contributions per axis relative to the FIRST pole, then map to a 0–100
 * "lean toward first pole" percentage. Ties resolve to the first pole.
 */
export function scoreAnswers(answers: Record<number, Likert>): QuizResult {
  const axes: AxisResult[] = AXES.map((axis) => {
    const questions = QUESTIONS.filter((q) => q.axis === axis)
    const maxMagnitude = questions.length * 2 // each q contributes at most ±2

    let sumTowardFirst = 0
    for (const q of questions) {
      const value = answers[q.id] ?? 3 // unanswered → neutral
      const lean = value - 3 // -2..+2 toward agreePole
      sumTowardFirst += q.agreePole === FIRST_POLE[axis] ? lean : -lean
    }

    // 50 = perfectly balanced; >50 leans first pole.
    const firstPolePercent = clamp(
      50 + (sumTowardFirst / maxMagnitude) * 50,
      0,
      100,
    )
    const winner =
      firstPolePercent >= 50 ? FIRST_POLE[axis] : SECOND_POLE[axis]
    const clarity = Math.round(Math.abs(firstPolePercent - 50) + 50)

    return { axis, firstPolePercent: round1(firstPolePercent), winner, clarity }
  })

  const type = axes.map((a) => a.winner).join('')
  return { type, axes }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
