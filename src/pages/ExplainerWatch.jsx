import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Play, Pause, Volume2, VolumeX, ArrowRight, RotateCcw } from 'lucide-react'
import MarketingDesktopNav from '../components/layout/MarketingDesktopNav'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

/** Query busts CF/browser cache when the same path is overwritten. */
const CUTS = {
  full: {
    id: 'full',
    src: 'https://videos.giveabit.io/media/video/satohash-explainer-with-vo2.mp4?v=kimi-noir-20260819',
    file: 'satohash-explainer-with-vo2.mp4',
    seconds: 84,
    label: '~84s',
    titleKey: 'watchPage.fullTitle',
    ariaKey: 'watchPage.fullAria'
  },
  short: {
    id: 'short',
    src: 'https://videos.giveabit.io/media/video/satohash-explainer-with-vo.mp4?v=10s-kimi-20260804',
    file: 'satohash-explainer-with-vo.mp4',
    seconds: 10,
    label: '10s',
    titleKey: 'watchPage.teaserTitle',
    ariaKey: 'watchPage.teaserAria'
  }
}

const POSTER_SRC = '/media/video/kimi-teacher.jpg'

const FULL_BEATS = [
  { id: 'hook', t: '0:00', titleKey: 'watchPage.fullHookTitle', lineKey: 'watchPage.fullHookLine' },
  {
    id: 'problem',
    t: '0:07',
    titleKey: 'watchPage.fullProblemTitle',
    lineKey: 'watchPage.fullProblemLine'
  },
  { id: 'how', t: '0:19', titleKey: 'watchPage.fullHowTitle', lineKey: 'watchPage.fullHowLine' },
  {
    id: 'batch',
    t: '0:33',
    titleKey: 'watchPage.fullBatchTitle',
    lineKey: 'watchPage.fullBatchLine'
  },
  {
    id: 'verify',
    t: '0:43',
    titleKey: 'watchPage.fullVerifyTitle',
    lineKey: 'watchPage.fullVerifyLine'
  },
  { id: 'cta', t: '0:52', titleKey: 'watchPage.fullCtaTitle', lineKey: 'watchPage.fullCtaLine' }
]

const SHORT_BEATS = [
  {
    id: 'hook',
    t: '0:00',
    titleKey: 'watchPage.shortHookTitle',
    lineKey: 'watchPage.shortHookLine'
  },
  {
    id: 'privacy',
    t: '0:03',
    titleKey: 'watchPage.shortPrivacyTitle',
    lineKey: 'watchPage.shortPrivacyLine'
  },
  {
    id: 'anchor',
    t: '0:06',
    titleKey: 'watchPage.shortAnchorTitle',
    lineKey: 'watchPage.shortAnchorLine'
  },
  { id: 'cta', t: '0:08', titleKey: 'watchPage.shortCtaTitle', lineKey: 'watchPage.shortCtaLine' }
]

