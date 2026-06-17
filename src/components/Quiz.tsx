import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Likert, QuizResult } from '../types'
import { QUESTIONS } from '../data/questions'
import { scoreAnswers } from '../lib/scoring'
import { loadProgress, saveProgress } from '../lib/storage'
import { QuestionCard } from './QuestionCard'
import { ProgressJourney } from './ProgressJourney'

interface Props {
  onComplete: (result: QuizResult) => void
  onExit: () => void
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0, scale: 0.9 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0, scale: 0.9 }),
}

export function Quiz({ onComplete, onExit }: Props) {
  // Resume from persisted progress if the user reloaded mid-quiz. App clears the
  // saved progress before mounting a fresh run, so this is 0/{} for a new quiz.
  const saved = useRef(loadProgress())
  const [index, setIndex] = useState(() => saved.current?.index ?? 0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Record<number, Likert>>(
    () => saved.current?.answers ?? {},
  )

  // Guards against a fast double-tap queueing two advances (which would push
  // `index` past the last question). Reset once the next card is in place.
  const advancing = useRef(false)

  // Persist progress on every step so a reload resumes exactly here.
  useEffect(() => {
    saveProgress({ index, answers })
  }, [index, answers])

  const question = QUESTIONS[index]
  const isLast = index === QUESTIONS.length - 1

  function handleAnswer(v: Likert) {
    if (advancing.current) return
    advancing.current = true

    const next = { ...answers, [question.id]: v }
    setAnswers(next)

    if (isLast) {
      // small beat so the dot selection registers visually
      window.setTimeout(() => onComplete(scoreAnswers(next)), 260)
    } else {
      window.setTimeout(() => {
        setDirection(1)
        setIndex((i) => i + 1)
        advancing.current = false
      }, 240)
    }
  }

  function goBack() {
    if (advancing.current) return
    if (index === 0) {
      onExit()
      return
    }
    setDirection(-1)
    setIndex((i) => i - 1)
  }

  // Defensive: never render past the deck (should be impossible with the guard).
  if (!question) return null

  return (
    <div className="safe-x safe-y mx-auto flex min-h-dvh w-full max-w-xl flex-col">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={goBack}
          className="ring-fun rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:bg-white"
        >
          ← {index === 0 ? 'Quit' : 'Back'}
        </button>
        <div className="flex-1">
          <ProgressJourney current={index + 1} total={QUESTIONS.length} />
        </div>
      </div>

      {/* clip horizontal card motion (enter/exit slide + drag) so it never creates
          document-level overflow that would shift the viewport-anchored feedback */}
      <div className="relative flex flex-1 items-center justify-center overflow-x-clip">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="flex w-full justify-center"
          >
            <QuestionCard
              question={question}
              index={index}
              value={answers[question.id] ?? 0}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
