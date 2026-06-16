import { motion } from 'motion/react'
import type { HistoryEntry } from '../types'
import { PROFILES } from '../data/profiles'
import { DISCLAIMER_SHORT } from '../data/disclaimer'

interface Props {
  onStart: () => void
  onShowDisclaimer: () => void
  history: HistoryEntry[]
}

const FLOATERS = ['🦉', '🎉', '🦋', '🚀', '🎨', '🌙', '🔧', '🌻']

export function Landing({ onStart, onShowDisclaimer, history }: Props) {
  const last = history[0]
  const lastProfile = last ? PROFILES[last.type] : undefined

  return (
    <div className="safe-x safe-y mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center text-center [--sx:1.5rem] [--sy:3rem]">
      {/* floating emoji ring */}
      <div className="pointer-events-none relative mb-2 h-24 w-full">
        {FLOATERS.map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl sm:text-4xl"
            style={{ left: `${6 + i * 12}%`, top: '50%' }}
            animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
            transition={{
              duration: 2.4 + (i % 4) * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      <motion.h1
        className="font-display text-7xl font-extrabold sm:text-8xl"
        initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12 }}
        style={{
          background: 'linear-gradient(120deg,#ff5fa2,#ff9a3d,#7c5cff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Quirk
      </motion.h1>

      <motion.p
        className="mt-4 max-w-md text-xl font-semibold text-ink/70"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        What’s your type? Answer 40 playful questions and meet your 4-letter
        personality in about 4 minutes.
      </motion.p>

      <motion.button
        onClick={onStart}
        className="ring-fun mt-9 rounded-full bg-grape px-10 py-4 text-lg font-extrabold text-white shadow-[0_16px_36px_-10px_rgba(124,92,255,0.7)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 14 }}
        whileHover={{ scale: 1.06, rotate: -1 }}
        whileTap={{ scale: 0.94 }}
      >
        ✨ Discover my type
      </motion.button>

      {lastProfile && (
        <motion.button
          onClick={onStart}
          className="mt-5 rounded-full bg-white/80 px-5 py-2 text-sm font-bold text-ink/70 shadow-sm transition hover:bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Last time you were {lastProfile.emoji} {last!.type} — go again?
        </motion.button>
      )}

      <motion.button
        onClick={onShowDisclaimer}
        className="mt-10 text-xs font-medium text-ink/40 underline-offset-2 hover:underline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {DISCLAIMER_SHORT}
      </motion.button>
    </div>
  )
}
