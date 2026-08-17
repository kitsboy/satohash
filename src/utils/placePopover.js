/**
 * Place a fixed popover so it stays fully inside the viewport.
 * Used by tooltips, language menu, and other hover/click flyouts.
 */
export function placePopover(
  rect,
  { width = 280, height = 160, gap = 8, pad = 12, prefer = 'above' } = {}
) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 390
  const vh = typeof window !== 'undefined' ? window.innerHeight : 844

  const w = Math.max(80, Math.min(width, vw - pad * 2))
  const h = Math.max(48, Math.min(height, vh - pad * 2))

  const spaceBelow = vh - rect.bottom - gap - pad
  const spaceAbove = rect.top - gap - pad
  const need = Math.min(h, 96)

  let side
  if (prefer === 'below') {
    side = spaceBelow >= need || spaceBelow >= spaceAbove ? 'below' : 'above'
  } else {
    side = spaceAbove >= need || spaceAbove >= spaceBelow ? 'above' : 'below'
  }

  let top
  if (side === 'below') {
    top = rect.bottom + gap
    if (top + h > vh - pad) top = Math.max(pad, vh - pad - h)
  } else {
    top = rect.top - gap - h
    if (top < pad) top = pad
  }

  let left = rect.left + rect.width / 2 - w / 2
  if (left < pad) left = pad
  if (left + w > vw - pad) left = vw - pad - w

  return { top, left, width: w, maxHeight: h, side }
}

export function canHoverFine() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
