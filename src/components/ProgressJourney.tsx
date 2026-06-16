import { motion } from 'motion/react'
import { LITE } from '../lib/perf'

interface Props {
  current: number // 1-based
  total: number
}

// A playful progress track: a gradient fill with a bouncing rocket at the head.
export function ProgressJourney({ current, total }: Props) {
  const pct = Math.max(0, Math.min(100, ((current - 1) / total) * 100))

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink/60">
        <span>
          Question <span className="text-ink">{current}</span> of {total}
        </span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-white/70 shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg,#ff5fa2,#ff9a3d,#ffd23f)',
          }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/2 text-lg"
          style={{ translateY: '-50%' }}
          animate={LITE ? { left: `calc(${pct}% - 6px)` } : { left: `calc(${pct}% - 6px)`, y: [0, -4, 0] }}
          transition={{
            left: { type: 'spring', stiffness: 120, damping: 20 },
            ...(LITE ? {} : { y: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } }),
          }}
        >
          🚀
        </motion.div>
      </div>
    </div>
  )
}
