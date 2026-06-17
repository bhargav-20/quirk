import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react'
import { createPortal } from 'react-dom'
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

const STAMP: Record<Exclude<Likert, 0 | 3>, { text: string; agree: boolean; strong: boolean }> = {
  5: { text: 'STRONGLY AGREE 💚', agree: true, strong: true },
  4: { text: 'AGREE 💚', agree: true, strong: false },
  2: { text: '💜 DISAGREE', agree: false, strong: false },
  1: { text: '💜 STRONGLY DISAGREE', agree: false, strong: true },
}

// One question card. Drag it like a deck card for a quick answer, or tap the dots
// for a precise one. Either way it commits via onAnswer.
//
// The live "what will I pick" feedback is a stamp anchored to the VIEWPORT (portaled
// to <body> so the card's own transforms can't trap its fixed position) — it stays
// put and readable while the card slides away under your finger.
export function QuestionCard({ question, index, value, onAnswer }: Props) {
  const accent = ACCENTS[index % ACCENTS.length]
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-13, 13])

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

  const stamp = hint === 0 ? null : STAMP[hint as Exclude<Likert, 0 | 3>]

  return (
    <>
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

      {/* viewport-anchored live feedback — pinned to the TOP so a thumb can't cover
          it, and a single persistent pill (no remount on intensity change) so its
          width MORPHS smoothly between "agree" and "strongly agree" via `layout`. */}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+5.25rem)] z-40 flex justify-center px-4">
          <AnimatePresence>
            {stamp && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className={`flex items-center rounded-full px-6 py-3 font-extrabold shadow-xl ${
                  stamp.agree ? 'bg-mint text-ink' : 'bg-grape text-white'
                } ${stamp.strong ? 'text-lg' : 'text-base'}`}
              >
                <motion.span layout="position" className="whitespace-nowrap">
                  {stamp.text}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  )
}