function fmt(s) {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function ExplainerWatch() {
  const { t: tw } = useTranslation()
  usePageMeta({
    page: 'watch'
  })

  const videoRef = useRef(null)
  const [cutId, setCutId] = useState('full')
  const cut = CUTS[cutId]
  const beats = cutId === 'full' ? FULL_BEATS : SHORT_BEATS
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [total, setTotal] = useState(cut.seconds)
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
    setPlaying(false)
    setEnded(false)
    setReady(false)
    setT(0)
    setTotal(CUTS[cutId].seconds)
  }, [cutId])

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
  }, [syncFromVideo, total, cutId])

  useEffect(() => {
    const v = videoRef.current
    if (v) v.muted = muted
  }, [muted, cutId])

  const attachActiveSrc = () => {
    const v = videoRef.current
    if (!v) return
    const nextSrc = CUTS[cutId].src
    if (v.getAttribute('src') !== nextSrc) {
      v.src = nextSrc
    }
  }

  const toggle = async () => {
    const v = videoRef.current
    if (!v) return
    attachActiveSrc()
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

  const switchCut = (id) => {
    if (id === cutId) return
    const v = videoRef.current
    if (v) {
      v.pause()
      v.removeAttribute('src')
      v.load()
    }
    setCutId(id)
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
            {tw('watchPage.kicker', { seconds: Math.round(total) })}
          </p>
          <h1 className="font-display text-2xl font-black tracking-tight sm:text-4xl">
            {tw('watchPage.titleBefore')}{' '}
            <span className="gold-text">{tw('watchPage.titleHighlight')}</span>
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
            {tw('watchPage.subtitle')}
          </p>
        </div>

        <div
          className="mb-4 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label={tw('watchPage.lengthAria')}
        >
          {Object.values(CUTS).map((c) => {
            const active = c.id === cutId
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchCut(c.id)}
                className="inline-flex min-h-[44px] items-center rounded-2xl border px-4 text-xs font-black tracking-widest uppercase"
                style={{
                  borderColor: active ? 'var(--accent-gold)' : 'var(--border)',
                  color: active ? '#141b25' : 'var(--text-secondary)',
                  background: active ? 'var(--accent-gold)' : 'transparent'
                }}
              >
                {tw(c.titleKey)} ({c.label})
              </button>
            )
          })}
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
            key={cutId}
            ref={videoRef}
            poster={POSTER_SRC}
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full bg-black object-contain"
            onClick={toggle}
            aria-label={tw(cut.ariaKey)}
          />

          {(!playing || !ready) && !ended && t < 0.15 && (
            <button
              type="button"
              onClick={toggle}
              className="group absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
              aria-label={tw('watchPage.playExplainer')}
            >
              <span
                className="flex h-16 min-h-[44px] w-16 min-w-[44px] items-center justify-center rounded-full transition-all group-hover:scale-105 group-hover:shadow-[0_0_28px_var(--accent-gold-glow)] sm:h-20 sm:w-20"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                <Play size={28} fill="currentColor" className="ml-1" />
              </span>
            </button>
          )}

          {ended && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/55 p-6 text-center">
              <p className="text-lg font-black text-white sm:text-xl">
                {tw('watchPage.readyToStamp')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggle}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-5 text-sm font-black uppercase"
                  style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                >
                  <Play size={16} fill="currentColor" /> {tw('watchPage.playAgain')}
                </button>
                <Link
                  to="/stamp"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-5 text-sm font-black uppercase"
                  style={{ borderColor: 'rgba(240,180,41,0.55)', color: 'var(--accent-gold)' }}
                >
                  {tw('watchPage.stampFree')} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div
          className="vault-ring mt-4 rounded-2xl border p-4 text-sm leading-relaxed"
          data-testid="pending-vs-confirmed"
          style={{ borderColor: 'var(--border-gold)', background: 'var(--surface-raised)' }}
        >
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            {tw('watchPage.pendingNe')}
          </p>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>
              {tw('watchPage.pendingBodyBefore')}
            </strong>{' '}
            {tw('watchPage.pendingBodyMid')}{' '}
            <strong style={{ color: 'var(--accent-success)' }}>
              {tw('watchPage.confirmedWord')}
            </strong>{' '}
            {tw('watchPage.pendingBodyAfter')}
          </p>
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
            {playing
              ? tw('watchPage.pause')
              : ended || t >= total - 0.2
                ? tw('watchPage.playAgain')
                : tw('watchPage.play')}
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 text-sm font-bold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <RotateCcw size={16} /> {tw('watchPage.restart')}
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 text-sm font-bold"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            title={tw('watchPage.muteTitle')}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? tw('watchPage.soundOff') : tw('watchPage.soundOn')}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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
            {tw('watchPage.board', { title: tw(cut.titleKey) })}{' '}
            <span className="gold-text">(~{Math.round(total)}s)</span>
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {tw('watchPage.videoFile')} <code className="text-[11px]">{cut.file}</code> —{' '}
            {tw('watchPage.voBaked')}
          </p>
          <ol className="mt-6 space-y-4">
            {beats.map((b) => (
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
                    {tw(b.titleKey)}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed sm:text-[15px]">{tw(b.lineKey)}</p>
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
