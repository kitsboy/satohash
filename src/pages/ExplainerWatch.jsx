import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, ArrowRight, RotateCcw, Mic, MicOff } from 'lucide-react'
import MarketingDesktopNav from '../components/layout/MarketingDesktopNav'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

const BEATS = [
  {
    id: 'kimi',
    src: '/media/video/kimi-teacher.jpg',
    start: 0,
    end: 3,
    title: 'Hook',
    line: 'If it matters… stamp it onto Bitcoin.',
    overlay: null
  },
  {
    id: 'hero',
    src: '/media/video/01-stamp-hero.jpg',
    start: 3,
    end: 10,
    title: 'Stamp',
    line: 'Permanent proof of existence—without trusting a company forever.',
    overlay: 'Proof, not promises'
  },
  {
    id: 'flow',
    src: '/media/video/02-single-stamp-flow.jpg',
    start: 10,
    end: 25,
    title: 'How it works',
    line: 'Hash locally. Three calendars. Anchored in Bitcoin.',
    overlay: 'File → Hash → Calendar → Bitcoin'
  },
  {
    id: 'batch',
    src: '/media/video/03-batch-stamp.jpg',
    start: 25,
    end: 40,
    title: 'Batch',
    line: 'Whole folders. One cryptographic commitment. Free today.',
    overlay: 'Batch stamp'
  },
  {
    id: 'verify',
    src: '/media/video/04-verify-check.jpg',
    start: 40,
    end: 47,
    title: 'Verify',
    line: 'Trust, but verify—with open tools.',
    overlay: 'Independently verifiable'
  },
  {
    id: 'anchor',
    src: '/media/video/05-bitcoin-anchor.jpg',
    start: 47,
    end: 52,
    title: 'Anchor',
    line: 'When Bitcoin confirms, the proof is locked in.',
    overlay: 'Permanent'
  },
  {
    id: 'cta',
    src: '/media/video/06-cta-split.jpg',
    start: 52,
    end: 60,
    title: 'CTA',
    line: 'satohash.io — Free. Sovereign. Private.',
    overlay: 'Start free · No account'
  }
]

const TOTAL = 60

function beatAt(t) {
  return BEATS.find((b) => t >= b.start && t < b.end) || BEATS[BEATS.length - 1]
}

