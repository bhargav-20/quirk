import { motion } from 'motion/react'
import { LITE } from '../lib/perf'

// Drifting candy-pop blobs behind everything. Pure decoration; pointer-events off.
//
// On lite devices (touch / low-power / reduced-motion) we render a STATIC CSS
// radial-gradient instead — it looks similar but uses no `filter: blur` and no
// animation, so there is zero per-frame GPU cost. Animating a blurred layer forces
// re-rasterization every frame and is what makes weak phones stutter.

const BLOBS = [
  { color: '#ff5fa2', size: 460, x: '-10%', y: '-12%', dur: 22 },
  { color: '#ffd23f', size: 380, x: '78%', y: '4%', dur: 26 },
  { color: '#7c5cff', size: 420, x: '70%', y: '66%', dur: 30 },
  { color: '#2ee6c4', size: 340, x: '-8%', y: '70%', dur: 24 },
  { color: '#4cc9ff', size: 300, x: '40%', y: '40%', dur: 28 },
]

const LITE_GRADIENT =
  'radial-gradient(55% 50% at 8% 0%, rgba(255,95,162,0.40), transparent 70%),' +
  'radial-gradient(50% 45% at 92% 6%, rgba(255,210,63,0.38), transparent 70%),' +
  'radial-gradient(55% 55% at 85% 82%, rgba(124,92,255,0.38), transparent 70%),' +
  'radial-gradient(50% 50% at 4% 88%, rgba(46,230,196,0.36), transparent 70%),' +
  'var(--color-cream)'

export function Background() {
  if (LITE) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: LITE_GRADIENT }}
      />
    )
  }

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
            willChange: 'transform',
          }}
          // translate only (no scale) so the rasterized blur layer is just
          // composited each frame rather than re-blurred
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 20, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="absolute inset-0 bg-cream/30" />
    </div>
  )
}
