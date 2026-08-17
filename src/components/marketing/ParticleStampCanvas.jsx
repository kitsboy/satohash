import { useEffect, useRef } from 'react'

/** Lean landing hero canvas — not the v5 page barrel. */
export default function ParticleStampCanvas({ className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio)
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio)
    const parts = Array.from({ length: 48 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      conf: Math.random() > 0.55
    }))
    let raf
    let last = 0
    let active = true
    const draw = (t) => {
      raf = requestAnimationFrame(draw)
      if (!active || t - last < 33) return
      last = t
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.2 * devicePixelRatio, 0, Math.PI * 2)
        ctx.fillStyle = p.conf ? '#d4a017' : '#3b82f6'
        ctx.fill()
      }
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i]
          const b = parts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 90 * devicePixelRatio) {
            ctx.strokeStyle = `rgba(212,160,23,${0.15 * (1 - d / (90 * devicePixelRatio))})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }
    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting && !document.hidden
    })
    io.observe(canvas)
    const onVis = () => {
      active = !document.hidden
    }
    document.addEventListener('visibilitychange', onVis)
    draw(0)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])
  return <canvas ref={ref} className={`h-full w-full ${className}`} aria-hidden />
}
