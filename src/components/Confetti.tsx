import { motion } from 'motion/react'
import { useMemo } from 'react'

// Lightweight confetti burst — a handful of colored chips that fling out and fall.
// Deterministic per-mount (seeded by index) so it works without Math.random anxiety.

const COLORS = ['#ff5fa2', '#ffd23f', '#7c5cff', '#2ee6c4', '#4cc9ff', '#ff9a3d']

interface Props {
  count?: number
}

export function Confetti({ count = 36 }: Props) {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // pseudo-random but stable spread
      const angle = (i / count) * Math.PI * 2
      const dist = 120 + ((i * 53) % 220)
      return {
        id: i,
        color: COLORS[i % COLORS.length],
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 80,
        rot: ((i * 47) % 360) - 180,
        delay: (i % 6) * 0.03,
        size: 8 + ((i * 7) % 8),
      }
    })
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[2px]"
          style={{ width: p.size, height: p.size * 0.6, background: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.dx,
            y: [0, p.dy, p.dy + 260],
            rotate: p.rot * 2,
            scale: [1, 1, 0.8],
          }}
          transition={{
            duration: 1.6,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
