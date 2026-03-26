import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

/**
 * Item 1: Holographic Proof DNA (Phase IV Upgrade)
 * Now features dynamic lighting and glassmorphism.
 */
export default function ProofDNA({ hash, size = "md" }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const colors = [
    `#${hash.substring(0, 6)}`,
    `#${hash.substring(6, 12)}`,
    `#${hash.substring(12, 18)}`
  ];
  
  const dims = size === "sm" ? "h-12 w-12" : "h-24 w-24";
  const borderRadius = (parseInt(hash.substring(2, 4), 16) % 30) + 12;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`relative flex items-center justify-center overflow-hidden rounded-[${borderRadius}px] ${dims} border border-white/10 glass-card p-4 shadow-2xl transition-shadow hover:shadow-[0_0_40px_${colors[0]}44]`}
    >
        {/* Holographic Diffuse Layer */}
        <div 
            className="absolute inset-0 opacity-90 transition-opacity"
            style={{ 
                background: `linear-gradient(135deg, ${colors[0]}88, ${colors[1]}66, ${colors[2]}44)`,
                filter: 'blur(4px)',
                mixBlendMode: 'overlay'
            }}
        />

        {/* Dynamic Light Source (Mouse Tracking) */}
        <motion.div 
            className="absolute h-[150%] w-[150%] rounded-full opacity-30 blur-2xl pointer-events-none"
            style={{ 
                background: `radial-gradient(circle, white 0%, transparent 60%)`,
                left: x,
                top: y,
                x: '-50%',
                y: '-50%'
            }}
        />

        {/* Binary Seed Label */}
        <span className="relative z-10 font-mono text-[8px] font-black text-white mix-blend-difference uppercase tracking-widest italic opacity-40">
            {hash.substring(0, 4)}
        </span>

        {/* Glass Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
}