export default function ExplainerWatch() {
  usePageMeta({
    title: '60‑second explainer — Satohash',
    description:
      'Watch how Satohash stamps files onto Bitcoin with OpenTimestamps. Free. Sovereign. Private.'
  })

  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [muted, setMuted] = useState(false)
  const [voOn, setVoOn] = useState(false)
  const [bgmReady, setBgmReady] = useState(false)
  const rafRef = useRef(null)
  const lastRef = useRef(null)
  const audioRef = useRef(null)
  const spokenBeatRef = useRef(null)

  const beat = useMemo(() => beatAt(t), [t])
  const progress = Math.min(100, (t / TOTAL) * 100)

  const voRef = useRef(null)
  const [hasRealVo, setHasRealVo] = useState(false)

  // BGM — production track under VO (~-18dB headroom baked in)
  useEffect(() => {
    const a = new Audio('/media/video/satohash-explainer-music.mp3')
    a.loop = true
    a.volume = muted ? 0 : 0.28
    a.preload = 'auto'
    audioRef.current = a
    a.addEventListener('canplaythrough', () => setBgmReady(true), { once: true })

    // Optional recorded VO from THOR (drop as vo-complete.mp3)
    const vo = new Audio('/media/video/vo-complete.mp3')
    vo.preload = 'auto'
    vo.volume = muted ? 0 : 0.95
    voRef.current = vo
    vo.addEventListener(
      'canplaythrough',
      () => {
        setHasRealVo(true)
        setVoOn(true) // prefer real VO when present
      },
      { once: true }
    )
    vo.addEventListener(
      'error',
      () => {
        setHasRealVo(false)
      },
      { once: true }
    )

    return () => {
      a.pause()
      a.src = ''
      vo.pause()
      vo.src = ''
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 0.28
    if (voRef.current) voRef.current.volume = muted ? 0 : 0.95
  }, [muted])

  // Real recorded VO sync (when file exists)
  useEffect(() => {
    const vo = voRef.current
    if (!vo || !hasRealVo) return
    if (playing && voOn) {
      // keep VO time roughly aligned with slideshow clock
      if (Math.abs(vo.currentTime - t) > 0.45) {
        try {
          vo.currentTime = Math.min(t, vo.duration || t)
        } catch {
          /* ignore seek race */
        }
      }
      vo.play().catch(() => {})
    } else {
      vo.pause()
    }
  }, [playing, voOn, hasRealVo, t])

  // Browser TTS only as preview when no real VO
  useEffect(() => {
    if (hasRealVo) return
    if (!playing || !voOn || typeof window === 'undefined' || !window.speechSynthesis) return
    if (spokenBeatRef.current === beat.id) return
    spokenBeatRef.current = beat.id
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(beat.line)
    u.rate = 0.95
    u.pitch = 1.05
    u.volume = muted ? 0 : 0.9
    const voices = window.speechSynthesis.getVoices()
    const en =
      voices.find((v) => /en-GB|British|UK/i.test(v.lang + v.name)) ||
      voices.find((v) => /^en/i.test(v.lang))
    if (en) u.voice = en
    window.speechSynthesis.speak(u)
  }, [beat, playing, voOn, muted, hasRealVo])

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (audioRef.current) audioRef.current.pause()
      if (voRef.current) voRef.current.pause()
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      return undefined
    }

    lastRef.current = null
    if (audioRef.current && bgmReady) {
      audioRef.current.play().catch(() => {})
    }

    const tick = (now) => {
      if (!lastRef.current) lastRef.current = now
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now
      setT((prev) => {
        const next = prev + dt
        if (next >= TOTAL) {
          setPlaying(false)
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
          if (voRef.current) {
            voRef.current.pause()
            voRef.current.currentTime = 0
          }
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel()
          }
          return TOTAL
        }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, bgmReady])

  const toggle = () => {
    if (t >= TOTAL) {
      setT(0)
      spokenBeatRef.current = null
      if (audioRef.current) audioRef.current.currentTime = 0
      if (voRef.current) voRef.current.currentTime = 0
    }
    setPlaying((p) => !p)
  }

  const restart = () => {
    setPlaying(false)
    setT(0)
    spokenBeatRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (voRef.current) {
      voRef.current.pause()
      voRef.current.currentTime = 0
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }

  const seekBeat = (b) => {
    setT(b.start + 0.01)
    spokenBeatRef.current = null
    if (playing && audioRef.current) {
      // keep playing
    }
  }

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <MarketingDesktopNav />

      <main className="layout-container max-w-5xl px-4 pt-[calc(4.5rem+env(safe-area-inset-top))] pb-16 sm:px-6 sm:pt-24">
        <div className="mb-6 text-center sm:mb-8">
          <p
            className="mb-2 text-[10px] font-black tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            60‑second explainer
          </p>
          <h1 className="font-display text-2xl font-black tracking-tight sm:text-4xl">
            Stamp it onto <span className="gold-text">Bitcoin</span>
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
            Teacher Kimi’s script · production graphics · low ambient score under the VO
          </p>
        </div>

        {/* Stage */}
        <div
          className="relative overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl"
          style={{
            borderColor: 'var(--border)',
            background: '#05070a',
            aspectRatio: '16 / 10'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={beat.id}
              src={beat.src}
              alt={beat.title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Gradients for text legibility */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(5,7,10,0.15) 0%, transparent 35%, rgba(5,7,10,0.75) 100%)'
            }}
          />

          {/* Kimi PIP on CTA */}
          {beat.id === 'cta' && (
            <img
              src="/media/video/kimi-teacher.jpg"
              alt=""
              className="absolute right-3 bottom-20 h-20 w-20 rounded-full border-2 object-cover shadow-xl sm:right-6 sm:bottom-24 sm:h-28 sm:w-28"
              style={{ borderColor: 'rgba(240,180,41,0.6)' }}
            />
          )}

          {/* Overlay copy */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
            {beat.overlay && (
              <p
                className="mb-1 text-[10px] font-black tracking-[0.2em] uppercase sm:text-xs"
                style={{ color: 'var(--accent-gold)', textShadow: '0 0 20px rgba(240,180,41,0.4)' }}
              >
                {beat.overlay}
              </p>
            )}
            <p className="max-w-2xl text-base leading-snug font-semibold text-white sm:text-xl md:text-2xl">
              {beat.line}
            </p>
            <p className="mt-2 text-[11px] font-medium text-white/60 sm:text-xs">
              {beat.title} · {fmt(beat.start)}–{fmt(beat.end)}
            </p>
          </div>

          {/* Play affordance when paused at start */}
          {!playing && t < 0.2 && (
            <button
              type="button"
              onClick={toggle}
              className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
              aria-label="Play explainer"
            >
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                <Play size={28} fill="currentColor" className="ml-1" />
              </span>
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div
            className="h-1.5 overflow-hidden rounded-full"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #F7931A, #F0B429)'
              }}
            />
          </div>
          <div
            className="mt-2 flex justify-between text-[11px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>{fmt(t)}</span>
            <span>{fmt(TOTAL)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-6 text-sm font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? 'Pause' : t >= TOTAL ? 'Play again' : 'Play'}
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 text-sm font-bold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <RotateCcw size={16} /> Restart
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 text-sm font-bold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            title="Toggle ambient music"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? 'Music off' : 'Music on'}
          </button>
          <button
            type="button"
            onClick={() => {
              setVoOn((v) => !v)
              spokenBeatRef.current = null
              if (window.speechSynthesis) window.speechSynthesis.cancel()
            }}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 text-sm font-bold"
            style={{
              borderColor: voOn ? 'var(--accent-gold)' : 'var(--border)',
              color: voOn ? 'var(--accent-gold)' : 'var(--text-primary)'
            }}
            title={
              hasRealVo
                ? 'Recorded voiceover (vo-complete.mp3)'
                : 'Browser voice preview — drop vo-complete.mp3 for real Kimi VO'
            }
          >
            {voOn ? <Mic size={16} /> : <MicOff size={16} />}
            {hasRealVo ? (voOn ? 'VO on' : 'VO off') : voOn ? 'VO preview on' : 'VO preview'}
          </button>
          <Link
            to="/stamp"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-5 text-sm font-black uppercase"
            style={{ borderColor: 'rgba(240,180,41,0.45)', color: 'var(--accent-gold)' }}
          >
            Stamp free <ArrowRight size={16} />
          </Link>
        </div>

        {/* Beat strip */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {BEATS.map((b) => {
            const active = beat.id === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => seekBeat(b)}
                className="group overflow-hidden rounded-xl border text-left transition-all"
                style={{
                  borderColor: active ? 'var(--accent-gold)' : 'var(--border)',
                  boxShadow: active ? '0 0 0 1px rgba(240,180,41,0.35)' : 'none'
                }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={b.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-2">
                  <p
                    className="text-[9px] font-black tracking-wider uppercase"
                    style={{ color: active ? 'var(--accent-gold)' : 'var(--text-secondary)' }}
                  >
                    {fmt(b.start)}
                  </p>
                  <p className="truncate text-[11px] font-bold">{b.title}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Script panel */}
        <section
          className="mt-10 rounded-2xl border p-5 sm:p-8"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <h2 className="font-display text-lg font-black sm:text-xl">
            Full script <span className="gold-text">(Kimi VO)</span>
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            We only had a timing outline earlier—this is the production read. Also in{' '}
            <code className="text-[var(--accent-gold)]">public/media/video/SCRIPT.md</code>
          </p>
          <ol className="mt-6 space-y-4">
            {BEATS.map((b) => (
              <li
                key={b.id}
                className="flex gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4"
                style={{
                  borderColor: beat.id === b.id ? 'rgba(240,180,41,0.45)' : 'var(--border)',
                  background: beat.id === b.id ? 'rgba(240,180,41,0.06)' : 'var(--bg-primary)'
                }}
              >
                <span
                  className="shrink-0 text-[10px] font-black tracking-wider uppercase"
                  style={{ color: 'var(--accent-gold)', minWidth: '3.5rem' }}
                >
                  {fmt(b.start)}
                </span>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                    {b.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed sm:text-[15px]">{b.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  )
}
