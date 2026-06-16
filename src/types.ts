// Core domain types for Quirk.

export type Axis = 'EI' | 'SN' | 'TF' | 'JP'

export type Pole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

/** The "first" pole of each axis — used as the positive direction when scoring. */
export const FIRST_POLE: Record<Axis, Pole> = {
  EI: 'E',
  SN: 'S',
  TF: 'T',
  JP: 'J',
}

export const SECOND_POLE: Record<Axis, Pole> = {
  EI: 'I',
  SN: 'N',
  TF: 'F',
  JP: 'P',
}

export interface Question {
  id: number
  text: string
  axis: Axis
  /** Which pole a "strongly agree" answer leans toward. */
  agreePole: Pole
}

/** Likert response: 1 = strongly disagree … 5 = strongly agree. 0 = unanswered. */
export type Likert = 0 | 1 | 2 | 3 | 4 | 5

/** Per-axis result. `firstPolePercent` is how far toward the FIRST pole (0–100). */
export interface AxisResult {
  axis: Axis
  firstPolePercent: number
  winner: Pole
  /** Clarity of the winning pole, 50–100. */
  clarity: number
}

export interface QuizResult {
  type: string // e.g. "INFP"
  axes: AxisResult[]
}

export interface TypeProfile {
  code: string
  nickname: string
  emoji: string
  tagline: string
  gradient: [string, string]
  blurb: string
  strengths: string[]
  blindSpots: string[]
  growth: string[]
  compatible: string[]
}

export interface HistoryEntry {
  type: string
  takenAt: number // epoch ms
  axes: AxisResult[]
}
