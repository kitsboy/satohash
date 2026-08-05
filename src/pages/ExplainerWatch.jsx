import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, Volume2, VolumeX, ArrowRight, RotateCcw } from 'lucide-react'
import MarketingDesktopNav from '../components/layout/MarketingDesktopNav'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

/** 10s Kimi teaser — longer educational cut coming later. */
// Query busts CF/browser cache when same path is overwritten (old ~80s file shared the name).
const VIDEO_SRC = '/media/video/satohash-explainer-with-vo.mp4?v=10s-kimi-20260804'
const POSTER_SRC = '/media/video/kimi-teacher.jpg'
const VIDEO_SECONDS = 10

const SCRIPT_BEATS = [
  {
    id: 'hook',
    t: '0:00',
    title: 'Hook',
    line: 'Got a file that must exist — and be provable forever?'
  },
  {
    id: 'privacy',
    t: '0:03',
    title: 'Privacy',
    line: 'Your file never leaves your device. Only a fingerprint is timestamped.'
  },
  {
    id: 'anchor',
    t: '0:06',
    title: 'Bitcoin',
    line: 'Independent calendars. One Bitcoin block. A proof no one can fake.'
  },
  {
    id: 'cta',
    t: '0:08',
    title: 'CTA',
    line: 'Free. No account. Stamp it at satohash.io.'
  }
]

function fmt(s) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function ExplainerWatch() {
  usePageMeta({
    title: 'Explainer — Satohash',
    description:
      '10-second Kimi explainer: stamp files onto Bitcoin with OpenTimestamps. Free. Sovereign. Private. Longer cut coming soon.'
  })

  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [total, setTotal] = useState(VIDEO_SECONDS)
  const [muted, setMuted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [ready, setReady] = useState(false)

  const progress = total > 0 ? Math.min(100, (t / total) * 100) : 0

  const syncFromVideo = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    setT(v.currentTime || 0)
    if (Number.isFinite(v.duration) && v.duration > 0) {
      setTotal(v.duration)
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return undefined

    const onPlay = () => {
      setPlaying(true)
      setEnded(false)
    }
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      setPlaying(false)
      setEnded(true)
      setT(v.duration || total)
    }
    const onMeta = () => {
      if (Number.isFinite(v.duration) && v.duration > 0) {
        setTotal(v.duration)
      }
      setReady(true)
    }
    const onTime = () => syncFromVideo()

    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('ended', onEnded)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('durationchange', onMeta)
    v.addEventListener('timeupdate', onTime)

    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('ended', onEnded)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('durationchange', onMeta)
      v.removeEventListener('timeupdate', onTime)
    }
  }, [syncFromVideo, total])

  useEffect(() => {
    const v = videoRef.current
    if (v) v.muted = muted
  }, [muted])

  const toggle = async () => {
    const v = videoRef.current
    if (!v) return
    if (ended || (v.currentTime >= (v.duration || total) - 0.12 && !playing)) {
      v.currentTime = 0
      setEnded(false)
      setT(0)
    }
    try {
      if (v.paused) await v.play()
      else v.pause()
    } catch {
      /* autoplay / gesture policies */
    }
  }

  const restart = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setT(0)
    setEnded(false)
    setPlaying(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <MarketingDesktopNav />

      <main className="layout-container max-w-5xl px-4 pt-[calc(4.5rem+env(safe-area-inset-top,0px)+var(--satohash-health-banner-h,0px))] pb-16 sm:px-6 sm:pt-[calc(6rem+var(--satohash-health-banner-h,0px))]">
        <div className="mb-6 text-center sm:mb-8">
          <p
            className="mb-2 text-[10px] font-black tracking-[0.25em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            ~{Math.round(total)}s teaser · Kimi
          </p>
          <h1 className="font-display text-2xl font-black tracking-tight sm:text-4xl">
            Stamp it onto <span className="gold-text">Bitcoin</span>
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
            Short educational cut — file stays local, fingerprint timestamps, Bitcoin anchors the
            proof. Full-length explainer coming later.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl"
          style={{
            borderColor: 'var(--border)',
            background: '#05070a',
            aspectRatio: '16 / 9'
          }}
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full bg-black object-contain"
            onClick={toggle}
            aria-label="Satohash 10-second explainer with voiceover"
          />

          {(!playing || !ready) && !ended && t < 0.15 && (
            <button
              type="button"
              onClick={toggle}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
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

          {ended && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/55 p-6 text-center">
              <p className="text-lg font-black text-white sm:text-xl">Ready to stamp?</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggle}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-5 text-sm font-black uppercase"
                  style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                >
                  <Play size={16} fill="currentColor" /> Play again
                </button>
                <Link
                  to="/stamp"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-5 text-sm font-black uppercase"
                  style={{ borderColor: 'rgba(240,180,41,0.55)', color: 'var(--accent-gold)' }}
                >
                  Stamp free <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>

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
            <span>{fmt(total)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-6 text-sm font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
            {playing ? 'Pause' : ended || t >= total - 0.2 ? 'Play again' : 'Play'}
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
            title="Mute / unmute video audio"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? 'Sound off' : 'Sound on'}
          </button>
          <Link
            to="/stamp"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-5 text-sm font-black uppercase"
            style={{ borderColor: 'rgba(240,180,41,0.45)', color: 'var(--accent-gold)' }}
          >
            Stamp free <ArrowRight size={16} />
          </Link>
        </div>

        <section
          className="mt-10 rounded-2xl border p-5 sm:p-8"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <h2 className="font-display text-lg font-black sm:text-xl">
            Teaser board <span className="gold-text">(~{Math.round(total)}s)</span>
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Video file: <code className="text-[11px]">satohash-explainer-with-vo.mp4</code> — VO
            baked in. Longer educational cut later; keep the full script offline until then.
          </p>
          <ol className="mt-6 space-y-4">
            {SCRIPT_BEATS.map((b) => (
              <li
                key={b.id}
                className="flex gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-primary)'
                }}
              >
                <span
                  className="shrink-0 text-[10px] font-black tracking-wider uppercase"
                  style={{ color: 'var(--accent-gold)', minWidth: '3.5rem' }}
                >
                  {b.t}
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
