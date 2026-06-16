import type { Axis, QuizResult, TypeProfile } from '../types'

// Renders a shareable "personality badge" (1200×630, the universal social-card
// ratio) onto a canvas using only the Canvas 2D API — no dependencies, pixel-perfect,
// and the on-screen preview IS the exported image.

export const BADGE_W = 1200
export const BADGE_H = 630

const SITE = 'bhargav-20.github.io/quirk'

const AXIS_META: Record<Axis, { first: string; second: string; color: string }> = {
  EI: { first: 'Extravert', second: 'Introvert', color: '#ff5fa2' },
  SN: { first: 'Sensing', second: 'Intuition', color: '#ff9a3d' },
  TF: { first: 'Thinking', second: 'Feeling', color: '#7c5cff' },
  JP: { first: 'Judging', second: 'Perceiving', color: '#2ee6c4' },
}

// Make sure the web fonts are ready before drawing (canvas won't wait on its own).
async function ensureFonts(): Promise<void> {
  if (!('fonts' in document)) return
  const faces = [
    '800 120px "Baloo 2"',
    '700 46px "Baloo 2"',
    '600 28px "Quicksand"',
    '700 30px "Quicksand"',
  ]
  try {
    await Promise.all(faces.map((f) => (document as Document).fonts.load(f)))
    await (document as Document).fonts.ready
  } catch {
    /* fall back to system fonts */
  }
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
      if (lines.length === maxLines - 1) break
    } else {
      line = test
    }
  }
  if (line && lines.length < maxLines) lines.push(line)
  return lines
}

export async function drawBadge(
  canvas: HTMLCanvasElement,
  result: QuizResult,
  profile: TypeProfile,
): Promise<void> {
  await ensureFonts()

  canvas.width = BADGE_W
  canvas.height = BADGE_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // ── background gradient (the profile's signature colors) ──────────────────
  const bg = ctx.createLinearGradient(0, 0, BADGE_W, BADGE_H)
  bg.addColorStop(0, profile.gradient[0])
  bg.addColorStop(1, profile.gradient[1])
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, BADGE_W, BADGE_H)

  // giant translucent emoji watermark, bottom-left
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.font = '420px "Baloo 2", system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(profile.emoji, -40, BADGE_H + 110)
  ctx.restore()

  const PAD = 64
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // ── left column: identity ─────────────────────────────────────────────────
  // wordmark
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = '700 38px "Baloo 2", system-ui, sans-serif'
  ctx.fillText('✦ Quirk', PAD, 92)

  // soft shadow for legibility on lighter gradients
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.28)'
  ctx.shadowBlur = 18
  ctx.shadowOffsetY = 4

  // emoji
  ctx.font = '96px "Baloo 2", system-ui, sans-serif'
  ctx.fillText(profile.emoji, PAD, 232)

  // type code
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 122px "Baloo 2", system-ui, sans-serif'
  ctx.fillText(result.type, PAD - 4, 360)

  // nickname
  ctx.font = '700 46px "Baloo 2", system-ui, sans-serif'
  ctx.fillText(profile.nickname, PAD, 426)
  ctx.restore()

  // tagline (wrapped)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = '600 27px "Quicksand", system-ui, sans-serif'
  const tagLines = wrapLines(ctx, profile.tagline, 560, 3)
  tagLines.forEach((ln, i) => ctx.fillText(ln, PAD, 474 + i * 36))

  // ── right column: stat panel ──────────────────────────────────────────────
  const panelX = 712
  const panelY = 96
  const panelW = BADGE_W - panelX - PAD
  const panelH = 410
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.18)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 8
  ctx.fillStyle = 'rgba(255,255,255,0.94)'
  roundRectPath(ctx, panelX, panelY, panelW, panelH, 28)
  ctx.fill()
  ctx.restore()

  const innerX = panelX + 30
  const innerW = panelW - 60

  ctx.fillStyle = '#2b1840'
  ctx.font = '700 26px "Quicksand", system-ui, sans-serif'
  ctx.fillText('YOUR LEANINGS', innerX, panelY + 48)

  const rowTop0 = panelY + 78
  const rowH = 80
  result.axes.forEach((a, i) => {
    const meta = AXIS_META[a.axis]
    const leansFirst = a.firstPolePercent >= 50
    const word = leansFirst ? meta.first : meta.second
    const letter = leansFirst ? a.axis[0] : a.axis[1]
    const rowTop = rowTop0 + i * rowH

    // label + percent
    ctx.fillStyle = '#2b1840'
    ctx.font = '700 24px "Quicksand", system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${word} (${letter})`, innerX, rowTop + 20)

    ctx.fillStyle = meta.color
    ctx.font = '800 24px "Quicksand", system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${a.clarity}%`, innerX + innerW, rowTop + 20)
    ctx.textAlign = 'left'

    // center-out meter
    const barY = rowTop + 36
    const barH = 16
    ctx.fillStyle = 'rgba(43,24,64,0.08)'
    roundRectPath(ctx, innerX, barY, innerW, barH, barH / 2)
    ctx.fill()

    const centerX = innerX + innerW / 2
    const half = innerW / 2
    const fillW = Math.max(0, ((a.clarity - 50) / 50) * half)
    ctx.fillStyle = meta.color
    if (leansFirst) {
      roundRectPath(ctx, centerX - fillW, barY, fillW, barH, barH / 2)
    } else {
      roundRectPath(ctx, centerX, barY, fillW, barH, barH / 2)
    }
    ctx.fill()

    // center tick
    ctx.fillStyle = 'rgba(43,24,64,0.18)'
    ctx.fillRect(centerX - 1, barY - 2, 2, barH + 4)
  })

  // ── footer ────────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '600 24px "Quicksand", system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Take the quiz · ${SITE}`, PAD, BADGE_H - 34)

  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText('AI-generated · just for fun', BADGE_W - PAD, BADGE_H - 34)
  ctx.textAlign = 'left'
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // give the browser a tick to start the download before revoking
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}
