// One-time device capability check. When `LITE` is true we drop the expensive
// always-on effects (animated blur, perpetual loops) that make weak/mobile GPUs
// crawl — interaction animations (card swipe, reveal) still run.
//
// Computed once at module load: reduced-motion preference, low memory/cores, or a
// touch device all opt into lite mode. Touch devices are included deliberately —
// the ambient background drift is pure decoration and not worth dropped frames.

function computeLite(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    const nav = navigator as Navigator & { deviceMemory?: number }
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return true
    if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return true
    if (window.matchMedia('(pointer: coarse)').matches) return true
  } catch {
    /* matchMedia/navigator unavailable — assume full effects */
  }
  return false
}

export const LITE = computeLite()
