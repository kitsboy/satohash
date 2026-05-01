import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function MerkleHeart() {
  const [nodes, setNodes] = useState([])
  const [lines, setLines] = useState([])

  useEffect(() => {
    // Generate static nodes for the tree
    const newNodes = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 10
    }))
    setNodes(newNodes)

    // Generate static line endpoints
    const newLines = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x2: 20 + Math.random() * 60,
      y2: 20 + Math.random() * 60,
      duration: 5 + i,
      delay: i
    }))
    setLines(newLines)
  }, [])

  return (
    <div className="pointer-events-none relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-[0.05]" />

      {/* The Central Root */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          boxShadow: [
            '0 0 20px var(--accent-active)',
            '0 0 50px var(--accent-active)',
            '0 0 20px var(--accent-active)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute z-20 h-4 w-4 rounded-full bg-[var(--accent-active)]"
      />

      {/* Floating Leaves */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
            x: [`${node.x - 50}%`, `${(node.x - 50) * 0.2}%`],
            y: [`${node.y - 50}%`, `${(node.y - 50) * 0.2}%`]
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            delay: node.delay,
            ease: 'easeOut'
          }}
          className="absolute h-1 w-1 rounded-full bg-[var(--accent-active)] blur-[1px]"
        />
      ))}

      {/* Connection Lines (Abstract) */}
      <svg className="absolute inset-0 h-full w-full opacity-10">
        <defs>
          <radialGradient id="line-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-active)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-active)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1="50%"
            y1="50%"
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#line-grad)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: line.duration, repeat: Infinity, delay: line.delay }}
          />
        ))}
      </svg>

      {/* 3D Wireframe Spheres */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border border-[var(--accent-active)]/10"
          style={{
            width: `${200 + i * 150}px`,
            height: `${200 + i * 150}px`,
            transform: `rotateX(${45 + i * 15}deg) rotateY(${45 + i * 15}deg)`
          }}
        />
      ))}
    </div>
  )
}
