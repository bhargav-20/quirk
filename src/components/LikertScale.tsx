import { motion } from 'motion/react'
import type { Likert } from '../types'

interface Props {
  value: Likert
  onChange: (v: Likert) => void
}

// 5-point agree/disagree scale rendered as growing candy dots.
// Left = disagree (grape), right = agree (mint), neutral in the middle.
const DOTS: { value: Exclude<Likert, 0>; size: number; color: string; label: string }[] = [
  { value: 1, size: 56, color: '#7c5cff', label: 'Strongly disagree' },
  { value: 2, size: 44, color: '#9b86ff', label: 'Disagree' },
  { value: 3, size: 34, color: '#c9bfd6', label: 'Neutral' },
  { value: 4, size: 44, color: '#62e0c0', label: 'Agree' },
  { value: 5, size: 56, color: '#2ee6c4', label: 'Strongly agree' },
]

export function LikertScale({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
        <span>Disagree</span>
        <span>Agree</span>
      </div>
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {DOTS.map((dot) => {
          const selected = value === dot.value
          return (
            <button
              key={dot.value}
              type="button"
              aria-label={dot.label}
              aria-pressed={selected}
              onClick={() => onChange(dot.value)}
              className="ring-fun grid flex-1 place-items-center rounded-full"
              style={{ height: 64 }}
            >
              <motion.span
                className="block rounded-full"
                style={{
                  width: dot.size,
                  height: dot.size,
                  background: selected ? dot.color : 'transparent',
                  border: `3px solid ${dot.color}`,
                  boxShadow: selected ? `0 6px 18px -4px ${dot.color}` : 'none',
                }}
                animate={{ scale: selected ? 1.12 : 1 }}
                whileHover={{ scale: 1.18 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
