import { motion } from 'motion/react'

// Drifting candy-pop blobs behind everything. Pure decoration; pointer-events off.
// prefers-reduced-motion is handled globally in index.css (kills the drift).

const BLOBS = [
  { color: '#ff5fa2', size: 460, x: '-10%', y: '-12%', dur: 22 },
  { color: '#ffd23f', size: 380, x: '78%', y: '4%', dur: 26 },
  { color: '#7c5cff', size: 420, x: '70%', y: '66%', dur: 30 },
  { color: '#2ee6c4', size: 340, x: '-8%', y: '70%', dur: 24 },
  { color: '#4cc9ff', size: 300, x: '40%', y: '40%', dur: 28 },
]

export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: b.color,
            opacity: 0.4,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* subtle grain/wash to keep text legible */}
      <div className="absolute inset-0 bg-cream/30" />
    </div>
  )
}
