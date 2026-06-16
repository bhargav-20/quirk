import { AnimatePresence, motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { DISCLAIMER_PARAGRAPHS } from '../data/disclaimer'

interface Props {
  open: boolean
  onClose: () => void
}

// Portaled to <body> so backdrop-filter / transformed ancestors can't trap the
// fixed positioning.
export function Disclaimer({ open, onClose }: Props) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/60" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="About Quirk"
            className="relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] shadow-2xl"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display mb-4 text-2xl font-extrabold text-ink">
              The honest fine print 🫶
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink/75">
              {DISCLAIMER_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <button
              onClick={onClose}
              className="ring-fun mt-6 w-full rounded-full bg-grape py-3 font-extrabold text-white transition hover:brightness-110 active:scale-95"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
