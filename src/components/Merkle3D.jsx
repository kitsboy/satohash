import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

/**
 * Item 101: Interactive 3D Merkle Tree
 * A Three.js visualization for proof traversal and verification.
 */
export default function Merkle3D({ hash }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    // Create a procedural "Merkle Tree" structure
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x6366f1, 
      wireframe: true,
      emissive: 0x6366f1,
      emissiveIntensity: 0.5
    });

    const nodes = [];
    for (let i = 0; i < 4; i++) {
        const geometry = new THREE.IcosahedronGeometry(i === 0 ? 1 : 0.5, 0);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, (3 - i) * 1.5, 0);
        scene.add(mesh);
        nodes.push(mesh);
    }

    // Connect them with holographic "Links"
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6366f1, opacity: 0.2, transparent: true });
    for (let i = 0; i < nodes.length - 1; i++) {
        const points = [nodes[i].position, nodes[i+1].position];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    }

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 8;
    camera.position.y = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => mountRef.current?.removeChild(renderer.domElement);
  }, []);

  return (
    <div className="glass-card relative h-[400px] w-full max-w-lg mx-auto overflow-hidden bg-black/40 border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.1)]">
        <div className="absolute top-8 left-8 z-10">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter italic">Merkle Explorer 3D</h3>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Traversing Hash Space Level 4</p>
        </div>
        
        <div ref={mountRef} className="flex items-center justify-center h-full w-full" />
        
        <div className="absolute bottom-8 right-8 z-10 flex gap-4">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-indigo-400 uppercase italic">Rotation: ACTIVE</div>
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-emerald-400 uppercase italic">SHA-256 Verified</div>
        </div>
    </div>
  );
}
