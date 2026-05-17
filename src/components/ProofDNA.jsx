import React, { useState, useMemo } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export default function ProofDNA({
  hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  size = 'md'
}) {
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [15, -15])
  const rotateY = useTransform(mouseX, [-50, 50], [-15, 15])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  // Generate visual tokens from hash
  const tokens = useMemo(() => {
    const parts = hash.match(/.{1,8}/g) || []
    return parts.map((p) => parseInt(p, 16))
  }, [hash])

  const colors = [
    `#${hash.substring(0, 6)}`,
    `#${hash.substring(6, 12)}`,
    `#${hash.substring(12, 18)}`
  ]

  const dims = size === 'sm' ? 'h-16 w-16' : 'h-32 w-32'
  const innerSize = size === 'sm' ? 32 : 64

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`relative flex items-center justify-center overflow-hidden rounded-3xl ${dims} border border-white/5 bg-[#05060b]/40 shadow-2xl transition-all duration-500 hover:border-white/20`}
    >
      {/* Holographic Diffuse Layer */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-700"
        style={{
          background: `linear-gradient(${tokens[0] % 360}deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          filter: 'blur(20px)'
        }}
      />

      {/* Generative SVG "DNA" Pattern */}
      <svg
        width={innerSize}
        height={innerSize}
        viewBox="0 0 100 100"
        className="relative z-10 opacity-80 mix-blend-screen"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Generative rings based on hash fragments */}
        {tokens.slice(0, 4).map((t, i) => (
          <motion.circle
            key={i}
            cx="50"
            cy="50"
            r={20 + (t % 25)}
            stroke="url(#grad)"
            strokeWidth="0.5"
            fill="none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: isHovered ? t % 360 : 0
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
            }}
          />
        ))}
        {/* Central Geometric Hub */}
        <rect
          x="45"
          y="45"
          width="10"
          height="10"
          fill="white"
          className="translate-x-1/2 translate-y-1/2 opacity-20"
          style={{ transform: `rotate(${tokens[4] % 90}deg)` }}
        />
      </svg>

      {/* Dynamic Light Source (Mouse Tracking) */}
      <motion.div
        className="pointer-events-none absolute h-[250%] w-[250%] rounded-full opacity-20 blur-[60px]"
        style={{
          background: `radial-gradient(circle, white 0%, transparent 70%)`,
          left: mouseX,
          top: mouseY,
          x: '-50%',
          y: '-50%'
        }}
      />

      {/* Seed Label */}
      <div className="absolute right-0 bottom-2 left-0 text-center">
        <span className="font-mono text-[7px] leading-none font-black tracking-[0.4em] text-white/20 uppercase italic">
          {hash.substring(0, 6)}
        </span>
      </div>

      {/* Glass Grain */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
    </motion.div>
  )
}
