import { motion } from 'motion/react'
import type { Axis, AxisResult } from '../types'

interface Props {
  axes: AxisResult[]
}

const LABELS: Record<Axis, { first: string; second: string; color: string }> = {
  EI: { first: 'Extravert', second: 'Introvert', color: '#ff5fa2' },
  SN: { first: 'Sensing', second: 'Intuition', color: '#ff9a3d' },
  TF: { first: 'Thinking', second: 'Feeling', color: '#7c5cff' },
  JP: { first: 'Judging', second: 'Perceiving', color: '#2ee6c4' },
}

// Each bar is a center-out meter: the fill grows from the middle toward whichever
// pole won. The clarity % lives in the label row next to the winning pole (50 = a
// coin-flip, 100 = a landslide) — kept out of the bar so it never collides with the
// fill on narrow screens.
export function ConfidenceBars({ axes }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {axes.map((a, i) => {
        const meta = LABELS[a.axis]
        const leansFirst = a.firstPolePercent >= 50
        const widthPct = Math.max(0, a.clarity - 50) // 0–50% of the full track

        return (
          <div key={a.axis}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span
                className={
                  leansFirst
                    ? 'font-extrabold'
                    : 'font-medium text-ink/35'
                }
                style={leansFirst ? { color: meta.color } : undefined}
              >
                {meta.first} ({a.axis[0]}){leansFirst ? ` · ${a.clarity}%` : ''}
              </span>
              <span
                className={
                  !leansFirst
                    ? 'font-extrabold'
                    : 'font-medium text-ink/35'
                }
                style={!leansFirst ? { color: meta.color } : undefined}
              >
                {!leansFirst ? `${a.clarity}% · ` : ''}({a.axis[1]}) {meta.second}
              </span>
            </div>
            <div className="relative h-7 w-full overflow-hidden rounded-full bg-white/70 shadow-inner">
              {/* center tick */}
              <div className="absolute left-1/2 top-0 z-10 h-full w-0.5 -translate-x-1/2 bg-ink/15" />
              <motion.div
                className="absolute inset-y-0 rounded-full"
                style={{
                  background: meta.color,
                  left: leansFirst ? `${50 - widthPct}%` : '50%',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{
                  type: 'spring',
                  stiffness: 90,
                  damping: 18,
                  delay: 0.25 + i * 0.12,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
