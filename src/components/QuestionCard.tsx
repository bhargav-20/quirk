import { motion, useMotionValue, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import type { Likert, Question } from '../types'
import { LikertScale } from './LikertScale'

interface Props {
  question: Question
  index: number // 0-based, for the card accent color
  value: Likert
  onAnswer: (v: Likert) => void
}

const ACCENTS = ['#ff5fa2', '#ff9a3d', '#7c5cff', '#2ee6c4', '#4cc9ff', '#ffd23f']

// Swipe thresholds in real gesture pixels (info.offset.x — NOT the elastic visual
// position, so a natural swipe registers reliably on touch).
//   right past STRONG → strongly agree (5), past MILD → agree (4)
//   left  past STRONG → strongly disagree (1), past MILD → disagree (2)
const MILD = 55
const STRONG = 150

function bucket(offset: number): Likert | 0 {
  if (offset >= STRONG) return 5
  if (offset >= MILD) return 4
  if (offset <= -STRONG) return 1
  if (offset <= -MILD) return 2
  return 0
}

// One question card. Drag it like a deck card for a quick answer, or tap the dots
// for a precise one. Either way it commits via onAnswer.
export function QuestionCard({ question, index, value, onAnswer }: Props) {
  const accent = ACCENTS[index % ACCENTS.length]
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-13, 13])

  // What a release right now would commit — shown live so the swipe is legible.
  const [hint, setHint] = useState<Likert | 0>(0)
  const hintRef = useRef<Likert | 0>(0)

  function setHintIfChanged(b: Likert | 0) {
    if (b !== hintRef.current) {
      hintRef.current = b
      setHint(b)
    }
  }

  function handleDrag(_e: unknown, info: { offset: { x: number } }) {
    setHintIfChanged(bucket(info.offset.x))
  }

  function handleDragEnd(_e: unknown, info: { offset: { x: number } }) {
    const b = bucket(info.offset.x)
    setHintIfChanged(0)
    if (b) onAnswer(b)
  }

  const agreeLabel = hint === 5 ? 'STRONGLY AGREE 💚' : hint === 4 ? 'AGREE 💚' : null
  const disagreeLabel =
    hint === 1 ? '💜 STRONGLY DISAGREE' : hint === 2 ? '💜 DISAGREE' : null

  return (
    <motion.div
      className="relative w-full max-w-md cursor-grab touch-pan-y rounded-[2rem] bg-white p-7 shadow-[0_24px_60px_-20px_rgba(43,24,64,0.45)] active:cursor-grabbing sm:p-9"
      style={{ x, rotate, borderTop: `8px solid ${accent}` }}
      drag="x"
      dragSnapToOrigin
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.99 }}
    >
      {/* live drag hint — shows exactly what releasing now will pick */}
      <div className="pointer-events-none absolute inset-x-5 top-5 flex justify-between">
        {disagreeLabel ? (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-grape px-3 py-1 text-sm font-extrabold text-white shadow"
          >
            {disagreeLabel}
          </motion.span>
        ) : (
          <span />
        )}
        {agreeLabel ? (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-mint px-3 py-1 text-sm font-extrabold text-ink shadow"
          >
            {agreeLabel}
          </motion.span>
        ) : (
          <span />
        )}
      </div>

      <div
        className="mb-5 grid h-12 w-12 place-items-center rounded-2xl text-lg font-extrabold text-white"
        style={{ background: accent }}
      >
        {question.id}
      </div>

      <p className="font-display mb-8 text-2xl font-bold leading-snug text-ink sm:text-[1.75rem]">
        {question.text}
      </p>

      <LikertScale value={value} onChange={onAnswer} />

      <p className="mt-5 text-center text-xs font-medium text-ink/40">
        Tap a dot, or swipe → to agree, ← to disagree (further = stronger)
      </p>
    </motion.div>
  )
}
