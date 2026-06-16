import type { Axis, AxisResult, QuizResult } from '../types'
import { FIRST_POLE, SECOND_POLE } from '../types'

const AXES: Axis[] = ['EI', 'SN', 'TF', 'JP']

// Compact, URL-friendly encoding of a result: "INFP.72.40.61.30"
// (type + each axis's firstPolePercent). Lets a shared link rebuild the result
// page without any server.

export function encodeResult(result: QuizResult): string {
  const percents = AXES.map((axis) => {
    const a = result.axes.find((x) => x.axis === axis)!
    return Math.round(a.firstPolePercent)
  })
  return [result.type, ...percents].join('.')
}

export function decodeResult(code: string): QuizResult | null {
  const parts = code.split('.')
  if (parts.length !== 5) return null
  const [type, ...nums] = parts
  if (!/^[EI][SN][TF][JP]$/.test(type)) return null

  const axes: AxisResult[] = AXES.map((axis, i) => {
    const firstPolePercent = clamp(Number(nums[i]), 0, 100)
    if (Number.isNaN(firstPolePercent)) throw new Error('bad share code')
    const winner =
      firstPolePercent >= 50 ? FIRST_POLE[axis] : SECOND_POLE[axis]
    const clarity = Math.round(Math.abs(firstPolePercent - 50) + 50)
    return { axis, firstPolePercent, winner, clarity }
  })

  // sanity: the encoded type letters should match the recomputed winners
  if (axes.map((a) => a.winner).join('') !== type) return null
  return { type, axes }
}

export function buildShareUrl(result: QuizResult): string {
  const base = `${location.origin}${location.pathname}`
  return `${base}#/r/${encodeResult(result)}`
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}
