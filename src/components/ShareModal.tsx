import { AnimatePresence, motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import type { QuizResult, TypeProfile } from '../types'
import { BADGE_H, BADGE_W, canvasToBlob, downloadBlob, drawBadge } from '../lib/badge'
import { buildShareUrl } from '../lib/share'

interface Props {
  open: boolean
  onClose: () => void
  result: QuizResult
  profile: TypeProfile
}

type Toast = '' | 'Link copied!' | 'Image downloaded' | 'Couldn’t share — try Download'

export function ShareModal({ open, onClose, result, profile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState<Toast>('')

  // (re)draw the badge whenever the modal opens for this result
  useEffect(() => {
    if (!open || !canvasRef.current) return
    setReady(false)
    let cancelled = false
    drawBadge(canvasRef.current, result, profile).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [open, result, profile])

  function flash(msg: Toast) {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2200)
  }

  const filename = `quirk-${result.type}.png`
  const shareUrl = buildShareUrl(result)
  const shareText = `I'm ${result.type} — ${profile.nickname} ${profile.emoji} on Quirk! What's your type?`

  async function getBlob(): Promise<Blob | null> {
    return canvasRef.current ? canvasToBlob(canvasRef.current) : null
  }

  async function handleShare() {
    const blob = await getBlob()
    if (!blob) return
    const file = new File([blob], filename, { type: 'image/png' })
    const canShareFiles =
      typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })

    if (canShareFiles) {
      try {
        await navigator.share({ files: [file], text: shareText, url: shareUrl, title: 'Quirk' })
        return
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return // user cancelled
      }
    } else if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url: shareUrl, title: 'Quirk' })
        return
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
      }
    }
    // no share support (most desktops) → download the image instead
    downloadBlob(blob, filename)
    flash('Image downloaded')
  }

  async function handleDownload() {
    const blob = await getBlob()
    if (!blob) return
    downloadBlob(blob, filename)
    flash('Image downloaded')
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      flash('Link copied!')
    } catch {
      flash('Couldn’t share — try Download')
    }
  }

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
          <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Share your type"
            className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl bg-cream p-5 shadow-2xl sm:p-7"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display mb-3 text-center text-2xl font-extrabold text-ink">
              Share your badge ✨
            </h2>

            {/* live badge preview (this canvas IS the exported image) */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-ink/5">
              <canvas
                ref={canvasRef}
                width={BADGE_W}
                height={BADGE_H}
                className="block h-auto w-full"
                style={{ aspectRatio: `${BADGE_W} / ${BADGE_H}` }}
              />
              {!ready && (
                <div className="absolute inset-0 grid place-items-center bg-cream/60 text-sm font-semibold text-ink/50">
                  drawing your badge…
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleShare}
                className="ring-fun rounded-full bg-grape px-6 py-3 font-extrabold text-white shadow-lg transition hover:brightness-110 active:scale-95"
              >
                📤 Share
              </button>
              <button
                onClick={handleDownload}
                className="ring-fun rounded-full bg-white px-6 py-3 font-extrabold text-ink shadow transition hover:bg-cream active:scale-95"
              >
                ⬇️ Download
              </button>
              <button
                onClick={handleCopyLink}
                className="ring-fun rounded-full bg-white px-6 py-3 font-extrabold text-ink shadow transition hover:bg-cream active:scale-95"
              >
                🔗 Copy link
              </button>
            </div>

            <div className="mt-3 h-5 text-center text-sm font-bold text-grape">{toast}</div>

            <button
              onClick={onClose}
              className="mx-auto mt-1 block text-sm font-medium text-ink/40 hover:underline"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
