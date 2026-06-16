import { motion, useMotionValue, useTransform } from 'motion/react'
import type { Likert, Question } from '../types'
import { LikertScale } from './LikertScale'

interface Props {
  question: Question
  index: number // 0-based, for the card accent color
  value: Likert
  onAnswer: (v: Likert) => void
}

const ACCENTS = ['#ff5fa2', '#ff9a3d', '#7c5cff', '#2ee6c4', '#4cc9ff', '#ffd23f']

// One question card. Drag it like a deck card for a quick answer, or tap the dots
// for a precise one. Either way it commits via onAnswer.
export function QuestionCard({ question, index, value, onAnswer }: Props) {
  const accent = ACCENTS[index % ACCENTS.length]
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-12, 12])
  const agreeOpacity = useTransform(x, [30, 130], [0, 1])
  const disagreeOpacity = useTransform(x, [-130, -30], [1, 0])

  function handleDragEnd() {
    const dx = x.get()
    if (dx > 120) onAnswer(5)
    else if (dx > 45) onAnswer(4)
    else if (dx < -120) onAnswer(1)
    else if (dx < -45) onAnswer(2)
  }

  return (
    <motion.div
      className="relative w-full max-w-md cursor-grab touch-pan-y rounded-[2rem] bg-white p-7 shadow-[0_24px_60px_-20px_rgba(43,24,64,0.45)] active:cursor-grabbing sm:p-9"
      style={{ x, rotate, borderTop: `8px solid ${accent}` }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      {/* drag hint badges */}
      <motion.div
        style={{ opacity: agreeOpacity }}
        className="absolute right-5 top-5 rounded-full bg-mint px-3 py-1 text-sm font-extrabold text-ink"
      >
        AGREE 💚
      </motion.div>
      <motion.div
        style={{ opacity: disagreeOpacity }}
        className="absolute left-5 top-5 rounded-full bg-grape px-3 py-1 text-sm font-extrabold text-white"
      >
        💜 NOPE
      </motion.div>

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
        tip: you can also swipe the card ← →
      </p>
    </motion.div>
  )
}
