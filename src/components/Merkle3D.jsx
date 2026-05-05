import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Network, Search, Box, Lock, Activity, ChevronRight, Zap } from 'lucide-react';

export default function Merkle3D({ hash }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(500, 500);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Group for the entire tree
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Create a sophisticated "Merkle Tree" structure
    const nodeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4f46e5, 
      emissive: 0x4f46e5,
      emissiveIntensity: 0.8,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });

    const rootGeometry = new THREE.IcosahedronGeometry(0.8, 2);
    const rootNode = new THREE.Mesh(rootGeometry, nodeMaterial);
    rootNode.position.set(0, 2.5, 0);
    treeGroup.add(rootNode);

    // Animated Rings around Root
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    rootNode.add(ring);

    // Level 1 Nodes
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.4 });
    const leafGeometry = new THREE.IcosahedronGeometry(0.3, 1);
    
    const leaves = [];
    for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        const angle = (i / 4) * Math.PI * 2;
        leaf.position.set(Math.cos(angle) * 3, -2, Math.sin(angle) * 3);
        treeGroup.add(leaf);
        leaves.push(leaf);

        // Connect with glowing paths
        const points = [rootNode.position, leaf.position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.2 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        treeGroup.add(line);
    }

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 10;
    camera.position.y = 1;

    let frame = 0;
    const animate = () => {
      frame++;
      requestAnimationFrame(animate);
      treeGroup.rotation.y += 0.003;
      ring.rotation.z += 0.01;
      
      // Gentle floating animation
      rootNode.position.y = 2.5 + Math.sin(frame * 0.02) * 0.2;
      leaves.forEach((leaf, i) => {
          leaf.position.y = -2 + Math.cos(frame * 0.03 + i) * 0.1;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
    };
  }, []);

  return (
    <div className="relative h-[500px] w-full bg-[#0c1220] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl group selection:bg-indigo-500/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        {/* Elite Overlay HUD */}
        <div className="absolute top-12 left-12 z-10 flex flex-col gap-6">
            <div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-active)] text-white shadow-2xl shadow-[var(--accent-active)]/30"
                >
                    <Network size={28} />
                </motion.div>
                <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase italic leading-none mb-2">Interactive <br /> <span className="text-[var(--accent-active)]">DEPTH_EXPLORER.</span></h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">Merkle_Traversal_L4 Active</p>
            </div>
            
            <div className="space-y-3">
               <TraceStatus label="Genesis Root" value="0x3c8e...f21a" color="indigo" />
               <TraceStatus label="Leaf Atoms" value="Verified_1024" color="emerald" />
            </div>
        </div>

        <div className="absolute top-12 right-12 z-10 hidden md:flex flex-col gap-4">
            <HudPill icon={Lock} label="ZK_HARDENED" active />
            <HudPill icon={Zap} label="BOLT-12_SYNC" active />
            <HudPill icon={Activity} label="REALTIME_PULSE" pulse />
        </div>

        <div ref={mountRef} className="flex items-center justify-center h-full w-full" />
        
        {/* Bottom Interactive Controls */}
        <div className="absolute bottom-12 left-12 right-12 z-10 flex items-center justify-between">
            <div className="flex gap-4">
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-[var(--accent-active)] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <Search size={14} /> SCRUB_HISTORY
                </button>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <Box size={14} /> EXPORT_ROOT
                </button>
            </div>
            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic font-mono">
                {hash ? `PROT_ID: ${hash.substring(0, 16)}...` : 'IDLE_PROT_WAIT'}
            </div>
        </div>
    </div>
  );
}

function HudPill({ icon: Icon, label, active, pulse }) {
    return (
        <div className={`px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 transition-all ${active ? 'opacity-100' : 'opacity-20'}`}>
            <Icon size={12} className={pulse ? 'animate-pulse' : ''} style={{ color: 'var(--accent-active)' }} />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">{label}</span>
        </div>
    )
}

function TraceStatus({ label, value, color }) {
    const colorClass = color === 'indigo' ? 'bg-[var(--accent-active)]' : 'bg-emerald-500';
    return (
        <div className="flex items-center gap-4 group">
            <div className={`h-1.5 w-1.5 rounded-full ${colorClass} group-hover:scale-150 transition-all`} />
            <div className="flex items-baseline gap-2">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{label}:</span>
                <span className="text-[10px] font-black text-white italic">{value}</span>
            </div>
        </div>
    )
}
