import { motion } from 'motion/react'
import { useState } from 'react'
import type { QuizResult } from '../types'
import { PROFILES } from '../data/profiles'
import { ConfidenceBars } from './ConfidenceBars'
import { Confetti } from './Confetti'
import { ShareModal } from './ShareModal'
import { DISCLAIMER_SHORT } from '../data/disclaimer'

interface Props {
  result: QuizResult
  onRetake: () => void
  onShowDisclaimer: () => void
  shared?: boolean
}

export function Results({ result, onRetake, onShowDisclaimer, shared }: Props) {
  const profile = PROFILES[result.type]
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <div className="safe-x safe-y relative mx-auto w-full max-w-2xl [--sy:2.5rem]">
      <Confetti />

      {/* Hero reveal */}
      <div
        className="relative overflow-hidden rounded-[2.5rem] p-8 text-center text-white shadow-2xl sm:p-12"
        style={{
          background: `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`,
        }}
      >
        {shared && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/70">
            Shared result
          </p>
        )}

        <div className="mb-3 flex justify-center gap-1 sm:gap-2">
          {result.type.split('').map((letter, i) => (
            <motion.span
              key={i}
              className="font-display inline-block text-6xl font-extrabold sm:text-8xl"
              initial={{ y: -60, opacity: 0, rotate: -20 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 14,
                delay: i * 0.12,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="text-5xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.6 }}
        >
          {profile.emoji}
        </motion.div>

        <motion.h1
          className="font-display mt-2 text-3xl font-extrabold sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {profile.nickname}
        </motion.h1>
        <motion.p
          className="mx-auto mt-2 max-w-md text-lg font-medium text-white/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          {profile.tagline}
        </motion.p>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-6 flex flex-col gap-6"
      >
        <Card>
          <p className="text-lg leading-relaxed text-ink/80">{profile.blurb}</p>
        </Card>

        <Card>
          <SectionTitle>Your leanings</SectionTitle>
          <ConfidenceBars axes={result.axes} />
        </Card>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <SectionTitle>💪 Strengths</SectionTitle>
            <List items={profile.strengths} />
          </Card>
          <Card>
            <SectionTitle>🌀 Blind spots</SectionTitle>
            <List items={profile.blindSpots} />
          </Card>
          <Card>
            <SectionTitle>🌱 Growth</SectionTitle>
            <List items={profile.growth} />
          </Card>
        </div>

        <Card>
          <SectionTitle>🤝 Plays well with</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {profile.compatible.map((code) => {
              const p = PROFILES[code]
              return (
                <span
                  key={code}
                  className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-ink shadow-sm"
                >
                  {p.emoji} {code} · {p.nickname}
                </span>
              )
            })}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setShareOpen(true)}
            className="ring-fun rounded-full bg-grape px-6 py-3 font-extrabold text-white shadow-lg transition hover:brightness-110 active:scale-95"
          >
            ✨ Share my type
          </button>
          <button
            onClick={onRetake}
            className="ring-fun rounded-full bg-white px-6 py-3 font-extrabold text-ink shadow transition hover:bg-cream active:scale-95"
          >
            🔁 {shared ? 'Take the quiz' : 'Retake'}
          </button>
        </div>

        <button
          onClick={onShowDisclaimer}
          className="mx-auto text-center text-xs font-medium text-ink/40 underline-offset-2 hover:underline"
        >
          {DISCLAIMER_SHORT}
        </button>
      </motion.div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        result={result}
        profile={profile}
      />
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow-[0_16px_40px_-22px_rgba(43,24,64,0.5)] backdrop-blur">
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display mb-3 text-lg font-extrabold text-ink">{children}</h3>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((it) => (
        <li key={it} className="flex gap-2 text-sm text-ink/75">
          <span className="text-grape">◆</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}
